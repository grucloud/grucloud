const createResources = ({ provider }) => {
  provider.APIGateway.makeRestApi({
    name: "PetStore",
    properties: () => ({
      apiKeySource: "AUTHORIZER",
      endpointConfiguration: {
        types: ["REGIONAL"],
      },
      schemaFile: "PetStore.oas30.json",
    }),
  });
};
exports.createResources = createResources;
