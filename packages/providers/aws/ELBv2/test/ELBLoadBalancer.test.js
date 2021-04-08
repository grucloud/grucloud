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
  let loadBalancerName = "lbv2";
  let targetGroupName = "targetGroup";
  let listenerHttpName = "listener-http";
  const types = ["LoadBalancer", "TargetGroup", "Listener"];

  before(async function () {
    try {
      ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    assert(provider.config.region);

    const vpc = await provider.makeVpc({
      name: "vpc-elbv2-test",
      properties: () => ({
        CidrBlock: "192.168.0.0/16",
      }),
    });

    const internetGateway = await provider.makeInternetGateway({
      name: "ig",
      dependencies: { vpc },
    });

    const subnet1 = await provider.makeSubnet({
      name: "subnet1",
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.0.0/19",
        AvailabilityZone: `${provider.config.region}a`,
      }),
    });
    const subnet2 = await provider.makeSubnet({
      name: "subnet2",
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "192.168.32.0/19",
        AvailabilityZone: `${provider.config.region}b`,
      }),
    });

    loadBalancer = await provider.makeLoadBalancer({
      name: loadBalancerName,
      dependencies: {
        subnets: [subnet1, subnet2],
      },
      properties: () => ({}),
    });

    targetGroup = await provider.makeTargetGroup({
      name: targetGroupName,
      dependencies: {
        vpc,
      },
      properties: () => ({}),
    });

    listenerHttp = await provider.makeListener({
      name: listenerHttpName,
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
            TargetGroupArn: targetGroup?.live.TargetGroupArn,
            Type: "forward",
          },
        ],
      }),
    });
  });
  after(async () => {});
  it.only("load balancer v2 apply plan", async function () {
    await testPlanDeploy({ provider, types });

    await testPlanDestroy({ provider, types });
  });
});
