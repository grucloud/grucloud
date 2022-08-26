const assert = require("assert");
const {
  flatMap,
  pipe,
  tap,
  map,
  assign,
  eq,
  get,
  filter,
  and,
  not,
  fork,
} = require("rubico");
const {
  pluck,
  callProp,
  find,
  values,
  isEmpty,
  identity,
} = require("rubico/x");

const {
  compare,
  omitIfEmpty,
  replaceWithName,
} = require("@grucloud/core/Common");

const { deepPick } = require("@grucloud/core/deepPick");
const { deepDefaults } = require("@grucloud/core/deepDefault");

const GoogleClient = require("./GoogleClient");

const GcpCompute = require("./resources/compute");
const GcpIam = require("./resources/iam");
const GcpStorage = require("./resources/storage");
const GcpDns = require("./resources/dns");
const GcpRun = require("./resources/run");

const Schema = require("./schema/GoogleSchema.json");

const createSpecsOveride = (config) =>
  pipe([
    () => [
      //
      GcpStorage,
      GcpIam,
      GcpCompute,
      //GcpDns,
      GcpRun,
    ],
    flatMap((spec) => spec({ config })),
  ])();

const buildDefaultSpec = fork({
  ignoreResource: () => () => pipe([get("isDefault")]),
  pathLiveFromParent:
    () =>
    ({ live, id }) =>
      callProp("replace", new RegExp(`({.*})`), id),

  findName:
    ({ methods, dependencies }) =>
    ({ live }) =>
      pipe([
        tap((params) => {
          assert(live);
          //assert(dependencies);
        }),
        () => live,
        get("name"),
        tap((name) => {
          assert(name, `missing name ${JSON.stringify(live)}`);
        }),
      ])(),
  // inferName:
  //   ({ dependencies }) =>
  //   (resource) =>
  //     pipe([
  //       tap(() => {
  //         assert(dependencies);
  //         assert(resource);
  //         assert(resource.dependenciesSpec);
  //       }),
  //       () => dependencies,
  //       map.entries(([key, dep]) => [key, { varName: key, ...dep }]),
  //       filter(get("parent")),
  //       values,
  //       last,
  //       switchCase([
  //         isEmpty,
  //         () => "",
  //         ({ varName }) =>
  //           pipe([
  //             () => resource.dependenciesSpec,
  //             get(varName),
  //             tap((name) => {
  //               assert(name);
  //             }),
  //           ])(),
  //       ]),
  //       unless(
  //         () => isEmpty(resource.name),
  //         pipe([unless(isEmpty, append("::")), append(resource.name)])
  //       ),
  //       tap((params) => {
  //         assert(true);
  //       }),
  //     ])(),
  Client:
    ({ dependencies }) =>
    ({ spec, config, lives }) =>
      GoogleClient({
        spec,
        dependencies,
        config,
        lives,
      }),
  filterLive:
    ({ pickPropertiesCreate = [], dependencies }) =>
    ({ providerConfig, lives }) =>
      //TODO
      pipe([
        tap((params) => {
          assert(lives);
          assert(pickPropertiesCreate);
          assert(providerConfig);
          assert(dependencies);
        }),
        deepPick([
          "name",
          ...pickPropertiesCreate,
          ...pipe([
            () => dependencies,
            values,
            filter(get("list")),
            pluck("pathId"),
            filter(not(isEmpty)),
          ])(),
        ]),
        //omit([]),
        //filterLiveDependencyArray({ dependencies, providerConfig, lives }),
      ]),
  compare: ({
    pickPropertiesCreate = [],
    omitProperties = [],
    omitPropertiesExtra = [],
    propertiesDefaultArray,
  }) =>
    compare({
      filterTarget: (input) =>
        pipe([
          tap((params) => {
            assert(input);
          }),
        ]),
      filterLive: ({ live, config, filterLiveExtra = () => identity }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
          filterLiveExtra({ live, providerConfig: config }),
          tap((params) => {
            assert(true);
          }),
        ]),
      filterAll: () =>
        pipe([
          tap((params) => {
            assert(pickPropertiesCreate);
          }),
          deepPick(pickPropertiesCreate),
          tap((params) => {
            assert(true);
          }),
          deepDefaults(propertiesDefaultArray),
          tap((params) => {
            assert(true);
          }),
          omit(omitProperties),
          omit(omitPropertiesExtra),
          omit([
            //TODO keep the name and add inferName
            "name",
          ]),
          omitIfEmpty(["properties"]),
          tap((params) => {
            assert(true);
          }),
        ]),
    }),
  //isOurMinion: () => AzTag.isOurMinion,
});

const addDefaultSpecs = pipe([
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
  ]);

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
      ])()
    ),
  ])();

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
