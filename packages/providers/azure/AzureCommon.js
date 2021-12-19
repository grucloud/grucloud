const assert = require("assert");
const { pipe, tap, get, or, eq, switchCase } = require("rubico");
const { callProp, identity } = require("rubico/x");

exports.AZURE_MANAGEMENT_BASE_URL = "https://management.azure.com";

exports.buildTags = ({ managedByKey, managedByValue, stageTagKey, stage }) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});

exports.isSubstituable = callProp("startsWith", "{");

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

const isInstanceUp = switchCase([
  get("properties.provisioningState"),
  eq(get("properties.provisioningState"), "Succeeded"),
  get("properties.state"),
  eq(get("properties.state"), "Ready"), // for DBforPostgreSQL::Server
  get("id"), // Last resort
]);

exports.isInstanceUp = isInstanceUp;
