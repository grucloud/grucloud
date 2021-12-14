const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const AzClient = require("../AzClient");
const { findDependenciesResourceGroup, buildTags } = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { location } = config;
  const subscriptionId = process.env.SUBSCRIPTION_ID;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/loganalytics/workspaces
        group: "LogAnalytics",
        type: "Workspace",
        dependsOn: ["Resources::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
        }),
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick(["sku.name", "retentionInDays"]),
              ]),
            }),
          ]),
        Client: ({ spec }) =>
          AzClient({
            spec,
            methods: {
              get: {
                path: "/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{workspaceName}",
              },
            },
            pathSuffixList: () =>
              `/providers/Microsoft.OperationalInsights/workspaces`,
            apiVersion: "2021-06-01",
            config,
            decorate: ({ axios }) =>
              pipe([
                assign({
                  sharedKeys: pipe([
                    get("id"),
                    (id) => `${id}/sharedKeys?api-version=2020-08-01`,
                    axios.post,
                    get("data"),
                  ]),
                }),
              ]),
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
            ],
            configDefault: ({ properties }) =>
              defaultsDeep({
                location,
                tags: buildTags(config),
              })(properties),
          }),
      },
    ],
  ])();
};
