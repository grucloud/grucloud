const { AwsProvider } = require("@grucloud/provider-aws");

const lambdaPolicy = require("./lambdaPolicy.json");
const lambdaAssumePolicy = require("./lambdaAssumePolicy.json");

const createResources = ({ provider }) => {
  const { config } = provider;

  const iamPolicy = provider.iam.makePolicy({
    name: "lambda-policy",
    properties: () => lambdaPolicy,
  });

  const iamRole = provider.iam.makeRole({
    name: "lambda-role",
    dependencies: { policies: [iamPolicy] },
    properties: () => lambdaAssumePolicy,
  });

  const lambdaFunction = provider.lambda.makeFunction({
    name: "my-function",
    dependencies: { role: iamRole },
    properties: () => ({
      PackageType: "Zip",
      Handler: "my-function.handler",
      Runtime: "nodejs14.x",
    }),
  });

  const api = provider.apigateway.makeApi({
    name: "my-api",
    properties: () => ({
      //RouteKey: config.apigateway.route.name,
    }),
  });

  const integration = provider.apigateway.makeIntegration({
    name: "integration-lambda",
    dependencies: { api, lambdaFunction: lambdaFunction },
    properties: () => ({
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
  });

  const route = provider.apigateway.makeRoute({
    name: config.apigateway.route.name,
    dependencies: { api, integration },
    properties: () => ({}),
  });

  const stage = provider.apigateway.makeStage({
    name: "my-api-stage-dev",
    dependencies: { api },
    properties: () => ({}),
  });

  provider.apigateway.makeDeployment({
    name: "my-api-deployment",
    dependencies: { api, stage },
    properties: () => ({}),
  });
};

exports.createStack = async ({ config, stage }) => {
  const provider = AwsProvider({ config, stage });
  createResources({ provider });

  return {
    provider,
  };
};
