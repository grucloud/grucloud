const createResources = () => [
  {
    type: "GraphqlApi",
    group: "AppSync",
    properties: ({}) => ({
      name: "cdk-notes-appsync-api",
      authenticationType: "API_KEY",
      xrayEnabled: true,
      apiKeys: [
        {
          description: "Graphql Api Keys",
        },
      ],
      schemaFile: "test/cdk-notes-appsync-api.update1.graphql",
      tags: { mykey1: "myvalue" },
    }),
  },
];
