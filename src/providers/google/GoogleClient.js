const assert = require("assert");
const urljoin = require("url-join");
const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");
const logger = require("../../logger")({ prefix: "GoogleClient" });
//const {tos} = require("../../tos")

const BASE_URL = "https://compute.googleapis.com/compute/v1/";

const onResponseList = ({ items = [] }) => {
  return { total: items.length, items };
};

module.exports = GoogleClient = ({
  baseURL = BASE_URL,
  url,
  spec,
  config,
  configDefault,
  isUpByIdFactory,
  cannotBeDeleted,
}) => {
  assert(url);
  assert(spec);
  assert(spec.type);
  assert(config);
  const findTargetId = (item) => item.targetId;

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
