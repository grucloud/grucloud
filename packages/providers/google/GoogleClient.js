const assert = require("assert");
const {
  get,
  pipe,
  tap,
  and,
  fork,
  eq,
  any,
  switchCase,
  filter,
  map,
  not,
  or,
  reduce,
  set,
} = require("rubico");
const {
  first,
  find,
  callProp,
  last,
  values,
  isEmpty,
  defaultsDeep,
  when,
} = require("rubico/x");
const util = require("node:util");

const { getField } = require("@grucloud/core/ProviderCommon");
const CoreClient = require("@grucloud/core/CoreClient");
const { findIdsByPath } = require("@grucloud/core/Common");

const { tos } = require("@grucloud/core/tos");

const logger = require("@grucloud/core/logger")({ prefix: "GoogleClient" });
const { createAxiosMakerGoogle } = require("./GoogleCommon");

const onResponseListDefault = () => get("items", []);

const onResponseDelete = pipe([
  tap((result) => {
    logger.debug(`onResponseDelete ${tos(result)}`);
  }),
]);

const substituteProjectRegionZone = ({ config }) =>
  pipe([
    tap((path) => {
      assert(path);
      assert(config.projectId);
      assert(config.region);
      assert(config.zone);
    }),
    callProp("replace", "{project}", config.projectId),
    callProp("replace", "{projectId}", config.projectId),
    callProp("replace", "{projectsId}", config.projectId),
    callProp("replace", "{region}", config.region),
    callProp("replace", "{zone}", config.zone),
    // Google Cloud Run
    callProp("replace", "{namespacesId}", config.projectId),
    callProp("replace", "{region}", config.region),
    callProp("replace", "{locationsId}", config.region),
  ]);

const substitutePathId = ({ id }) =>
  pipe([
    tap((path) => {
      assert(id);
      assert(path);
    }),
    callProp("replace", new RegExp(`({.*})`), id),
  ]);

const getMethodPath = pipe([
  switchCase([
    get("flatPath"),
    get("flatPath"),
    get("path"),
    get("path"),
    (method) => {
      //assert(false, `no path or flatPath in ${JSON.stringify(method)}`);
    },
  ]),
]);

const getListMethod = pipe([
  switchCase([
    get("search"),
    get("search"),
    get("list"),
    get("list"),
    get("aggregatedList"),
    get("aggregatedList"),
    get("get"),
    get("get"),
    (methods) => {
      assert(false, `no list or aggregatedList in  ${JSON.stringify(methods)}`);
    },
  ]),
]);

const pathListDefaultNoDeps = ({ spec, config }) =>
  pipe([
    () => spec,
    get("methods"),
    getListMethod,
    (method) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => method,
        getMethodPath,
        tap((path) => {
          if (!path) {
            assert(
              path,
              `missing methods list or aggregatedList for ${spec.groupType}`
            );
          }
        }),
        substituteProjectRegionZone({ config }),
      ])(),
  ]);

const pathListDefaultWithDeps = ({ lives, spec, config }) =>
  pipe([
    () => spec,
    get("dependencies"),
    values,
    filter(get("parent")),
    last,
    tap(({ type, group }) => {
      assert(type);
    }),
    ({ type, group }) =>
      lives.getByType({
        providerName: config.providerName,
        type,
        group,
      })(),
    tap((params) => {
      assert(true);
    }),
    map(({ id, live }) =>
      pipe([
        tap((params) => {
          assert(id);
        }),
        () => spec,
        get("methods"),
        getListMethod,
        getMethodPath,
        tap((path) => {
          assert(path, `no getAll or get`);
        }),
        substituteProjectRegionZone({ config }),
        spec.pathLiveFromParent({ live, id }),
      ])()
    ),
    tap((params) => {
      assert(true);
    }),
  ]);

//Look into the url query for dependencies
const pathListDefault =
  ({ spec, config }) =>
  ({ lives }) =>
    pipe([
      () => spec,
      get("dependencies"),
      values,
      filter(get("parent")),
      last,
      switchCase([
        isEmpty,
        pathListDefaultNoDeps({ spec, config }),
        pathListDefaultWithDeps({ lives, spec, config }),
      ]),
    ])();

const pathGetDefault =
  ({ spec, config }) =>
  ({ id }) =>
    pipe([
      () => spec,
      get("methods.get"),
      tap((params) => {
        assert(true);
      }),
      tap((getMethod) => {
        assert(getMethod, `missing methods.get for ${spec.groupType}`);
      }),
      ({ path }) =>
        pipe([
          () => path,
          substituteProjectRegionZone({ config }),
          substitutePathId({ config, id }),
        ])(),
    ])();

const getCreateMethod = pipe([
  switchCase([
    get("insert"),
    get("insert"),
    get("create"),
    get("create"),
    (methods) => {
      assert(false, `no create method in  ${JSON.stringify(methods)}`);
    },
  ]),
]);

const pathCreateDefault =
  ({ spec, config }) =>
  ({}) =>
    pipe([
      () => spec,
      get("methods"),
      getCreateMethod,
      tap((insert) => {
        assert(insert, `missing methods.insert for ${spec.groupType}`);
      }),
      get("path"),
      substituteProjectRegionZone({ config }),
    ])();

const pathDeleteDefault =
  ({ spec, config }) =>
  ({ id }) =>
    pipe([
      () => spec,
      tap((params) => {
        assert(true);
      }),
      get("methods.delete"),
      tap((deleteMethod) => {
        assert(deleteMethod, `missing methods.delete for ${spec.groupType}`);
      }),
      get("path"),
      substituteProjectRegionZone({ config }),
      substitutePathId({ config, id }),
      tap((params) => {
        assert(true);
      }),
    ])();

