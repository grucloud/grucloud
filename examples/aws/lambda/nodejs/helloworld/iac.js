const { AwsProvider } = require("@grucloud/provider-aws");

const lambdaPolicy = require("./lambdaPolicy.json");
const lambdaAssumePolicy = require("./lambdaAssumePolicy.json");

const createResources = async ({ provider }) => {
  const { config } = provider;

  const iamPolicy = provider.IAM.makePolicy({
    name: "lambda-policy",
    properties: () => lambdaPolicy,
  });

  const iamRole = provider.IAM.makeRole({
    name: "lambda-role",
    dependencies: { policies: [iamPolicy] },
    properties: () => lambdaAssumePolicy,
  });

  const layer = provider.Lambda.makeLayer({
    name: "lambda-layer",
    dependencies: { role: iamRole },
    properties: () => ({
      CompatibleRuntimes: ["nodejs"],
      Description: "My Layer",
    }),
  });

  const lambda = provider.Lambda.makeFunction({
    name: "lambda-hello-world",
    dependencies: { role: iamRole, layers: [layer] },
    properties: () => ({
      PackageType: "Zip",
      Handler: "helloworld.handler",
      Runtime: "nodejs14.x",
    }),
  });

  return {};
};

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  const resources = await createResources({ provider });

  return {
    provider,
    resources,
    hooks: [require("./hook")],
  };
};
