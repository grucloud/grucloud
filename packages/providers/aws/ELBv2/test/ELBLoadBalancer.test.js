const assert = require("assert");
const { pipe, tap, eq, get, and } = require("rubico");
const { find } = require("rubico/x");

const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

const formatName = (name) => `${name}-test-load-balancer`;
describe("AwsLoadBalancerV2", async function () {
  let config;
  let provider;
  let loadBalancer;
  let targetGroup;
  let listenerHttp;
  const projectName = "elb-test";
  const loadBalancerName = "load-balancer";
  const targetGroupName = "targetGroup";
  const listenerHttpName = "listener-http";
  const types = ["LoadBalancer", "TargetGroup", "Listener", "Rule"];

  before(async function () {
    try {
      ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName }),
    });
    assert(provider.config.region);

    const vpc = await provider.ec2.makeVpc({
      name: formatName("vpc"),
      properties: () => ({
        CidrBlock: "192.168.0.0/16",
      }),
    });
    const securityGroupLoadBalancer = await provider.ec2.makeSecurityGroup({
      name: formatName("load-balancer-security-group-test"),
      dependencies: { vpc },
      properties: () => ({
        create: {
          Description: "Load Balancer HTTP HTTPS Security Group",
        },
      }),
    });

    const sgRuleIngressHttp = await provider.ec2.makeSecurityGroupRuleIngress({
      name: formatName("sg-rule-ingress-http"),
      dependencies: {
        securityGroup: securityGroupLoadBalancer,
      },
      properties: () => ({
        IpPermissions: [
          {
            FromPort: 80,
            IpProtocol: "tcp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
            ToPort: 80,
          },
        ],
      }),
    });
    const sgRuleIngressHttps = await provider.ec2.makeSecurityGroupRuleIngress({
      name: formatName("sg-rule-ingress-https"),
      dependencies: {
        securityGroup: securityGroupLoadBalancer,
      },
      properties: () => ({
        IpPermissions: [
          {
            FromPort: 443,
            IpProtocol: "tcp",
            IpRanges: [
              {
                CidrIp: "0.0.0.0/0",
              },
            ],
            Ipv6Ranges: [
              {
                CidrIpv6: "::/0",
              },
            ],
            ToPort: 443,
          },
        ],
      }),
    });

    const internetGateway = await provider.ec2.makeInternetGateway({
      name: formatName("ig"),
      dependencies: { vpc },
    });

    const subnet1 = await provider.ec2.makeSubnet({
      name: formatName("subnet1"),
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.0.0/19",
        AvailabilityZone: `${provider.config.region}a`,
      }),
    });
    const subnet2 = await provider.ec2.makeSubnet({
      name: formatName("subnet2"),
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.32.0/19",
        AvailabilityZone: `${provider.config.region}b`,
      }),
    });

    loadBalancer = await provider.elb.makeLoadBalancer({
      name: formatName(loadBalancerName),
      dependencies: {
        subnets: [subnet1, subnet2],
        securityGroups: [securityGroupLoadBalancer],
      },
      properties: () => ({}),
    });

    targetGroup = await provider.elb.makeTargetGroup({
      name: formatName(targetGroupName),
      dependencies: {
        vpc,
      },
      properties: () => ({
        Port: 3000,
      }),
    });

    listenerHttp = await provider.elb.makeListener({
      name: formatName(listenerHttpName),
      dependencies: {
        loadBalancer,
        targetGroups: { targetGroup },
      },
      properties: ({
        dependencies: {
          targetGroups: { targetGroup },
        },
      }) => ({
        Port: 80,
        Protocol: "HTTP",
        DefaultActions: [
          {
            TargetGroupArn: targetGroup?.live?.TargetGroupArn,
            Type: "forward",
          },
        ],
      }),
    });
  });
  after(async () => {});
  it("load balancer v2 apply plan", async function () {
    const loadBalancerReadOnly = await provider.elb.useLoadBalancer({
      name: "load-balancer-k8s-readonly",
      filterLives: ({ items }) =>
        pipe([
          () => items,
          find(
            pipe([
              get("Tags"),
              find(
                and([
                  eq(get("Key"), "Name"), //
                  eq(get("Value"), loadBalancer.name),
                ])
              ),
            ])
          ),
          tap((lb) => {
            assert(true);
          }),
        ])(),
    });

    const domainName = "test-load-balancer.grucloud.org";
    const hostedZoneName = "hostedZoneNameTODO";

    const hostedZone = await provider.route53.makeHostedZone({
      name: `${domainName}.`,
    });

    const loadBalancerRecord = await provider.route53.makeRoute53Record({
      name: `dns-record-alias-load-balancer-${hostedZoneName}`,
      dependencies: { hostedZone, loadBalancerReadOnly, loadBalancer },
      properties: ({ dependencies }) => {
        const hostname = dependencies.loadBalancerReadOnly.live?.DNSName;
        if (!hostname) {
          return {
            message: "loadBalancer not up yet",
            Type: "A",
            Name: hostedZone.name,
          };
        }
        return {
          Name: hostedZone.name,
          Type: "A",
          AliasTarget: {
            HostedZoneId:
              dependencies.loadBalancerReadOnly?.live.CanonicalHostedZoneId,
            DNSName: `${hostname}.`,
            EvaluateTargetHealth: false,
          },
        };
      },
    });

    await testPlanDeploy({ provider, types });

    await testPlanDestroy({ provider, types });
  });
});
