const assert = require("assert");
const CoreClient = require("../CoreClient");
const logger = require("../../logger")({ prefix: "GoogleClient" });
const { createAxiosMakerGoogle } = require("./GoogleCommon");

const { tos } = require("../../tos");
const onResponseListDefault = ({ items = [] }) => {
  return { total: items.length, items };
};

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
  isUpByIdFactory,
  onResponseGet,
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
    isUpByIdFactory,
    onResponseGet,
    onResponseList,
    configDefault,
    findTargetId,
    cannotBeDeleted,
    shouldRetryOnException,
    onCreateExpectedException,
    axios: createAxiosMakerGoogle({
      baseURL,
      url,
      config,
    }),
  });
};
