const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const AzClient = require("../AzClient");
const { findDependenciesResourceGroup, buildTags } = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { location } = config;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/loganalytics/workspaces
        group: "OperationalInsights",
        type: "Workspace",
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
        }),
        propertiesDefault: {
          properties: {
            publicNetworkAccessForIngestion: "Enabled",
            publicNetworkAccessForQuery: "Enabled",
            workspaceCapping: { dailyQuotaGb: -1 },
            features: { enableLogAccessUsingOnlyResourcePermissions: true },
          },
        },
        Client: ({ spec }) =>
          AzClient({
            spec,
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
