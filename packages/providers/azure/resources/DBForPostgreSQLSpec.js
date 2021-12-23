const assert = require("assert");
const { pipe, eq, get, tap, map } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

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
          pipe([get("name"), callProp("startsWith", "azure_")]),
        cannotBeDeleted: pipe([
          tap((params) => {
            assert(true);
          }),
          () => true,
        ]),
      },
      {
        type: "Server",
        propertiesDefault: {
          properties: {
            backup: {
              backupRetentionDays: 7,
            },
            highAvailability: { mode: "Disabled" },
          },
        },
      },
    ],
    map(defaultsDeep({ group })),
  ])();
