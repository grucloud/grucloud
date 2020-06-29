const { defaultsDeep } = require("lodash/fp");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "GcpInstance" });
const { tos } = require("../../tos");
const GoogleClient = require("./GoogleClient");

const { toTagName } = require("./GoogleTag");
const { getField } = require("../ProviderCommon");
const { isUpByIdCore } = require("../Common");

// https://cloud.google.com/compute/docs/reference/rest/v1/addresses

module.exports = GcpAddress = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const {
    project,
    region,
    zone,
    tag,
    managedByDescription,
    stageTagKey,
    stage,
  } = config;

  const configDefault = ({ name, properties }) => ({
    name,
    description: managedByDescription,
    ...properties,
  });

  const getStateName = (instance) => {
    const { status } = instance;
    assert(status);
    logger.debug(`stateName ${status}`);
    return status;
  };

  const isUpByIdFactory = (getById) =>
    isUpByIdCore({
      states: ["RESERVED"],
      getStateName,
      getById,
    });

  const client = GoogleClient({
    spec,
    url: `/projects/${project}/regions/${region}/addresses/`,
    config,
    isUpByIdFactory,
    configDefault,
  });

  return client;
};
