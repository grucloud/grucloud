// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Api",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      CorsConfiguration: {
        AllowMethods: ["GET"],
        AllowOrigins: ["https://myapp.com"],
      },
      Description: "Cognito to HTTP API demo",
      Name: "sam-app",
    }),
  },
  {
    type: "Authorizer",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Name: "OAuth2Authorizer",
      AuthorizerType: "JWT",
      IdentitySource: ["$request.header.Authorization"],
      JwtConfiguration: {
        Audience: ["1mo18647lsr5iee4ghabm54v7e"],
      },
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      userPool: "UserPool-3Fx2HozhHSsp",
    }),
  },
  {
    type: "Deployment",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      Description:
        "Automatic deployment triggered by changes to the Api configuration",
      AutoDeployed: true,
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      stage: "sam-app::$default",
    }),
  },
  {
    type: "Integration",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      ConnectionType: "INTERNET",
      IntegrationMethod: "POST",
      IntegrationType: "AWS_PROXY",
      PayloadFormatVersion: "2.0",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      lambdaFunction: "sam-app-AppFunction-gKUxwsmxX2fK",
    }),
  },
  {
    type: "Route",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AuthorizationScopes: ["email"],
      AuthorizationType: "JWT",
      RouteKey: "GET /",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
      integration: "integration::sam-app::sam-app-AppFunction-gKUxwsmxX2fK",
      authorizer: "OAuth2Authorizer",
    }),
  },
  {
    type: "Stage",
    group: "ApiGatewayV2",
    properties: ({}) => ({
      AutoDeploy: true,
      StageName: "$default",
    }),
    dependencies: ({}) => ({
      api: "sam-app",
    }),
  },
  {
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
    properties: ({}) => ({
      Policies: {
        PasswordPolicy: {
          RequireLowercase: false,
          RequireNumbers: false,
          RequireSymbols: false,
          RequireUppercase: false,
        },
      },
      PoolName: "UserPool-3Fx2HozhHSsp",
      UsernameAttributes: ["email"],
    }),
  },
  {
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
    properties: ({}) => ({
      AllowedOAuthFlows: ["code"],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthScopes: ["email", "openid", "profile"],
      CallbackURLs: ["https://myapp.com"],
      ClientName: "UserPoolClient-9x4glkNVEYDn",
      LogoutURLs: ["https://myapp.com"],
      SupportedIdentityProviders: ["COGNITO"],
    }),
    dependencies: ({}) => ({
      userPool: "UserPool-3Fx2HozhHSsp",
    }),
  },
  {
    type: "UserPoolDomain",
    group: "CognitoIdentityServiceProvider",
    properties: ({}) => ({
      Domain: "myauth840541460064",
    }),
    dependencies: ({}) => ({
      userPool: "UserPool-3Fx2HozhHSsp",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({}) => ({
      RoleName: "sam-app-AppFunctionRole-BXPIJ03LGY2Y",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      AttachedPolicies: [
        {
          PolicyArn:
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
          PolicyName: "AWSLambdaBasicExecutionRole",
        },
      ],
    }),
  },
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "sam-app-AppFunction-gKUxwsmxX2fK",
        Handler: "app.handler",
        Runtime: "nodejs14.x",
      },
    }),
    dependencies: ({}) => ({
      role: "sam-app-AppFunctionRole-BXPIJ03LGY2Y",
    }),
  },
  {
    type: "Permission",
    group: "Lambda",
    properties: ({ getId }) => ({
      Permissions: [
        {
          Action: "lambda:InvokeFunction",
          FunctionName: "sam-app-AppFunction-gKUxwsmxX2fK",
          Principal: "apigateway.amazonaws.com",
          SourceArn: `${getId({
            type: "Api",
            group: "ApiGatewayV2",
            name: "sam-app",
            path: "live.ArnV2",
          })}/*/*/sam-app-AppFunction-gKUxwsmxX2fK`,
          StatementId: "4yymkbc",
        },
      ],
    }),
    dependencies: ({}) => ({
      lambdaFunction: "sam-app-AppFunction-gKUxwsmxX2fK",
      apiGatewayV2Apis: ["sam-app"],
    }),
  },
];
