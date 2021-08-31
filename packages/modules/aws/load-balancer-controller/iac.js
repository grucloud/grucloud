const assert = require("assert");
const { get } = require("rubico");
exports.config = require("./config");
exports.hooks = [];

//TODO
const formatName = (name, config) => name;

const loadBalancerPolicy = require("./load-balancer-policy.json");

const NamespaceDefault = "LoadBalancerControllerRole";

const createResources = async ({
  provider,
  resources,
  namespace = NamespaceDefault,
}) => {
  const { config } = provider;
  const { awsLoadBalancerController, EKS } = config;
  assert(awsLoadBalancerController);
  assert(EKS);
  const clusterName = EKS.cluster.name;
  assert(clusterName);

  const { cluster } = resources;
  assert(cluster);

  const iamOpenIdConnectProvider = provider.IAM.makeOpenIDConnectProvider({
    name: formatName(
      awsLoadBalancerController.iamOpenIdConnectProvider.name,
      config
    ),
    namespace,
    dependencies: { cluster },
  });

  const iamLoadBalancerPolicy = provider.IAM.makePolicy({
    name: "AWSLoadBalancerControllerIAMPolicy",
    namespace,
    properties: () => ({
      PolicyDocument: loadBalancerPolicy,
      Description: "Load Balancer Policy",
    }),
  });

  const roleLoadBalancer = provider.IAM.makeRole({
    name: formatName(awsLoadBalancerController.role.name, config),
    namespace,
    dependencies: {
      openIdConnectProvider: iamOpenIdConnectProvider,
      policies: [iamLoadBalancerPolicy],
    },
  });

  return { roleLoadBalancer };
};

exports.createResources = createResources;
