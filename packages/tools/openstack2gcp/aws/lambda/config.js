const pkg = require("./package.json");
module.exports = ({ stage }) => ({
  projectName: pkg.name,
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
          Description: "Allow ec2:Describe",
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
    Function: {
      lambdaHelloWorld_1: {
        name: "lambda-hello-world-1",
        properties: {
          FunctionName: "lambda-hello-world-1",
          Handler: "helloworld.handler",
          PackageType: "Zip",
          Runtime: "nodejs14.x",
          Description: "",
        },
      },
    },
  },
});
