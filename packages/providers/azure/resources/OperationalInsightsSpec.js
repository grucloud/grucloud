const assert = require("assert");
const { pipe, get, tap, assign } = require("rubico");
const { callProp } = require("rubico/x");

const isDefaultSavedSearch = () =>
  pipe([
    tap((params) => {
      assert(params.name);
    }),
    get("name"),
    callProp("startsWith", "LogManagement("),
  ]);

exports.fnSpecs = ({ config }) => {
  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/loganalytics/workspaces
        group: "OperationalInsights",
        type: "SavedSearch",
        ignoreResource: () => () => true,
        managedByOther: isDefaultSavedSearch,
        cannotBeDeleted: isDefaultSavedSearch,
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
        //TODO the generated environmentVariables should be empty
        environmentVariables: [],
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
      },
    ],
  ])();
};
