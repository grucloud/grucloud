const { get } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");

const lambdaPolicy = require("./lambdaPolicy.json");
const lambdaAssumePolicy = require("./lambdaAssumePolicy.json");

const createResources = ({ provider }) => {
  const { config } = provider;

  const domain = provider.route53Domain.useDomain({
    name: config.domainName,
  });

  const hostedZone = provider.route53.makeHostedZone({
    name: `${config.domainName}.`,
    dependencies: { domain },
  });

  const certificate = provider.acm.makeCertificate({
    name: config.domainName,
  });

  provider.route53.makeRecord({
    name: `certificate-validation-${config.domainName}.`,
    dependencies: { hostedZone, certificate },
  });

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
    properties: () => ({}),
  });

  const apiGatewayDomainName = provider.apigateway.makeDomainName({
    name: config.domainName,
    dependencies: { certificate },
    properties: () => ({}),
  });

  provider.route53.makeRecord({
    name: `api-gateway-alias-record`,
    dependencies: { apiGatewayDomainName, hostedZone },
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

  provider.apigateway.makeRoute({
    name: config.apigateway.route.name,
    dependencies: { api, integration },
    properties: () => ({}),
  });

  const stage = provider.apigateway.makeStage({
    name: "my-api-stage-dev",
    dependencies: { api },
    properties: () => ({}),
  });

  provider.apigateway.makeApiMapping({
    name: "api-mapping-dev",
    dependencies: { api, stage, domainName: apiGatewayDomainName },
    properties: () => ({ ApiMappingKey: "my-function" }),
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
