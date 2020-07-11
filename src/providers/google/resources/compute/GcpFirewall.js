const assert = require("assert");
const { defaultsDeep } = require("lodash/fp");
const { getField } = require("../../../ProviderCommon");
const GoogleClient = require("../../GoogleClient");
const { isUpByIdCore } = require("../../../Common");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");

const logger = require("../../../../logger")({ prefix: "GcpInstance" });
const { tos } = require("../../../../tos");

// https://cloud.google.com/compute/docs/reference/rest/v1/firewalls
module.exports = GcpFirewall = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ properties, dependencies })}`);
    const { network } = dependencies;
    assert(network, `Firewall '${name}' is missing the 'network' dependency`);

    const config = defaultsDeep(
      {
        name,
        description: managedByDescription,
        network: getField(network, "selfLink"),
      },
      properties
    );
    logger.debug(`configDefault ${tos({ config })}`);

    return config;
  };

  const cannotBeDeleted = (item) => {
    return item.name === "default";
  };

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${project}/global/firewalls`,
    config,
    configDefault,
    cannotBeDeleted,
  });
};
