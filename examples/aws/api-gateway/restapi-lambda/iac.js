const { AwsProvider } = require("@grucloud/provider-aws");

const lambdaPolicy = require("./lambdaPolicy.json");
const lambdaAssumePolicy = require("./lambdaAssumePolicy.json");

const createResources = ({ provider }) => {
  const { config } = provider;

  const domain = provider.Route53Domains.useDomain({
    name: config.domainName,
  });

  const hostedZone = provider.Route53.makeHostedZone({
    name: `${config.domainName}.`,
    dependencies: { domain },
  });

  const certificate = provider.ACM.makeCertificate({
    name: config.domainName,
  });

  provider.Route53.makeRecord({
    name: `certificate-validation-${config.domainName}.`,
    dependencies: { hostedZone, certificate },
  });

  const iamPolicy = provider.IAM.makePolicy({
    name: "lambda-policy",
    properties: () => lambdaPolicy,
  });

  const iamRole = provider.IAM.makeRole({
    name: "lambda-role",
    dependencies: { policies: [iamPolicy] },
    properties: () => lambdaAssumePolicy,
  });

  const lambdaFunction = provider.Lambda.makeFunction({
    name: "my-function",
    dependencies: { role: iamRole },
    properties: () => ({
      PackageType: "Zip",
      Handler: "my-function.handler",
      Runtime: "nodejs14.x",
    }),
  });

  const apiGatewayDomainName = provider.APIGateway.makeDomainName({
    name: config.domainName,
    dependencies: { regionalCertificate: certificate },
    properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
  });

  provider.Route53.makeRecord({
    name: `api-gateway-alias-record`,
    dependencies: { apiGatewayDomainName, hostedZone },
  });

  const restApi = provider.APIGateway.makeRestApi({
    name: "my-restapi",
    properties: () => ({ endpointConfiguration: { types: ["REGIONAL"] } }),
  });

  const modelPet = provider.APIGateway.makeModel({
    name: "modelPet",
    dependencies: { restApi },
    properties: () => ({
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
        type: {
          type: "string",
        },
        price: {
          type: "number",
        },
      },
    }),
  });

  const stage = provider.APIGateway.makeStage({
    name: "my-api-stage-dev",
    dependencies: { restApi },
    properties: () => ({}),
  });

  const resourceGet = provider.APIGateway.makeResource({
    name: "resource-get",
    dependencies: { restApi },
    properties: () => ({ pathPart: "/customers" }),
  });

  // const authorizer = provider.APIGateway.makeAuthorizer({
  //   name: "my-authorizer",
  //   dependencies: { restApi },
  //   properties: () => ({
  //     type: "TOKEN",
  //   }),
  // });

  const methodGet = provider.APIGateway.makeMethod({
    name: "method-get",
    dependencies: {
      resource: resourceGet,
      //authorizer,
    },
    properties: () => ({
      httpMethod: "GET",
      authorizationType: "NONE",
      type: "AWS_PROXY",
    }),
  });

  // const authorizer = provider.APIGateway.makeAuthorizer({
  //   name: "my-authorizer-stage-dev",
  //   dependencies: { restApi },
  //   properties: () => ({}),
  // });

  // provider.APIGateway.makeDeployment({
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