const pathUpdateDefault =
  ({ spec, config }) =>
  ({ id }) =>
    pipe([
      () => spec,
      get("methods"),
      values,
      fork({
        patches: filter(eq(get("httpMethod"), "PATCH")),
        puts: filter(eq(get("httpMethod"), "PUT")),
      }),
      ({ patches = [], puts = [] }) => [...patches, ...puts],
      first,
      get("path"),
      tap((path) => {
        assert(path, `missing put or patch for ${spec.groupType}`);
      }),
      substituteProjectRegionZone({ config }),
      substitutePathId({ config, id }),
      tap((params) => {
        assert(true);
      }),
    ])();

const isDefaultDefault = () =>
  pipe([
    tap((live) => {
      assert(live);
    }),
    get("name", ""),
    callProp("startsWith", "default"),
  ]);

const cannotBeDeletedDefault =
  ({ spec }) =>
  ({ config }) =>
    or([
      //
      pipe([() => spec, not(get("methods.delete"))]),
      isDefaultDefault({ config }),
    ]);

const findDependenciesFromCreate = ({ spec, live, lives, config }) =>
  pipe([
    () => spec,
    get("dependencies"),
    tap((dependencies) => {
      assert(dependencies);
    }),
    filter(get("pathId")),
    map.entries(([key, { group, type, pathId }]) => [
      key,
      pipe([
        () => live,
        findIdsByPath({ pathId }),
        map((selfLink) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              group,
              type,
            }),
            find(eq(get("live.selfLink"), selfLink)),
            get("id"),
          ])()
        ),
        filter(not(isEmpty)),
        (ids) => ({
          group,
          type,
          ids,
        }),
      ])(),
    ]),
    values,
  ])();

const findDependenciesDefault =
  ({ spec }) =>
  ({ live, lives, config }) =>
    pipe([
      () => [
        // TODO
        //...findDependenciesFromList({ live, lives }),
        ...findDependenciesFromCreate({ spec, live, lives, config }),
      ],
      filter(not(isEmpty)),
    ])();

const findIdDefault = () =>
  pipe([
    get("id"),
    tap((id) => {
      assert(id);
    }),
  ]);

const configDefaultDependenciesId = ({ dependencies, spec }) =>
  pipe([
    tap(() => {
      assert(spec);
      assert(dependencies);
    }),
    () => spec,
    get("dependencies"),
    filter(get("pathId")),
    filter(not(isEmpty)),
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
            switchCase([
              () => list,
              pipe([
                tap((params) => {
                  assert(true);
                }),
              ]),
              pipe([set(pathId, getField(dependencies[varName], "selfLink"))]),
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

const configDefaultGeneric = ({ properties, dependencies, config, spec }) =>
  pipe([
    tap(() => {
      assert(config);
      assert(spec);
    }),
    () => properties,
    // defaultsDeep({
    //   tags: buildTags(config),
    // }),
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

module.exports = GoogleClient = ({
  spec,
  config,
  baseURL,
  findName,
  findId = findIdDefault,
  pathGet = pathGetDefault({ spec, config }),
  pathList = pathListDefault({ spec, config }),
  pathCreate = pathCreateDefault({ spec, config }),
  pathDelete = pathDeleteDefault({ spec, config }),
  pathUpdate = pathUpdateDefault({ spec, config }),
  verbUpdate,
  findTargetId = () => get("targetId"),
  configDefault,
  isInstanceUp,
  isInstanceDown,
  onResponseGet,
  isDefault = isDefaultDefault,
  managedByOther = isDefaultDefault,
  onResponseList = onResponseListDefault,
  cannotBeDeleted = cannotBeDeletedDefault({ spec }),
  onCreateExpectedException = pipe([
    tap((error) => {
      logger.info(`onCreateExpectedException ${util.inspect(error)}`);
    }),
    eq(get("response.status"), 409),
  ]),
  shouldRetryOnExceptionCreate = pipe([
    tap(({ error }) => {
      logger.info(`shouldRetryOnExceptionCreate ${util.inspect(error)}`);
    }),
    and([
      eq(get("error.response.status"), 400),
      pipe([
        get("error.response.data.error.errors"),
        any(eq(get("reason"), "resourceNotReady")),
      ]),
    ]),
  ]),
  findDependencies,
}) => {
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.accessToken);

  return CoreClient({
    type: "google",
    spec,
    config,
    findName: findName || spec.findName,
    findId: spec.findId || findId,
    pathGet,
    pathList,
    pathCreate,
    pathUpdate,
    pathDelete,
    verbUpdate,
    findTargetId,
    isInstanceUp,
    isInstanceDown,
    onResponseGet,
    onResponseList,
    onResponseDelete,
    configDefault: configDefault || spec.configDefault || configDefaultGeneric,
    isDefault,
    managedByOther,
    findTargetId,
    cannotBeDeleted,
    shouldRetryOnExceptionCreate:
      spec.shouldRetryOnExceptionCreate || shouldRetryOnExceptionCreate,
    onCreateExpectedException,
    findDependencies:
      findDependencies ||
      spec.findDependencies ||
      findDependenciesDefault({ spec }),
    axios: createAxiosMakerGoogle({
      baseURL: baseURL || spec.baseUrl,
      config,
    }),
  });
};
