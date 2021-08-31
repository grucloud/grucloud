module.exports = ({ stage }) => ({
  projectName: "api-gateway-lambda",
  IAM: {
    Policy: {
      lambdaPolicy: {
        name: "lambda-policy",
        properties: {
          PolicyName: "lambda-policy",
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
        },
      },
    },
    Role: {
      lambdaRole: {
        name: "lambda-role",
        properties: {
          RoleName: "lambda-role",
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
        },
      },
    },
  },
  ACM: {
    Certificate: {
      grucloudOrg: {
        name: "grucloud.org",
        properties: {
          DomainName: "grucloud.org",
        },
      },
    },
  },
  Route53Domains: {
    Domain: {
      grucloudOrg: {
        name: "grucloud.org",
      },
    },
  },
  Route53: {
    HostedZone: {
      grucloudOrg: {
        name: "grucloud.org.",
      },
    },
    Record: {
      apiGatewayAliasRecord: {
        name: "api-gateway-alias-record",
      },
      certificateValidationGrucloudOrg: {
        name: "certificate-validation-grucloud.org.",
      },
    },
  },
  Lambda: {
    Function: {
      myFunction: {
        name: "my-function",
        properties: {
          FunctionName: "my-function",
          Handler: "my-function.handler",
          PackageType: "Zip",
          Runtime: "nodejs14.x",
          Description: "",
          Timeout: 3,
          MemorySize: 128,
        },
      },
    },
  },
  ApiGatewayV2: {
    Api: {
      myApi: {
        name: "my-api",
        properties: {
          Name: "my-api",
          ProtocolType: "HTTP",
          ApiKeySelectionExpression: "$request.header.x-api-key",
          DisableExecuteApiEndpoint: false,
          RouteSelectionExpression: "$request.method $request.path",
        },
      },
    },
    Integration: {
      integrationLambda: {
        name: "integration-lambda",
        properties: {
          ConnectionType: "INTERNET",
          Description: "",
          IntegrationMethod: "POST",
          IntegrationType: "AWS_PROXY",
          PayloadFormatVersion: "2.0",
        },
      },
    },
    Route: {
      anyMyFunction: {
        name: "ANY /my-function",
        properties: {
          ApiKeyRequired: false,
          AuthorizationType: "NONE",
          RouteKey: "ANY /my-function",
        },
      },
    },
    Stage: {
      myApiStageDev: {
        name: "my-api-stage-dev",
        properties: {
          StageName: "my-api-stage-dev",
          StageVariables: {},
        },
      },
    },
    Deployment: {
      myApiDeployment: {
        name: "my-api-deployment",
        properties: {
          Description: "",
        },
      },
    },
    DomainName: {
      grucloudOrg: {
        name: "grucloud.org",
        properties: {
          DomainName: "grucloud.org",
        },
      },
    },
  },
});
