const assert = require("assert");
const urljoin = require("url-join");
const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");
const logger = require("../../logger")({ prefix: "GoogleClient" });
//const {tos} = require("../../tos")

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
  findTargetId = (item) => item.targetId,
  configDefault,
  isUpByIdFactory,
  onResponseList = onResponseListDefault,
  cannotBeDeleted,
}) => {
  assert(baseURL);
  assert(url);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.accessToken);

  const shouldRetryOnError = (error) => {
    logger.debug("shouldRetryOnError");
    const { response } = error;
    if (!response) return false;
    if (
      response.status === 400 &&
      response.data?.error?.errors?.find(
        (error) => error.reason === "resourceNotReady"
      )
    ) {
      logger.info("shouldRetryOnError retrying");
      return true;
    }
    return false;
  };

  return CoreClient({
    type: "google",
    spec,
    config,
    findName,
    findId,
    findTargetId,
    isUpByIdFactory,
    onResponseList,
    configDefault,
    findTargetId,
    cannotBeDeleted,
    shouldRetryOnError,
    axios: AxiosMaker({
      baseURL: urljoin(baseURL, url),
      onHeaders: () => ({
        Authorization: `Bearer ${config.accessToken}`,
      }),
    }),
  });
};
