const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

exports.fnSpecs = ({ config }) =>
  pipe([
    () => [
      {
        type: "WebAppHostNameBinding",
        ignoreResource: () => () => true,
        cannotBeDeleted: () => true,
      },
      {
        type: "AppServicePlan",
        omitPropertiesDiff: ["properties.reserved"],
        filterLive: ({ pickPropertiesCreate }) =>
          pipe([
            assign({
              //reserved is not returned correctly so set it manually for linux.
              properties: pipe([
                get("properties"),
                when(
                  eq(get("kind"), "linux"),
                  assign({ reserved: () => true })
                ),
              ]),
            }),
            pick(["name", ...pickPropertiesCreate]),
          ]),
      },
    ],
    map(defaultsDeep({ group: "Web" })),
  ])();
