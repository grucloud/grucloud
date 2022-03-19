exports.createResources = () => [
  // {
  //   type: "RestApi",
  //   group: "APIGateway",
  //   name: "PetStore",
  //   properties: () => ({
  //     apiKeySource: "AUTHORIZER",
  //     endpointConfiguration: {
  //       types: ["REGIONAL"],
  //     },
  //     schemaFile: "PetStore.oas30.json",
  //     tags: { mykeynew: "myvalue" },
  //   }),
  // },
  {
    type: "Stage",
    group: "APIGateway",
    name: "dev",
    properties: ({}) => ({
      description: "dev",
      methodSettings: {
        "*/*": {
          metricsEnabled: false,
          dataTraceEnabled: false,
          throttlingBurstLimit: 5000,
          throttlingRateLimit: 10000,
          cachingEnabled: false,
          cacheTtlInSeconds: 300,
          cacheDataEncrypted: false,
          requireAuthorizationForCacheControl: true,
          unauthorizedCacheControlHeaderStrategy:
            "SUCCEED_WITH_RESPONSE_HEADER",
        },
      },
      cacheClusterEnabled: false,
      cacheClusterSize: "0.5",
      tracingEnabled: false,
      tags: { mykeynew: "myvalue" },
    }),
    dependencies: () => ({
      restApi: "PetStore",
    }),
  },
];
