const assert = require("assert");
const {
  get,
  pipe,
  tap,
  and,
  eq,
  any,
  switchCase,
  filter,
  map,
  not,
  or,
} = require("rubico");
const { callProp, last, values } = require("rubico/x");
const util = require("util");

const CoreClient = require("@grucloud/core/CoreClient");
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
      }),
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

const isDefaultDefault = pipe([
  tap(({ live }) => {
    assert(live);
  }),
  get("live.name", ""),
  callProp("startsWith", "default"),
]);

const cannotBeDeletedDefault = ({ spec, config }) =>
  or([
    //
    pipe([() => spec, not(get("methods.delete"))]),
    isDefaultDefault,
  ]);

module.exports = GoogleClient = ({
  spec,
  config,
  baseURL,
  findName,
  findId,
  pathGet = pathGetDefault({ spec, config }),
  pathList = pathListDefault({ spec, config }),
  pathCreate = pathCreateDefault({ spec, config }),
  pathDelete = pathDeleteDefault({ spec, config }),
  pathUpdate,
  verbUpdate,
  findTargetId = () => get("targetId"),
  configDefault,
  isInstanceUp,
  isInstanceDown,
  onResponseGet,
  isDefault = isDefaultDefault,
  managedByOther = isDefaultDefault,
  onResponseList = onResponseListDefault,
  cannotBeDeleted = cannotBeDeletedDefault({ spec, config }),
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

  //assert(spec.baseUrl, `no baseUrl for ${spec.groupType}`);

  assert(config);
  assert(config.accessToken);

  return CoreClient({
    type: "google",
    spec,
    config,
    findName: findName || spec.findName,
    findId: findId || spec.findId,
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
    configDefault,
    isDefault,
    managedByOther,
    findTargetId,
    cannotBeDeleted,
    shouldRetryOnExceptionCreate,
    onCreateExpectedException,
    findDependencies,
    axios: createAxiosMakerGoogle({
      baseURL: baseURL || spec.baseUrl,
      config,
    }),
  });
};
