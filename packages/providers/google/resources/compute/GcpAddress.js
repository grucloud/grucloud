const assert = require("assert");
const { get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "GcpAddress" });
const { tos } = require("@grucloud/core/tos");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { isUpByIdCore } = require("@grucloud/core/Common");

// https://cloud.google.com/compute/docs/reference/rest/v1/addresses
exports.GcpAddress = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { projectId, region, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      description: managedByDescription,
    })(properties);

  const isInstanceUp = get("address");

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/regions/${region}/addresses/`,
    config,
    isInstanceUp,
    isUpByIdFactory,
    configDefault,
  });
};
