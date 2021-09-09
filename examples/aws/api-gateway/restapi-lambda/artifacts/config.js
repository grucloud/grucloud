module.exports = ({ stage }) => ({
  projectName: "api-gateway-restapi-lambda",
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
        properties: {
          Name: "grucloud.org.",
          Type: "A",
          AliasTarget: {
            HostedZoneId: "ZJ5UAJN8Y3Z2Q",
            DNSName: "d-i7sg9jrcwi.execute-api.eu-west-2.amazonaws.com.",
            EvaluateTargetHealth: false,
          },
        },
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
});
