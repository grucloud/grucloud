const assert = require("assert");
const { get, pipe, tap } = require("rubico");
const CoreClient = require("@grucloud/core/CoreClient");
const logger = require("@grucloud/core/logger")({ prefix: "GoogleClient" });
const { createAxiosMakerGoogle } = require("./GoogleCommon");

const { tos } = require("@grucloud/core/tos");
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
  //TODO rubico
  onCreateExpectedException = (error) => {
    logger.info(`onCreateExpectedException ${tos(error)}`);
    return error.response?.status === 409;
  },
  shouldRetryOnExceptionCreate = ({ error, name }) => {
    logger.error(`shouldRetryOnExceptionCreate ${tos({ name, error })}`);
    const { response } = error;
    if (!response) return false;
    if (
      response.status === 400 &&
      response.data?.error?.errors?.find(
        (error) => error.reason === "resourceNotReady"
      )
    ) {
      logger.info("shouldRetryOnExceptionCreate retrying");
      return true;
    }
    logger.info("shouldRetryOnException NOT retrying");

    return false;
  },
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
