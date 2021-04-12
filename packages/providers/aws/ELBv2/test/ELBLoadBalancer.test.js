const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

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

    const vpc = await provider.makeVpc({
      name: `vpc-${projectName}`,
      properties: () => ({
        CidrBlock: "192.168.0.0/16",
      }),
    });
    const securityGroupLoadBalancer = await provider.makeSecurityGroup({
      name: "load-balancer-security-group-test",
      dependencies: { vpc },
      properties: () => ({
        create: {
          Description: "Load Balancer HTTP HTTPS Security Group",
        },
        ingress: {
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
        },
      }),
    });
    const internetGateway = await provider.makeInternetGateway({
      name: `ig-${projectName}`,
      dependencies: { vpc },
    });

    const subnet1 = await provider.makeSubnet({
      name: `subnet1-${projectName}`,
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.0.0/19",
        AvailabilityZone: `${provider.config.region}a`,
      }),
    });
    const subnet2 = await provider.makeSubnet({
      name: `subnet2-${projectName}`,
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.32.0/19",
        AvailabilityZone: `${provider.config.region}b`,
      }),
    });

    loadBalancer = await provider.makeLoadBalancer({
      name: `${loadBalancerName}-${projectName}`,
      dependencies: {
        subnets: [subnet1, subnet2],
        securityGroups: [securityGroupLoadBalancer],
      },
      properties: () => ({}),
    });

    targetGroup = await provider.makeTargetGroup({
      name: `${targetGroupName}-${projectName}`,
      dependencies: {
        vpc,
      },
      properties: () => ({
        Port: 3000,
      }),
    });

    listenerHttp = await provider.makeListener({
      name: `${listenerHttpName}-${projectName}`,
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
    await testPlanDeploy({ provider, types });

    await testPlanDestroy({ provider, types });
  });
});
