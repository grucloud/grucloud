const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { compare } = require("@grucloud/core/Common");

const { findDependenciesResourceGroup, buildTags } = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { providerName, location } = config;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments
        type: "KubeEnvironment",
        dependsOnList: ["Resources::ResourceGroup"],
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
          workspace: {
            type: "Workspace",
            group: "OperationalInsights",
            createOnly: true,
          },
        },
        propertiesDefault: {
          properties: {
            type: "managed",
            appLogsConfiguration: {
              destination: "log-analytics",
            },
          },
        },
        methods: {
          get: {
            path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/kubeEnvironments/{name}",
          },
          getAll: {
            path: `/subscriptions/{subscriptionId}/providers/Microsoft.Web/kubeEnvironments`,
          },
          delete: {
            path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/kubeEnvironments/{name}",
          },
        },
        pickPropertiesCreate: [
          "properties.arcConfiguration.frontEndServiceConfiguration.kind",
          "properties.appLogsConfiguration.destination",
          "extendedLocation.name",
        ],
        environmentVariables: [],
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
          {
            type: "Workspace",
            group: "OperationalInsights",
            ids: [
              pipe([
                () => live,
                get(
                  "properties.appLogsConfiguration.logAnalyticsConfiguration.customerId"
                ),
                (customerId) =>
                  pipe([
                    tap((params) => {
                      assert(customerId);
                    }),
                    () =>
                      lives.getByType({
                        providerName,
                        type: "Workspace",
                        group: "OperationalInsights",
                      }),
                    find(eq(get("live.properties.customerId"), customerId)),
                    tap((params) => {
                      assert(true);
                    }),
                    get("id"),
                  ])(),
              ])(),
            ],
          },
        ],
        configDefault: ({ properties, dependencies: { workspace } }) =>
          pipe([
            tap(() => {
              assert(workspace);
            }),
            () => properties,
            defaultsDeep({
              location,
              tags: buildTags(config),
              properties: {
                appLogsConfiguration: {
                  logAnalyticsConfiguration: {
                    customerId: getField(workspace, "properties.customerId"),
                    sharedKey: getField(
                      workspace,
                      "sharedKeys.primarySharedKey"
                    ),
                  },
                },
              },
            }),
            tap((params) => {
              assert(true);
            }),
          ])(),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments
        type: "ContainerApp",
        dependsOnList: ["Resources::ResourceGroup"],
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
          kubeEnvironment: {
            type: "KubeEnvironment",
            group: "Web",
          },
        },
        methods: {
          get: {
            path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/containerapps/{name}",
          },
          getAll: {
            path: `/subscriptions/{subscriptionId}/providers/Microsoft.Web/containerapps`,
          },
          delete: {
            path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/containerapps/{name}",
          },
        },
        apiVersion: "2021-03-01",
        compare: compare({
          filterAll: pipe([
            tap((params) => {
              assert(true);
            }),
            pick(["properties", "sku"]),
            omit([
              "properties.provisioningState",
              "properties.latestRevisionName",
              "properties.latestRevisionFqdn",
              "properties.configuration.ingress.fqdn",
            ]),
          ]),
        }),
        propertiesDefault: {
          properties: {
            configuration: {
              activeRevisionsMode: "Multiple",
              ingress: {
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
            },
          },
        },
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
          {
            type: "KubeEnvironment",
            group: "Web",
            ids: [pipe([() => live, get("properties.kubeEnvironmentId")])()],
          },
        ],
        filterLive: () =>
          pipe([
            pick(["name", "tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick(["configuration", "template"]),
                omit(["configuration.ingress.fqdn"]),
              ]),
            }),
          ]),
        configDefault: ({ properties, dependencies: { kubeEnvironment } }) =>
          pipe([
            tap(() => {
              assert(kubeEnvironment);
            }),
            () => properties,
            defaultsDeep({
              location,
              tags: buildTags(config),
              properties: {
                kubeEnvironmentId: getField(kubeEnvironment, "id"),
              },
            }),
          ])(),
      },
    ],
    map(defaultsDeep({ group: "Web" })),
  ])();
};
