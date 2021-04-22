const assert = require("assert");
const { eq, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");

const logger = require("@grucloud/core/logger")({ prefix: "GcpSubNetwork" });
const { tos } = require("@grucloud/core/tos");

// https://cloud.google.com/compute/docs/reference/rest/v1/subnetworks
module.exports = GcpSubNetwork = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const isDefault = eq(get("live.name"), "default");
  const cannotBeDeleted = isDefault;

  const { projectId, region, managedByDescription } = config;
  assert(region);
  const configDefault = ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ properties, dependencies })}`);
    const { network } = dependencies;
    assert(network, `SubNetwork '${name}' is missing the 'network' dependency`);

    const config = defaultsDeep({
      name,
      description: managedByDescription,
      network: getField(network, "selfLink"),
    })(properties);
    logger.debug(`configDefault ${tos({ config })}`);
    return config;
  };

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId(config)}/regions/${region}/subnetworks`,
    config,
    configDefault,
    isDefault,
    cannotBeDeleted,
  });
};
