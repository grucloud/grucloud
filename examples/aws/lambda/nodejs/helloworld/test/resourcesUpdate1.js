exports.createResources = () => [
  {
    type: "Function",
    group: "Lambda",
    name: "lambda-hello-world",
    properties: ({}) => ({
      Handler: "helloworld.handler",
      PackageType: "Zip",
      Runtime: "nodejs14.x",
      Description: "",
      Timeout: 3,
      MemorySize: 128,
      Tags: { mykey1: "value" },
    }),
    dependencies: () => ({
      layers: ["lambda-layer"],
      role: "lambda-role",
    }),
  },
];
