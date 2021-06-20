const assert = require("assert");
const { pipe, tap } = require("rubico");
const CoreClient = require("@grucloud/core/CoreClient");
const logger = require("@grucloud/core/logger")({ prefix: "GoogleClient" });
const { createAxiosMakerGoogle } = require("./GoogleCommon");

const { tos } = require("@grucloud/core/tos");
const onResponseListDefault = ({ items = [] }) => {
  return { total: items.length, items };
};
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
  findTargetId = (item) => item.targetId,
  configDefault,
  isInstanceUp,
  isUpByIdFactory,
  isDownByIdFactory,
  onResponseGet,
  isDefault,
  onResponseList = onResponseListDefault,
  cannotBeDeleted = () => false,
  onCreateExpectedException = (error) => {
    logger.info(`onCreateExpectedException ${tos(error)}`);
    return error.response?.status === 409;
  },
  shouldRetryOnException = ({ error, name }) => {
    logger.error(`shouldRetryOnException ${tos({ name, error })}`);
    const { response } = error;
    if (!response) return false;
    if (
      response.status === 400 &&
      response.data?.error?.errors?.find(
        (error) => error.reason === "resourceNotReady"
      )
    ) {
      logger.info("shouldRetryOnException retrying");
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
    findTargetId,
    isInstanceUp,
    isUpByIdFactory,
    isDownByIdFactory,
    onResponseGet,
    onResponseList,
    onResponseDelete,
    configDefault,
    isDefault,
    findTargetId,
    cannotBeDeleted,
    shouldRetryOnException,
    onCreateExpectedException,
    findDependencies,
    axios: createAxiosMakerGoogle({
      baseURL,
      url,
      config,
    }),
  });
};
