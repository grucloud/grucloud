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
  reduce,
  fork,
  switchCase,
  any,
} = require("rubico");

const {
  includes,
  unless,
  when,
  defaultsDeep,
  callProp,
  find,
  values,
  size,
  last,
  append,
  isEmpty,
} = require("rubico/x");

const { compare, deepPick } = require("@grucloud/core/Common");

const AuthorizationSpec = require("./resources/AuthorizationSpec");
const ContainerServiceSpec = require("./resources/ContainerServiceSpec");
const ComputeSpec = require("./resources/ComputeSpec");

const DBForPortgreSQLSpec = require("./resources/DBForPostgreSQLSpec");
const DocumentDBSpec = require("./resources/DocumentDBSpec");
const KeyVaultSpec = require("./resources/KeyVaultSpec");
const NetworkSpec = require("./resources/NetworkSpec");
const OperationalInsightsSpec = require("./resources/OperationalInsightsSpec");
const ResourceManagementSpec = require("./resources/ResourcesSpec");

const StorageSpec = require("./resources/StorageSpec");
const WebSpec = require("./resources/WebSpec");

const AzTag = require("./AzTag");

const Schema = require("./schema/AzureSchema.json");

const AzClient = require("./AzClient");
const { isSubstituable } = require("./AzureCommon");

const createSpecsOveride = (config) =>
  pipe([
    () => [
      AuthorizationSpec,
      ComputeSpec,
      ContainerServiceSpec,
      DBForPortgreSQLSpec,
      DocumentDBSpec,
      KeyVaultSpec,
      NetworkSpec,
      OperationalInsightsSpec,
      ResourceManagementSpec,
      StorageSpec,
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
  findName: ({ methods, dependencies }) =>
    pipe([
      tap((params) => {
        assert(methods);
        assert(dependencies);
      }),
      fork({
        path: pipe([() => methods, get("get.path"), callProp("split", "/")]),
        id: pipe([get("live.id"), callProp("split", "/")]),
        lives: get("lives"),
      }),
      ({ path, id }) =>
        pipe([
          () => path,
          reduce(
            (acc, value, index) =>
              pipe([
                () => acc,
                when(
                  and([
                    () => isSubstituable(value),
                    not(eq(value, "{subscriptionId}")),
                    not(eq(value, "{scope}")),
                  ]),
                  pipe([
                    () => id[index + size(id) - size(path)],
                    tap((depName) => {
                      assert(depName);
                    }),
                    when(
                      pipe([
                        () => ["resourceGroup", "networkSecurityGroup"],
                        any((type) => pipe([() => value, includes(type)])()),
                      ]),
                      callProp("toLowerCase")
                    ),
                    (depName) => [...acc, depName],
                  ])
                ),
              ])(),
            []
          ),
        ])(),
      callProp("join", "::"),
      tap((name) => {
        assert(name, "missing name");
      }),
    ]),
  inferName:
    ({ dependencies }) =>
    (resource) =>
      pipe([
        tap(() => {
          assert(dependencies);
          assert(resource);
          assert(resource.dependenciesSpec);
        }),
        () => dependencies,
        map.entries(([key, dep]) => [key, { varName: key, ...dep }]),
        filter(get("parent")),
        values,
        last,
        switchCase([
          isEmpty,
          () => "",
          ({ varName }) =>
            pipe([
              () => resource.dependenciesSpec,
              get(varName),
              tap((name) => {
                assert(name);
              }),
            ])(),
        ]),
        unless(
          () => isEmpty(resource.properties.name),
          pipe([
            unless(isEmpty, append("::")),
            append(resource.properties.name),
          ])
        ),
        tap((params) => {
          assert(true);
        }),
      ])(),
  Client:
    ({ dependencies }) =>
    ({ spec, config, lives }) =>
      AzClient({
        spec,
        dependencies,
        config,
        lives,
      }),
  filterLive:
    ({ pickPropertiesCreate = [] }) =>
    () =>
      //TODO
      pipe([
        tap((params) => {
          assert(true);
        }),
        deepPick(["name", "kind", ...pickPropertiesCreate]),
        omit([
          "properties.provisioningState",
          "etag",
          "type",
          "identity.userAssignedIdentities",
        ]),
        tap((params) => {
          assert(true);
        }),
      ]),
  compare: ({
    pickPropertiesCreate = [],
    omitProperties = [],
    propertiesDefault = {},
  }) =>
    compare({
      filterTarget: (input) =>
        pipe([
          tap((params) => {
            assert(input);
          }),
        ]),
      filterAll: () =>
        pipe([
          tap((params) => {
            assert(pickPropertiesCreate);
            assert(propertiesDefault);
          }),
          pick(pickPropertiesCreate),
          defaultsDeep(propertiesDefault),
          omit(omitProperties),
          omit([
            "type",
            //TODO keep the name and add inferName
            "name",
            "properties.provisioningState",
            "etag",
            "identity", //TODO
          ]),
          tap((params) => {
            assert(true);
          }),
        ]),
    }),
  isOurMinion: () => AzTag.isOurMinion,
});

const addDefaultSpecs = pipe([
  tap((params) => {
    assert(true);
  }),
  map((spec) => ({ ...buildDefaultSpec(spec), ...spec })),
  tap((params) => {
    assert(true);
  }),
]);

// const addUsedBy = (specs) =>
//   pipe([
//     tap((params) => {
//       assert(true);
//     }),
//     () => specs,
//     map(
//       assign({
//         usedBy: (spec) =>
//           pipe([
//             tap((params) => {
//               assert(spec);
//             }),
//             () => specs,
//             filter(
//               pipe([
//                 get("dependencies"),
//                 filter(get("parent")),
//                 tap((params) => {
//                   assert(true);
//                 }),
//                 any(
//                   and([
//                     eq(get("group"), spec.group),
//                     eq(get("type"), spec.type),
//                   ])
//                 ),
//               ])
//             ),
//             tap((params) => {
//               assert(true);
//             }),
//           ])(),
//       })
//     ),
//     tap((params) => {
//       assert(true);
//     }),
//   ])();

const findByGroupAndType = ({ group, type }) =>
  pipe([
    tap((params) => {
      assert(type);
      assert(group);
    }),
    find(and([eq(get("group"), group), eq(get("type"), type)])),
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
    addDefaultSpecs,
    tap((params) => {
      assert(true);
    }),
  ])();
