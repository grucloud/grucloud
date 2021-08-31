module.exports = ({ stage }) => ({
  projectName: "lambda-nodejs-helloworld",
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
  Lambda: {
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
      lambdaHelloWorld: {
        name: "lambda-hello-world",
        properties: {
          FunctionName: "lambda-hello-world",
          Handler: "helloworld.handler",
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
