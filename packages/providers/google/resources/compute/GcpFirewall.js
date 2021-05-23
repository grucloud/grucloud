const assert = require("assert");
const { eq, get, pipe, tap, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const GoogleClient = require("../../GoogleClient");
const {
  GCP_COMPUTE_BASE_URL,
  findDependenciesNetwork,
} = require("./GcpComputeCommon");

const logger = require("@grucloud/core/logger")({ prefix: "GcpFirewall" });
const { tos } = require("@grucloud/core/tos");

// https://cloud.google.com/compute/docs/reference/rest/v1/firewalls
exports.GcpFirewall = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const { providerName } = config;
  const { projectId, managedByDescription } = config;

  const findDependencies = ({ live, lives }) => [
    findDependenciesNetwork({ live, lives, providerName }),
  ];

  const configDefault = ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ properties, dependencies })}`);
    const { network } = dependencies;

    const config = defaultsDeep({
      name,
      description: managedByDescription,
      ...(network && { network: getField(network, "selfLink") }),
    })(properties);
    logger.debug(`configDefault ${tos({ config })}`);

    return config;
  };

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/global/firewalls`,
    config,
    configDefault,
    findDependencies,
    cannotBeDeleted: eq(get("live.name"), "default"),
  });
};
