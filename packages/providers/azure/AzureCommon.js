const assert = require("assert");
const { pipe, tap, get, or, eq } = require("rubico");
const { callProp } = require("rubico/x");

exports.AZURE_MANAGEMENT_BASE_URL = "https://management.azure.com";

exports.buildTags = ({ managedByKey, managedByValue, stageTagKey, stage }) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});

exports.findDependenciesResourceGroup = ({ live, lives, config }) => ({
  type: "ResourceGroup",
  group: "Resources",
  ids: [
    pipe([
      () => live,
      get("id"),
      callProp("split", "/"),
      callProp("slice", 0, 5),
      callProp("join", "/"),
      callProp("replace", "resourcegroups", "resourceGroups"),
      tap((params) => {
        assert(true);
      }),
    ])(),
  ],
});

const isInstanceUp = or([
  eq(get("properties.provisioningState"), "Succeeded"),
  eq(get("properties.state"), "Ready"), // for DBforPostgreSQL::Server
]);

exports.isInstanceUp = isInstanceUp;
