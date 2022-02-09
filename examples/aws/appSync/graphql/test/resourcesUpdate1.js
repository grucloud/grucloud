const createResources = () => [
  {
    type: "GraphqlApi",
    group: "AppSync",
    name: "cdk-notes-appsync-api",
    properties: ({}) => ({
      authenticationType: "API_KEY",
      xrayEnabled: true,
      apiKeys: [
        {
          description: "Graphql Api Keys",
        },
      ],
      schemaFile: "test/cdk-notes-appsync-api.update1.graphql",
    }),
  },
];
