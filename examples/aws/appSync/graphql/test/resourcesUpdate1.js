const createResources = ({ provider }) => {
  provider.AppSync.makeGraphqlApi({
    name: "cdk-notes-appsync-api",
    properties: ({ config }) => ({
      authenticationType: "API_KEY",
      xrayEnabled: true,
      schemaFile: "test/cdk-notes-appsync-api.update1.graphql",
      apiKeys: [{ description: "Graphql Api Keys" }],
    }),
  });
};

exports.createResources = createResources;
