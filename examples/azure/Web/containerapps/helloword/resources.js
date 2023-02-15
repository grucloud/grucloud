// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "ContainerApp",
    group: "App",
    properties: ({ config }) => ({
      name: "helloworld",
      location: config.location,
      identity: {
        type: "None",
      },
      properties: {
        configuration: {
          activeRevisionsMode: "Single",
          ingress: {
            external: true,
            targetPort: 80,
            transport: "Auto",
            traffic: [
              {
                weight: 100,
                latestRevision: true,
              },
            ],
            allowInsecure: false,
          },
        },
        template: {
          revisionSuffix: "",
          containers: [
            {
              image:
                "mcr.microsoft.com/azuredocs/containerapps-helloworld:latest",
              name: "helloworld",
              resources: {
                cpu: 0.5,
                memory: "1Gi",
              },
            },
          ],
          scale: {
            maxReplicas: 10,
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-app-container",
      managedEnvironment: "rg-app-container::managedEnvironment-rgappcontainer",
    }),
  },
  {
    type: "ManagedEnvironment",
    group: "App",
    properties: ({ config }) => ({
      name: "managedEnvironment-rgappcontainer",
      location: config.location,
      properties: {
        appLogsConfiguration: {
          destination: "log-analytics",
          logAnalyticsConfiguration: {
            sharedKey:
              process.env
                .RG_APP_CONTAINER_MANAGED_ENVIRONMENT_RGAPPCONTAINER_SHARED_KEY,
          },
        },
        zoneRedundant: false,
        daprAIInstrumentationKey:
          process.env
            .RG_APP_CONTAINER_MANAGED_ENVIRONMENT_RGAPPCONTAINER_DAPR_AI_INSTRUMENTATION_KEY,
        daprAIConnectionString:
          process.env
            .RG_APP_CONTAINER_MANAGED_ENVIRONMENT_RGAPPCONTAINER_DAPR_AI_CONNECTION_STRING,
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-app-container",
      workspace: "rg-app-container::workspace-rgappcontainerzqXk",
    }),
  },
  {
    type: "Workspace",
    group: "OperationalInsights",
    properties: ({ config }) => ({
      name: "workspace-rgappcontainerzqXk",
      location: config.location,
      properties: {
        sku: {
          name: "pergb2018",
        },
        retentionInDays: 30,
        features: {
          legacy: 0,
          searchVersion: 1,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "rg-app-container",
    }),
  },
  {
    type: "ResourceGroup",
    group: "Resources",
    properties: ({}) => ({
      name: "rg-app-container",
    }),
  },
];