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

  const apiGatewayDomainName = provider.apiGateway.makeDomainName({
    name: config.domainName,
    dependencies: { regionalCertificate: certificate },
    properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
  });

  provider.route53.makeRecord({
    name: `api-gateway-alias-record`,
    dependencies: { apiGatewayDomainName, hostedZone },
  });

  const restApi = provider.apiGateway.makeRestApi({
    name: "my-restapi",
    properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
  });

  // const resourceGet = provider.apiGateway.makeResource({
  //   name: "resource-get",
  //   dependencies: { restApi },
  //   properties: () => ({ pathPart: "/customers" }),
  // });

  // const integration = provider.apiGateway.makeIntegration({
  //   name: "integration-lambda",
  //   dependencies: {
  //     restApi,
  //     resource: resourceGet,
  //     lambdaFunction: lambdaFunction,
  //   },
  //   properties: () => ({
  //     httpMethod: "GET",
  //     type: "AWS_PROXY",
  //   }),
  // });

  // const stage = provider.apiGateway.makeStage({
  //   name: "my-api-stage-dev",
  //   dependencies: { restApi },
  //   properties: () => ({}),
  // });

  // const authorizer = provider.apiGateway.makeAuthorizer({
  //   name: "my-authorizer-stage-dev",
  //   dependencies: { api },
  //   properties: () => ({}),
  // });

  // provider.apiGateway.makeDeployment({
  //   name: "my-api-deployment",
  //   dependencies: { restApi, stage },
  //   properties: () => ({}),
  // });
};

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, { config: require("./config") });
  createResources({ provider });

  return {
    provider,
  };
};
