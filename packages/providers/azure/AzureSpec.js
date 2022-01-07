const assert = require("assert");
const {
  pipe,
  map,
  tap,
  flatMap,
  filter,
  not,
  eq,
  get,
  and,
  assign,
  omit,
  pick,
  fork,
} = require("rubico");

const { defaultsDeep, callProp, find, values } = require("rubico/x");

const { compare } = require("@grucloud/core/Common");

const ComputeSpec = require("./resources/ComputeSpec");
const DBForPortgreSQLSpec = require("./resources/DBForPostgreSQLSpec");
const KeyVault = require("./resources/KeyVault");

const NetworkSpec = require("./resources/NetworkSpec");
const OperationalInsightsSpec = require("./resources/OperationalInsightsSpec");
const ResourceManagementSpec = require("./resources/ResourcesSpec");
const WebSpec = require("./resources/WebSpec");

const AzTag = require("./AzTag");

const Schema = require("./AzureSchema.json");
const AzClient = require("./AzClient");

const createSpecsOveride = (config) =>
  pipe([
    () => [
      ComputeSpec,
      DBForPortgreSQLSpec,
      KeyVault,
      NetworkSpec,
      OperationalInsightsSpec,
      ResourceManagementSpec,
      WebSpec,
    ],
    flatMap(callProp("fnSpecs", { config })),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.createSpecsOveride = createSpecsOveride;

const buildDefaultSpec = fork({
  isDefault: () => eq(get("live.name"), "default"),
  managedByOther: () => eq(get("live.name"), "default"),
  ignoreResource: () => () => pipe([get("isDefault")]),
  dependsOn: ({ dependencies, type }) =>
    pipe([
      tap((params) => {
        assert(type);
        if (!dependencies) {
          assert(dependencies);
        }
      }),
      () => dependencies,
      values,
      map(({ group, type }) => `${group}::${type}`),
    ])(),
  dependsOnList: ({ dependencies }) =>
    pipe([
      tap(() => {
        assert(dependencies);
      }),
      () => dependencies,
      values,
      tap((params) => {
        assert(true);
      }),
      filter(not(get("createOnly"))),
      map(({ group, type }) => `${group}::${type}`),
    ])(),
  Client:
    ({ dependencies }) =>
    ({ spec, config }) =>
      AzClient({
        spec,
        dependencies,
        config,
      }),
  filterLive:
    ({ pickPropertiesCreate = [] }) =>
    () =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        pick(pickPropertiesCreate),
        omit([
          "properties.provisioningState",
          "etag",
          "name",
          "type",
          "identity",
        ]),
      ]),
  compare: ({
    pickProperties = [],
    omitProperties = [],
    propertiesDefault = {},
  }) =>
    compare({
      filterAll: pipe([
        pick(pickProperties),
        defaultsDeep(propertiesDefault),
        omit(omitProperties),
        omit([
          "type",
          "name",
          "properties.provisioningState",
          "etag",
          "identity", //TODO
        ]),
      ]),
    }),
  isOurMinion: () => AzTag.isOurMinion,
});

const addDefaultSpecs = ({}) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    map((spec) => ({ ...buildDefaultSpec(spec), ...spec })),
    tap((params) => {
      assert(true);
    }),
  ]);

const findByGroupAndType = ({ group, type }) =>
  pipe([
    tap((params) => {
      assert(type);
      assert(group);
    }),
    find(and([eq(get("group"), group), eq(get("type"), type)])),
    tap((params) => {
      assert(true);
    }),
  ]);
exports.findByGroupAndType = findByGroupAndType;

const mergeSpec = ({ specsGen, specsOveride }) =>
  pipe([
    tap((params) => {
      assert(Array.isArray(specsGen));
      assert(Array.isArray(specsOveride));
    }),
    () => specsOveride,
    map((overideSpec) =>
      pipe([
        () => specsGen,
        findByGroupAndType(overideSpec),
        (found) => ({ ...found, ...overideSpec }),
        tap((params) => {
          assert(true);
        }),
      ])()
    ),
    tap((params) => {
      assert(true);
    }),
  ])();

exports.mergeSpec = mergeSpec;

exports.fnSpecs = (config) =>
  pipe([
    assign({
      specsOveride: () => createSpecsOveride(config),
      specsGen: pipe([() => Schema]),
    }),
    assign({
      specsOveride: mergeSpec,
    }),
    assign({
      specsGen: ({ specsGen, specsOveride }) =>
        pipe([
          () => specsGen,
          filter(
            not((spec) =>
              pipe([() => specsOveride, findByGroupAndType(spec)])()
            )
          ),
        ])(),
    }),
    ({ specsGen, specsOveride }) => [...specsGen, ...specsOveride],
    map(
      assign({ groupType: pipe([({ group, type }) => `${group}::${type}`]) })
    ),
    callProp("sort", (a, b) => a.groupType.localeCompare(b.groupType)),
    addDefaultSpecs({}),
  ])();
