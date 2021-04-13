const assert = require("assert");
exports.config = require("./config");
exports.hooks = [];

const createResources = async ({ provider, resources: { vpc, subnets } }) => {
  const { config } = provider;
  assert(vpc);
  assert(Array.isArray(subnets));
  assert(config.loadBalancer);
  assert(config.loadBalancer.name);

  const loadBalancer = await provider.makeLoadBalancer({
    name: config.loadBalancer.name,
    dependencies: {
      subnets,
    },
    properties: () => ({}),
  });

  const targetGroup = await provider.makeTargetGroup({
    name: "targetGroupNameTODO",
    dependencies: {
      vpc,
    },
    properties: () => ({}),
  });

  const listenerHttp = await provider.makeListener({
    name: "listenerHttpNameTODO",
    dependencies: {
      loadBalancer,
      targetGroups: [targetGroup],
    },
    properties: ({
      dependencies: {
        targetGroups: [targetGroup],
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

  return { loadBalancer };
};
exports.createResources = createResources;
