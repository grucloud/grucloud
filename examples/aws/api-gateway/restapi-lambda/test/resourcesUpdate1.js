const createResources = ({ provider }) => {
  provider.APIGateway.makeRestApi({
    name: "PetStore",
    properties: () => ({
      apiKeySource: "AUTHORIZER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      schemaFile: "PetStore.swagger.json",
    }),
  });
};
exports.createResources = createResources;
