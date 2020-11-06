const assert = require("assert");
const urljoin = require("url-join");
const logger = require("../../logger")({ prefix: "GoogleCommon" });
const { tos } = require("../../tos");
const AxiosMaker = require("../AxiosMaker");
exports.buildLabel = ({
  managedByKey,
  stageTagKey,
  managedByValue,
  stage,
}) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});

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
