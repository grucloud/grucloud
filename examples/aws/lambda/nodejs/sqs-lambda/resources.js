const createResources = ({ provider }) => {
  provider.IAM.makePolicy({
    name: "lambda-policy",
    properties: () => ({
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
    }),
  });

  provider.IAM.makeRole({
    name: "lambda-role",
    properties: () => ({
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
    }),
    dependencies: ({ resources }) => ({
      policies: [resources.IAM.Policy.lambdaPolicy],
    }),
  });

  provider.SQS.makeQueue({
    name: "my-queue-lambda",
    properties: () => ({
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
    }),
  });

  provider.Lambda.makeFunction({
    name: "lambda-hello-world",
    properties: () => ({
      FunctionName: "lambda-hello-world",
      Handler: "helloworld.handler",
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

  provider.Lambda.makeEventSourceMapping({
    name: "mapping-lambda-hello-world-my-queue-lambda",
    properties: () => ({
      BatchSize: 10,
      MaximumBatchingWindowInSeconds: 0,
    }),
    dependencies: ({ resources }) => ({
      lambdaFunction: resources.Lambda.Function.lambdaHelloWorld,
      sqsQueue: resources.SQS.Queue.myQueueLambda,
    }),
  });
};

exports.createResources = createResources;
