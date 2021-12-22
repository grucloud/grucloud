const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const AzClient = require("../AzClient");
const {
  isInstanceUp,
  findDependenciesResourceGroup,
  buildTags,
} = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { location } = config;
  const subscriptionId = process.env.SUBSCRIPTION_ID;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/loganalytics/workspaces
        group: "LogAnalytics",
        type: "Workspace",
        dependsOn: ["resourceManagement::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "resourceManagement",
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
            pathBase: `/subscriptions/${subscriptionId}`,
            pathSuffix: ({ dependencies: { resourceGroup } }) => {
              assert(resourceGroup, "missing resourceGroup dependency");
              return `/resourcegroups/${resourceGroup.name}/providers/Microsoft.OperationalInsights/workspaces`;
            },
            pathSuffixList: () =>
              `/providers/Microsoft.OperationalInsights/workspaces`,
            queryParameters: () => "?api-version=2021-06-01",
            isInstanceUp,
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
