const assert = require("assert");
const { get, pipe, eq, map, tap } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");

// https://cloud.google.com/compute/docs/reference/rest/v1/addresses
exports.GcpAddress = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { projectId, region, managedByDescription, providerName } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      description: managedByDescription,
    })(properties);

  const isInstanceUp = get("address");

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/regions/${region}/addresses/`,
    config,
    isInstanceUp,
    configDefault,
  });
};
