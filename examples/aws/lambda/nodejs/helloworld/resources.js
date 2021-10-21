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

  provider.Lambda.makeLayer({
    name: "lambda-layer",
    properties: () => ({
      LayerName: "lambda-layer",
      Description: "My Layer",
      CompatibleRuntimes: ["nodejs"],
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
      layers: [resources.Lambda.Layer.lambdaLayer],
      role: resources.IAM.Role.lambdaRole,
    }),
  });
};

exports.createResources = createResources;
