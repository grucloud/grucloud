const assert = require("assert");
const { defaultsDeep } = require("rubico/x");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { getField } = require("../../../ProviderCommon");
const { isUpByIdCore } = require("../../../Common");

// https://cloud.google.com/compute/docs/reference/rest/v1/globalForwardingRules
exports.GcpGlobalForwardingRule = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties, dependencies }) => {
    const { httpsTargetProxy } = dependencies;
    return defaultsDeep({
      name,
      description: managedByDescription,
      target: getField(httpsTargetProxy, "selfLink"),
      portRange: "443",
    })(properties);
  };

  const isInstanceUp = (instance) => {
    return !!instance.IPAddress;
  };

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });
  // Up when IPAddress is valid
  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${project}/global/forwardingRules`,
    config,
    configDefault,
    isUpByIdFactory,
  });
};
