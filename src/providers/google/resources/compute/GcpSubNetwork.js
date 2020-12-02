const assert = require("assert");
const { eq, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("../../../ProviderCommon");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");

const logger = require("../../../../logger")({ prefix: "GcpSubNetwork" });
const { tos } = require("../../../../tos");

// https://cloud.google.com/compute/docs/reference/rest/v1/subnetworks
module.exports = GcpSubNetwork = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { projectId, region, managedByDescription } = config;

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
    cannotBeDeleted: eq(get("resource.name", "default")),
  });
};
