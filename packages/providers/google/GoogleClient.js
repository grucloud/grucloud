const assert = require("assert");
const { get, pipe, tap, and, eq, any } = require("rubico");
const { callProp, last } = require("rubico/x");
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
    callProp("replace", "{region}", config.region),
    callProp("replace", "{zone}", config.zone),
  ]);

const substitutePathId =
  ({ id, parameterOrder }) =>
  (path) =>
    pipe([
      tap((params) => {
        assert(parameterOrder);
        assert(id);
        assert(path);
      }),
      () => parameterOrder,
      last,
      (lastParam) =>
        pipe([
          tap((params) => {
            assert(lastParam);
          }),
          () => path,
          callProp("replace", `{${lastParam}}`, id),
        ])(),
    ])();

const pathListDefault =
  ({ spec, config }) =>
  ({}) =>
    pipe([
      () => spec,
      get("methods.list"),
      tap((list) => {
        assert(list, `missing methods.list for ${spec.groupType}`);
      }),
      get("path"),
      substituteProjectRegionZone({ config }),
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
      ({ parameterOrder, path }) =>
        pipe([
          () => path,
          substituteProjectRegionZone({ config }),
          substitutePathId({ config, id, parameterOrder }),
        ])(),
    ])();

const pathCreateDefault =
  ({ spec, config }) =>
  ({}) =>
    pipe([
      () => spec,
      get("methods.insert"),
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
      ({ parameterOrder, path }) =>
        pipe([
          () => path,
          substituteProjectRegionZone({ config }),
          substitutePathId({ config, id, parameterOrder }),
        ])(),
    ])();

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
  isDefault,
  managedByOther,
  onResponseList = onResponseListDefault,
  cannotBeDeleted,
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
    findName,
    findId,
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
