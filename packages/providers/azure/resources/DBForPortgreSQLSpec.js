const assert = require("assert");
const { pipe, eq, get, tap, map } = require("rubico");
const { defaultsDeep, callProp } = require("rubico/x");

const group = "DBforPostgreSQL";

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "Configuration",
        ignoreResource: (param) =>
          pipe([eq(get("live.properties.source"), "system-default")]),
      },
      {
        type: "Database",
        ignoreResource: (param) =>
          pipe([get("name"), callProp("startsWith", "azure_")]),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
