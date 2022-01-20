const assert = require("assert");
const { pipe, eq, get, tap, map, or } = require("rubico");
const { defaultsDeep, callProp, last, identity } = require("rubico/x");

const group = "DBforPostgreSQL";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "Configuration",
        ignoreResource: () =>
          pipe([eq(get("live.properties.source"), "system-default")]),
        pickProperties: ["properties.value"],
      },
      {
        type: "Database",
        ignoreResource: () =>
          pipe([
            get("name"),
            callProp("split", "::"),
            last,
            or([callProp("startsWith", "azure_"), eq(identity, "postgres")]),
          ]),
        cannotBeDeleted: pipe([
          tap((params) => {
            assert(true);
          }),
          () => true,
        ]),
      },
      {
        type: "Server",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          subnet: {
            type: "Subnet",
            group: "Network",
            createOnly: true,
          },
          //private dns zone
        },
        propertiesDefault: {
          properties: {
            backup: {
              backupRetentionDays: 7,
            },
            highAvailability: { mode: "Disabled" },
          },
        },
      },
      //{ type: "PrivateEndpointConnection", apiVersion: "2021-06-01" },
      // { type: "VirtualNetworkRule", apiVersion: "2021-06-01" },
      // { type: "ServerSecurityAlertPolicy", apiVersion: "2021-06-01" },
      // { type: "ServerKey", apiVersion: "2020-02-14-preview" },
      // { type: "ServerAdministrator", apiVersion: "2021-06-01" },
    ],
    map(defaultsDeep({ group })),
  ])();
