exports.createResources = () => [
  {
    type: "Function",
    group: "Lambda",
    properties: ({}) => ({
      Configuration: {
        FunctionName: "lambda-hello-world",
        Handler: "helloworld.handler",
        Runtime: "nodejs14.x",
      },
      Tags: { mykey1: "value" },
    }),
    dependencies: () => ({
      layers: ["lambda-layer"],
      role: "lambda-role",
    }),
  },
];
