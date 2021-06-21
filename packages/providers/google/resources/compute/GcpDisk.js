const assert = require("assert");
const { get, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "GcpDisk" });
const { tos } = require("@grucloud/core/tos");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { isUpByIdCore } = require("@grucloud/core/Common");
const { buildLabel } = require("../../GoogleCommon");

// https://cloud.google.com/compute/docs/reference/rest/v1/disks
exports.GcpDisk = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { projectId, zone } = config;
  assert(zone);

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      labels: buildLabel(config),
    })(properties);

  const isInstanceUp = eq(get("status"), "READY");

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/zones/${zone}/disks`,
    config,
    isInstanceUp,
    isUpByIdFactory,
    configDefault,
  });
};
