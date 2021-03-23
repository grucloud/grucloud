const assert = require("assert");
const { get } = require("rubico");

const CoreClient = require("@grucloud/core/CoreClient");
const logger = require("@grucloud/core").logger({ prefix: "MockClient" });

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

  const shouldRetryOnException = ({ error }) => {
    logger.debug("shouldRetryOnException");
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
    return false;
  };

  const findName = get("name");

  const core = CoreClient({
    type: "mock",
    spec,
    config,
    axios: createAxios({ spec, url, config }),
    findId,
    configDefault,
    findName,
    shouldRetryOnException,
  });
  return core;
};
