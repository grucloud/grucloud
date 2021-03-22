const assert = require("assert");
const urljoin = require("url-join");
const logger = require("@grucloud/core/logger")({ prefix: "GoogleCommon" });
const { tos } = require("@grucloud/core/tos");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

exports.buildLabel = ({
  managedByKey,
  stageTagKey,
  managedByValue,
  stage,
}) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});

exports.shouldRetryOnException = ({ error, name }) => {
  logger.error(`gcp shouldRetryOnException ${tos({ name, error })}`);
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
};

exports.createAxiosMakerGoogle = ({
  baseURL = "",
  url = "",
  config,
  contentType,
}) =>
  AxiosMaker({
    baseURL: urljoin(baseURL, url),
    contentType,
    onHeaders: () => {
      const accessToken = config.accessToken();
      assert(accessToken, "accessToken not set");
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    },
  });
