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
  const projectName = "elbv2-test";
  const loadBalancerName = "load-balancer";
  const targetGroupName = "targetGroup";
  const listenerHttpName = "listener-http";
  const types = [
    "LoadBalancer",
    "TargetGroup",
    "Listener",
    "Rule",
    "InternetGateway",
    "SecurityGroup",
    "SecurityGroupRuleIngress",
    "Record",
    "Subnet",
    "Vpc",
    "HostedZone",
  ];

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

    const vpc = provider.EC2.makeVpc({
      name: formatName("vpc"),
      properties: () => ({
        CidrBlock: "192.168.0.0/16",
      }),
    });
    const securityGroupLoadBalancer = provider.EC2.makeSecurityGroup({
      name: formatName("security-group-load-balancer-test"),
      dependencies: { vpc },
      properties: () => ({
        Description: "Load Balancer HTTP HTTPS Security Group",
      }),
    });

    const sgRuleIngressHttp = provider.EC2.makeSecurityGroupRuleIngress({
      name: formatName("sg-rule-ingress-http"),
      dependencies: {
        securityGroup: securityGroupLoadBalancer,
      },
      properties: () => ({
        IpPermission: {
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
      }),
    });
    const sgRuleIngressHttps = provider.EC2.makeSecurityGroupRuleIngress({
      name: formatName("sg-rule-ingress-https"),
      dependencies: {
        securityGroup: securityGroupLoadBalancer,
      },
      properties: () => ({
        IpPermission: {
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
      }),
    });

    const internetGateway = provider.EC2.makeInternetGateway({
      name: formatName("ig"),
      dependencies: { vpc },
    });

    const subnet1 = provider.EC2.makeSubnet({
      name: formatName("subnet1"),
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.0.0/19",
        AvailabilityZone: `${provider.config.region}a`,
      }),
    });
    const subnet2 = provider.EC2.makeSubnet({
      name: formatName("subnet2"),
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.32.0/19",
        AvailabilityZone: `${provider.config.region}b`,
      }),
    });

    loadBalancer = provider.ELBv2.makeLoadBalancer({
      name: formatName(loadBalancerName),
      dependencies: {
        subnets: [subnet1, subnet2],
        securityGroups: [securityGroupLoadBalancer],
      },
      properties: () => ({}),
    });

    targetGroup = provider.ELBv2.makeTargetGroup({
      name: formatName(targetGroupName),
      dependencies: {
        vpc,
      },
      properties: () => ({
        Port: 3000,
      }),
    });

    listenerHttp = provider.ELBv2.makeListener({
      name: formatName(listenerHttpName),
      dependencies: {
        loadBalancer,
        targetGroup: targetGroup,
      },
      properties: () => ({
        Port: 80,
        Protocol: "HTTP",
      }),
    });
  });
  after(async () => {});
  it.skip("load balancer v2 apply plan", async function () {
    const { config } = provider;
    assert(config.nameKey);
    const loadBalancerReadOnly = provider.ELBv2.useLoadBalancer({
      name: "load-balancer-k8s-readonly",
      filterLives: ({ resources }) =>
        pipe([
          () => resources,
          find(
            pipe([
              get("live.Tags"),
              find(
                and([
                  eq(get("Key"), config.nameKey),
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

    const hostedZone = provider.Route53.makeHostedZone({
      name: `${domainName}.`,
    });

    provider.Route53.makeRecord({
      dependencies: {
        hostedZone,
        loadBalancer: loadBalancerReadOnly,
        loadBalancerDep: loadBalancer, // Only for the load record to kick off when the balancer is up
      },
    });

    await testPlanDeploy({ provider, types });

    await testPlanDestroy({ provider, types });
  });
});
