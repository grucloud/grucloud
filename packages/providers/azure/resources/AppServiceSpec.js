const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { compare } = require("@grucloud/core/Common");

const AzClient = require("../AzClient");
const { findDependenciesResourceGroup, buildTags } = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { providerName, location } = config;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments
        type: "KubeEnvironment",
        dependsOn: ["Resources::ResourceGroup", "LogAnalytics::Workspace"],
        dependsOnList: ["Resources::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
          workspace: {
            type: "Workspace",
            group: "LogAnalytics",
          },
        }),
        propertiesDefault: {
          properties: {
            type: "managed",
            appLogsConfiguration: {
              destination: "log-analytics",
            },
          },
        },
        Client: ({ spec }) =>
          AzClient({
            spec,
            methods: {
              get: {
                path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/kubeEnvironments/{name}",
              },
              getAll: {
                path: `/subscriptions/{subscriptionId}/providers/Microsoft.Web/kubeEnvironments`,
              },
            },
            apiVersion: "2021-02-01",
            config,
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
              {
                type: "Workspace",
                group: "LogAnalytics",
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
                            group: "LogAnalytics",
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
                        customerId: getField(
                          workspace,
                          "properties.customerId"
                        ),
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
          }),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/appservice/kube-environments
        type: "ContainerApp",
        dependsOn: ["Resources::ResourceGroup", "Web::KubeEnvironment"],
        dependsOnList: ["Resources::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
          kubeEnvironment: {
            type: "KubeEnvironment",
            group: "Web",
          },
        }),
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
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick(["configuration", "template"]),
                omit(["configuration.ingress.fqdn"]),
              ]),
            }),
          ]),
        Client: ({ spec }) =>
          AzClient({
            spec,
            methods: {
              get: {
                path: "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Web/containerapps/{name}",
              },
              getAll: {
                path: `/subscriptions/{subscriptionId}/providers/Microsoft.Web/containerapps`,
              },
            },
            verbUpdate: "PUT",
            apiVersion: "2021-03-01",
            config,
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
              {
                type: "KubeEnvironment",
                group: "Web",
                ids: [
                  pipe([() => live, get("properties.kubeEnvironmentId")])(),
                ],
              },
            ],
            configDefault: ({
              properties,
              dependencies: { kubeEnvironment },
            }) =>
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
          }),
      },
    ],
    map(defaultsDeep({ group: "Web" })),
  ])();
};
