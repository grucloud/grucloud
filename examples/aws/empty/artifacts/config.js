module.exports = ({ stage }) => ({
  projectName: "example-grucloud-infra-aws",
  iam: {
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
  ecr: {
    Registry: {
      default: {
        name: "default",
        properties: {
          policyText: {
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "stis-2",
                Effect: "Allow",
                Principal: {
                  AWS: "arn:aws:iam::840541460064:root",
                },
                Action: ["ecr:CreateRepository", "ecr:ReplicateImage"],
                Resource: "arn:aws:ecr:eu-west-2:840541460064:repository/*",
              },
            ],
          },
          replicationConfiguration: {
            rules: [
              {
                destinations: [
                  {
                    region: "us-east-2",
                    registryId: "840541460064",
                  },
                ],
              },
            ],
          },
        },
      },
    },
  },
  lambda: {
    Layer: {
      lambdaLayer: {
        name: "lambda-layer",
        properties: {
          LayerName: "lambda-layer",
          Description: "My Layer",
          CompatibleRuntimes: ["nodejs"],
        },
      },
    },
  },
});
