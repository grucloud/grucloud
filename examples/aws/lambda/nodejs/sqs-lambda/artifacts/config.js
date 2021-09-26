module.exports = ({ stage }) => ({
  projectName: "lambda-sqs-nodejs",
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
              {
                Action: ["sqs:*"],
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
  SQS: {
    Queue: {
      myQueueLambda: {
        name: "my-queue-lambda",
        properties: {
          Attributes: {
            VisibilityTimeout: "30",
            MaximumMessageSize: "262144",
            MessageRetentionPeriod: "345600",
            DelaySeconds: "0",
            ReceiveMessageWaitTimeSeconds: "0",
          },
          tags: {
            "my-tag": "my-value",
          },
        },
      },
    },
  },
  Lambda: {
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
    EventSourceMapping: {
      mappingLambdaHelloWorldMyQueueLambda: {
        name: "mapping-lambda-hello-world-my-queue-lambda",
        properties: {
          BatchSize: 10,
          MaximumBatchingWindowInSeconds: 0,
        },
      },
    },
  },
});
