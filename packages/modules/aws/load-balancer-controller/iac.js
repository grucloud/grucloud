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
  const { awsLoadBalancerController, eks } = config;
  assert(awsLoadBalancerController);
  assert(eks);
  const clusterName = eks.cluster.name;
  assert(clusterName);

  const { cluster } = resources;
  assert(cluster);

  const iamOpenIdConnectProvider = provider.iam.makeOpenIDConnectProvider({
    name: formatName(
      awsLoadBalancerController.iamOpenIdConnectProvider.name,
      config
    ),
    namespace,
    dependencies: { cluster },
    properties: ({ dependencies: { cluster } }) => ({
      Url: get(
        "live.identity.oidc.issuer",
        "oidc.issuer not available yet"
      )(cluster),
      ClientIDList: ["sts.amazonaws.com"],
    }),
  });

  const iamLoadBalancerPolicy = provider.iam.makePolicy({
    name: "AWSLoadBalancerControllerIAMPolicy",
    namespace,
    properties: () => ({
      PolicyDocument: loadBalancerPolicy,
      Description: "Load Balancer Policy",
    }),
  });

  const roleLoadBalancer = provider.iam.makeRole({
    name: formatName(awsLoadBalancerController.role.name, config),
    namespace,
    dependencies: {
      iamOpenIdConnectProvider,
      policies: [iamLoadBalancerPolicy],
    },
    properties: ({ dependencies: { iamOpenIdConnectProvider } }) => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: get(
                "live.Arn",
                "iamOpenIdConnectProvider.Arn not yet known"
              )(iamOpenIdConnectProvider),
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                [`${get(
                  "live.Url",
                  "iamOpenIdConnectProvider.Url not yet known"
                )(iamOpenIdConnectProvider)}:aud`]: "sts.amazonaws.com",
              },
            },
          },
        ],
      },
    }),
  });

  return { roleLoadBalancer };
};

exports.createResources = createResources;
