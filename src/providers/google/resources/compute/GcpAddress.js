const assert = require("assert");
const { defaultsDeep } = require("lodash/fp");
const logger = require("../../../../logger")({ prefix: "GcpInstance" });
const { tos } = require("../../../../tos");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { isUpByIdCore } = require("../../../Common");

// https://cloud.google.com/compute/docs/reference/rest/v1/addresses
module.exports = GcpAddress = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { project, region, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep(
      {
        name,
        description: managedByDescription,
      },
      properties
    );

  const getStateName = (instance) => {
    const { status } = instance;
    assert(status);
    logger.debug(`stateName ${status}`);
    return status;
  };
  const isInstanceUp = (instance) => {
    //TODO check address instead
    return ["RESERVED"].includes(getStateName(instance));
  };
  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${project}/regions/${region}/addresses/`,
    config,
    isUpByIdFactory,
    configDefault,
  });
};
