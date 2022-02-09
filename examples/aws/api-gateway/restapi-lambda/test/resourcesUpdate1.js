exports.createResources = () => [
  {
    type: "RestApi",
    group: "APIGateway",
    name: "PetStore",
    properties: () => ({
      apiKeySource: "AUTHORIZER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      schemaFile: "PetStore.oas30.json",
    }),
  },
];
