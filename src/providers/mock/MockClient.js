const _ = require("lodash");
const assert = require("assert");
const CoreClient = require("../CoreClient");
const logger = require("../../logger")({ prefix: "MockClient" });
const { tos } = require("../../tos");
const { findField } = require("../Common");

module.exports = MockClient = ({
  spec,
  url,
  config,
  findId,
  configDefault,
}) => {
  assert(spec);
  assert(url);
  assert(config);

  const { createAxios } = config;
  assert(createAxios);

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

  const findName = (item) => findField({ item, field: "name" });
  const core = CoreClient({
    type: "mock",
    spec,
    config,
    ...spec, //TODO
    axios: createAxios({ spec, url, config }),
    findId,
    configDefault,
    findName,
    shouldRetryOnError,
  });
  return core;
};
