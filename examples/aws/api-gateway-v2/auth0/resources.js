const createResources = ({ provider }) => {
  provider.ApiGatewayV2.makeDomainName({
    name: "grucloud.org",
    dependencies: ({ resources }) => ({
      certificate: resources.ACM.Certificate.grucloudOrg,
    }),
  });

  provider.ApiGatewayV2.makeApi({
    name: "my-api",
    properties: ({ config }) => ({
      ProtocolType: "HTTP",
      ApiKeySelectionExpression: "$request.header.x-api-key",
      DisableExecuteApiEndpoint: false,
      RouteSelectionExpression: "$request.method $request.path",
    }),
  });

  provider.ApiGatewayV2.makeStage({
    name: "my-api-stage-dev",
    properties: ({ config }) => ({
      AccessLogSettings: {
        Format:
          '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId',
      },
    }),
    dependencies: ({ resources }) => ({
      api: resources.ApiGatewayV2.Api.myApi,
      logGroup: resources.CloudWatchLogs.LogGroup.lgHttpTest,
    }),
  });

  provider.ApiGatewayV2.makeAuthorizer({
    name: "authorizer-auth0",
    properties: ({ config }) => ({
      AuthorizerType: "JWT",
      IdentitySource: ["$request.header.Authorization"],
      JwtConfiguration: {
        Audience: ["https://api.grucloud.org"],
        Issuer: "https://dev-zojrhsju.us.auth0.com/",
      },
    }),
    dependencies: ({ resources }) => ({
      api: resources.ApiGatewayV2.Api.myApi,
    }),
  });

  provider.ApiGatewayV2.makeApiMapping({
    properties: ({ config }) => ({
      ApiMappingKey: "",
    }),
    dependencies: ({ resources }) => ({
      api: resources.ApiGatewayV2.Api.myApi,
      domainName: resources.ApiGatewayV2.DomainName.grucloudOrg,
      stage: resources.ApiGatewayV2.Stage.myApiStageDev,
    }),
  });

  provider.ApiGatewayV2.makeIntegration({
    properties: ({ config }) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
    dependencies: ({ resources }) => ({
      api: resources.ApiGatewayV2.Api.myApi,
      lambdaFunction: resources.Lambda.Function.myFunction,
    }),
  });

  provider.ApiGatewayV2.makeRoute({
    properties: ({ config }) => ({
      ApiKeyRequired: false,
      AuthorizationType: "JWT",
      RouteKey: "ANY /my-function",
    }),
    dependencies: ({ resources }) => ({
      api: resources.ApiGatewayV2.Api.myApi,
      integration:
        resources.ApiGatewayV2.Integration.integrationMyApiMyFunction,
      authorizer: resources.ApiGatewayV2.Authorizer.authorizerAuth0,
    }),
  });

  provider.ApiGatewayV2.makeDeployment({
    dependencies: ({ resources }) => ({
      api: resources.ApiGatewayV2.Api.myApi,
      stage: resources.ApiGatewayV2.Stage.myApiStageDev,
    }),
  });

  provider.ACM.makeCertificate({
    name: "grucloud.org",
  });

  provider.CloudWatchLogs.makeLogGroup({
    name: "lg-http-test",
  });

  provider.IAM.makeRole({
    name: "lambda-role",
    properties: ({ config }) => ({
      Path: "/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ resources }) => ({
      policies: [resources.IAM.Policy.lambdaPolicy],
    }),
  });

  provider.IAM.makePolicy({
    name: "lambda-policy",
    properties: ({ config }) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["logs:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow logs",
    }),
  });

  provider.Lambda.makeFunction({
    name: "my-function",
    properties: ({ config }) => ({
      Handler: "my-function.handler",
      PackageType: "Zip",
      Runtime: "nodejs14.x",
      Description: "",
      Timeout: 3,
      MemorySize: 128,
    }),
    dependencies: ({ resources }) => ({
      role: resources.IAM.Role.lambdaRole,
    }),
  });

  provider.Route53.makeHostedZone({
    name: "grucloud.org.",
    dependencies: ({ resources }) => ({
      domain: resources.Route53Domains.Domain.grucloudOrg,
    }),
  });

  provider.Route53.makeRecord({
    name: "api-gateway-alias-record",
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone.grucloudOrg,
      apiGatewayV2DomainName: resources.ApiGatewayV2.DomainName.grucloudOrg,
    }),
  });

  provider.Route53.makeRecord({
    name: "certificate-validation-grucloud.org.",
    dependencies: ({ resources }) => ({
      hostedZone: resources.Route53.HostedZone.grucloudOrg,
      certificate: resources.ACM.Certificate.grucloudOrg,
    }),
  });

  provider.Route53Domains.useDomain({
    name: "grucloud.org",
  });
};

exports.createResources = createResources;
