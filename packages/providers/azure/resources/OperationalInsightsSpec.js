const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");

const AzClient = require("../AzClient");

exports.fnSpecs = ({ config }) => {
  const { location } = config;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/loganalytics/workspaces
        group: "OperationalInsights",
        type: "Workspace",
        //TODO starts with LogManagement(logs)_
        cannotBeDeleted: () => true,
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/loganalytics/workspaces
        group: "OperationalInsights",
        type: "Workspace",
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
          }),
      },
    ],
  ])();
};
