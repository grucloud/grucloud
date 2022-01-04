const assert = require("assert");
const { pipe, tap, get, map, eq, switchCase, reduce } = require("rubico");
const {
  callProp,
  keys,
  unless,
  isEmpty,
  defaultsDeep,
  when,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");

exports.AZURE_MANAGEMENT_BASE_URL = "https://management.azure.com";

exports.isSubstituable = callProp("startsWith", "{");

const buildTags = ({ managedByKey, managedByValue, stageTagKey, stage }) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});
exports.buildTags = buildTags;

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

exports.findDependenciesUserAssignedIdentity = ({ live, lives, config }) =>
  pipe([
    () => live,
    get("identity.userAssignedIdentities", []),
    keys,
    switchCase([
      isEmpty,
      () => undefined,
      pipe([
        (ids) => ({
          type: "UserAssignedIdentity",
          group: "ManagedIdentity",
          ids,
        }),
      ]),
    ]),
  ])();

const isInstanceUp = switchCase([
  get("properties.provisioningState"),
  eq(get("properties.provisioningState"), "Succeeded"),
  get("properties.state"),
  eq(get("properties.state"), "Ready"), // for DBforPostgreSQL::Server
  get("id"), // Last resort
]);

exports.isInstanceUp = isInstanceUp;

const configDefaultGeneric = ({ properties, dependencies, config }) =>
  pipe([
    tap(() => {
      assert(config.location);
    }),
    () => properties,
    defaultsDeep({
      location: config.location,
      tags: buildTags(config),
    }),
    when(
      () => dependencies.managedIdentities,
      defaultsDeep({
        identity: {
          //TODO could be 'SystemAssigned, UserAssigned',
          type: "UserAssigned",
          userAssignedIdentities: pipe([
            () => dependencies.managedIdentities,
            tap((params) => {
              assert(true);
            }),
            map((managedIdentity) => getField(managedIdentity, "id")),
            tap((params) => {
              assert(true);
            }),
            unless(
              isEmpty,
              reduce((acc, id) => ({ ...acc, [id]: {} }), {})
            ),
            tap((params) => {
              assert(true);
            }),
          ])(),
        },
      })
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.configDefaultGeneric = configDefaultGeneric;
