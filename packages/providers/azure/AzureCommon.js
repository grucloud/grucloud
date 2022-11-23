const assert = require("assert");
const {
  pipe,
  tap,
  get,
  map,
  eq,
  switchCase,
  reduce,
  filter,
  set,
  assign,
  and,
  not,
  flatMap,
  or,
} = require("rubico");
const {
  isFunction,
  find,
  callProp,
  keys,
  unless,
  isEmpty,
  defaultsDeep,
  when,
  last,
  values,
  includes,
  identity,
} = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildGetId } = require("@grucloud/core/Common");

const AxiosMaker = require("@grucloud/core/AxiosMaker");

exports.AZURE_MANAGEMENT_BASE_URL = "https://management.azure.com";
exports.AZURE_GRAPH_BASE_URL = "https://graph.microsoft.com";

exports.AZURE_KEYVAULT_AUDIENCE = "https://vault.azure.net";
exports.AZURE_STORAGE_AUDIENCE = "https://storage.azure.com/";

exports.createAxiosAzure = ({ baseURL, bearerToken }) =>
  pipe([
    tap(() => {
      assert(baseURL);
      assert(isFunction(bearerToken));
    }),
    () =>
      AxiosMaker({
        baseURL,
        onHeaders: () => ({
          Authorization: `Bearer ${bearerToken()}`,
        }),
      }),
  ])();

exports.shortName = pipe([
  callProp("split", "::"),
  last,
  //TODO
  //callProp("toLowerCase"),
]);

exports.isSubstituable = callProp("startsWith", "{");

exports.replaceSubscription = ({ providerConfig }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    callProp("split", "/"),
    (items) => {
      items[2] = "${config.subscriptionId}";
      return items;
    },
    callProp("join", "/"),
    tap((params) => {
      assert(true);
    }),
    (resource) => () => "`" + resource + "`",
  ]);

const findResourceById =
  ({ groupType, lives, withSuffix }) =>
  (idToMatch) =>
    pipe([
      tap(() => {
        assert(lives);
        assert(groupType);
        assert(idToMatch);
      }),
      () => lives,
      find(
        and([
          eq(get("groupType"), groupType),
          pipe([
            get("id"),
            callProp("toUpperCase"),
            (id) =>
              pipe([
                () => idToMatch,
                callProp("toUpperCase"),
                switchCase([
                  () => withSuffix,
                  callProp("startsWith", id),
                  eq(identity, id),
                ]),
              ])(),
          ]),
        ])
      ),
    ])();

exports.assignDependenciesId = ({
  group,
  type,
  lives,
  propertyName = "id",
  providerConfig,
  withSuffix = false,
}) =>
  pipe([
    tap((params) => {
      assert(group);
      assert(type);
      assert(lives);
      assert(providerConfig);
    }),
    assign({
      [propertyName]: pipe([
        get(propertyName),
        tap((id) => {
          if (!id) {
            assert(id, `no id for ${type}, propertyName: ${propertyName}`);
          }
        }),
        (id) =>
          pipe([
            () => id,
            findResourceById({
              groupType: `${group}::${type}`,
              lives,
              withSuffix,
            }),
            tap((resource) => {
              if (!resource) {
                assert(
                  resource,
                  `no resource id '${id}, type: ${group}::${type}'`
                );
              }
            }),
            buildGetId({ id, providerConfig }),
            (result) => () => result,
          ])(),
      ]),
    }),
  ]);

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
  // for DBforPostgreSQL::Server,
  get("properties.state"),
  pipe([
    get("properties.state"),
    (state) => pipe([() => ["Ready", "Running"], includes(state)])(),
  ]),
  // Network::VirtualNetworkGatewayConnectionSharedKey
  not(isEmpty), // Last resort
]);

exports.isInstanceUp = isInstanceUp;

const isInstanceDown = or([
  isEmpty,
  eq(get("properties.provisioningState"), "ScheduledForDelete"),
]);

exports.isInstanceDown = isInstanceDown;

const configDefaultDependenciesId = ({ dependencies, spec }) =>
  pipe([
    tap(() => {
      assert(spec);
      assert(dependencies);
    }),
    () => spec,
    get("dependencies"),
    filter(get("pathId")),
    map.entries(([varName, { list, pathId }]) => [
      varName,
      pipe([
        tap((params) => {
          assert(pathId);
        }),
        () => ({}),
        when(
          () => dependencies[varName],
          pipe([
            tap((params) => {
              assert(true);
            }),
            switchCase([
              () => list,
              pipe([
                tap((params) => {
                  assert(true);
                }),
              ]),
              pipe([set(pathId, getField(dependencies[varName], "id"))]),
            ]),
          ])
        ),
      ])(),
    ]),
    values,
    reduce((acc, value) => pipe([() => acc, defaultsDeep(value)])(), {}),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.configDefaultDependenciesId = configDefaultDependenciesId;

const configDefaultGeneric = ({ properties, dependencies, config, spec }) =>
  pipe([
    tap(() => {
      assert(config.location);
      assert(spec);
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
    defaultsDeep(
      configDefaultDependenciesId({
        dependencies,
        spec,
      })
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.configDefaultGeneric = configDefaultGeneric;
