const assert = require("assert");
const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/core");
const { K8sProvider } = require("@grucloud/core");

const podPolicy = require("./pod-policy.json");

const createAwsStack = async ({ config }) => {
  const provider = AwsProvider({ config });

  const iamPodPolicy = await provider.makeIamPolicy({
    name: "PodPolicy",
    properties: () => ({
      PolicyDocument: podPolicy,
      Description: "Pod Policy",
    }),
  });

  const rolePod = await provider.makeIamRole({
    name: "role-pod",
    dependencies: { policies: [iamPodPolicy] },
    properties: () => ({
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
  });
  return { provider, resources: { rolePod } };
};

const createK8sStack = async ({ config, resources: { rolePod } }) => {
  const provider = K8sProvider({ config });

  assert(config.namespaceName);
  assert(rolePod);

  const serviceAccountName = "service-account-aws";

  const namespace = await provider.makeNamespace({
    name: config.namespaceName,
  });

  const serviceAccount = await provider.makeServiceAccount({
    name: serviceAccountName,
    dependencies: { namespace, rolePod },
    properties: ({ dependencies: { rolePod } }) => ({
      annotations: {
        "eks.amazonaws.com/role-arn": get(
          "live.Arn",
          "<< rolePod.Arn not available yet >>"
        )(rolePod),
      },
    }),
  });

  return {
    provider,
    resources: {
      namespace,
      serviceAccount,
    },
  };
};

exports.createStack = async ({ config }) => {
  const awsStack = await createAwsStack({ config });
  const k8sStack = await createK8sStack({
    config,
    resources: awsStack.resources,
  });
  return { providers: [awsStack.provider, k8sStack.provider] };
};
