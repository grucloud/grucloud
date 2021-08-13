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
    name: "jwt-rsa-aws-custom-authorizer",
    dependencies: { role: iamRole },
    properties: () => ({
      PackageType: "Zip",
      Handler: "index.handler",
      Runtime: "nodejs14.x",
    }),
  });

  const api = provider.apiGatewayV2.makeApi({
    name: "my-api",
    properties: () => ({}),
  });

  const apiGatewayDomainName = provider.apiGatewayV2.makeDomainName({
    name: config.domainName,
    dependencies: { certificate },
    properties: () => ({}),
  });

  provider.route53.makeRecord({
    name: `api-gateway-alias-record`,
    dependencies: { apiGatewayDomainName, hostedZone },
  });

  const integration = provider.apiGatewayV2.makeIntegration({
    name: "integration-lambda",
    dependencies: { api, lambdaFunction: lambdaFunction },
    properties: () => ({
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
  });

  provider.apiGatewayV2.makeRoute({
    name: config.apiGatewayV2.route.name,
    dependencies: { api, integration },
    properties: () => ({}),
  });

  const stage = provider.apiGatewayV2.makeStage({
    name: "my-api-stage-dev",
    dependencies: { api },
    properties: () => ({}),
  });
  // const authorizer = provider.apiGatewayV2.makeAuthorizer({
  //   name: "my-authorizer-stage-dev",
  //   dependencies: { api },
  //   properties: () => ({}),
  // });
  provider.apiGatewayV2.makeApiMapping({
    name: "api-mapping-dev",
    dependencies: { api, stage, domainName: apiGatewayDomainName },
    properties: () => ({ ApiMappingKey: "my-function" }),
  });

  provider.apiGatewayV2.makeDeployment({
    name: "my-api-deployment",
    dependencies: { api, stage },
    properties: () => ({}),
  });
};

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({ provider });

  return {
    provider,
  };
};
