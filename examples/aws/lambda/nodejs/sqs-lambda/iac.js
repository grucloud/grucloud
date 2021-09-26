const { AwsProvider } = require("@grucloud/provider-aws");

const lambdaPolicy = require("./lambdaPolicy.json");
const lambdaAssumePolicy = require("./lambdaAssumePolicy.json");

const createResources = async ({ provider }) => {
  const iamPolicy = provider.IAM.makePolicy({
    name: "lambda-policy",
    properties: () => lambdaPolicy,
  });

  const iamRole = provider.IAM.makeRole({
    name: "lambda-role",
    dependencies: { policies: [iamPolicy] },
    properties: () => lambdaAssumePolicy,
  });

  const sqsQueue = provider.SQS.makeQueue({
    name: "my-queue-lambda",
    properties: () => ({
      Attributes: {
        VisibilityTimeout: "30",
        MaximumMessageSize: "262144",
        MessageRetentionPeriod: "345600",
        DelaySeconds: "0",
        ReceiveMessageWaitTimeSeconds: "0",
      },
      tags: {
        "my-tag": "my-value",
      },
    }),
  });

  const lambdaFunction = provider.Lambda.makeFunction({
    name: "lambda-hello-world",
    dependencies: { role: iamRole },
    properties: () => ({
      PackageType: "Zip",
      Handler: "helloworld.handler",
      Runtime: "nodejs14.x",
    }),
  });

  provider.Lambda.makeEventSourceMapping({
    name: "mapping-lambda-hello-world-my-queue-lambda",
    dependencies: { lambdaFunction, sqsQueue },
    properties: () => ({}),
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
