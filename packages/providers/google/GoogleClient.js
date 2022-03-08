const assert = require("assert");
const { get, pipe, tap, and, eq, any } = require("rubico");
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

module.exports = GoogleClient = ({
  baseURL,
  url,
  spec,
  config,
  findName,
  findId,
  pathList,
  pathCreate,
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
  cannotBeDeleted = () => false,

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
  assert(baseURL);
  assert(url);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.accessToken);

  return CoreClient({
    type: "google",
    spec,
    config,
    findName,
    findId,
    pathList,
    pathCreate,
    pathUpdate,
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
      baseURL,
      url,
      config,
    }),
  });
};
