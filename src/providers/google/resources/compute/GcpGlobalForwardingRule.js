const assert = require("assert");
const { get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { getField } = require("../../../ProviderCommon");
const { isUpByIdCore } = require("../../../Common");

// https://cloud.google.com/compute/docs/reference/rest/v1/globalForwardingRules
exports.GcpGlobalForwardingRule = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { projectId, managedByDescription } = config;

  const configDefault = ({ name, properties, dependencies }) => {
    const { httpsTargetProxy } = dependencies;
    return defaultsDeep({
      name,
      description: managedByDescription,
      target: getField(httpsTargetProxy, "selfLink"),
      portRange: "443",
    })(properties);
  };

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp: get("IPAddress"),
      getById,
    });

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId(config)}/global/forwardingRules`,
    config,
    configDefault,
    isUpByIdFactory,
  });
};
