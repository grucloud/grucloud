exports.createResources = () => [
  {
    type: "Function",
    group: "Lambda",
    name: "lambda-hello-world",
    properties: ({}) => ({
      Configuration: {
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
