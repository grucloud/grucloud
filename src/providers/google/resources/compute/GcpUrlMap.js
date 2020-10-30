const assert = require("assert");
const { defaultsDeep } = require("rubico/x");

const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { getField } = require("../../../ProviderCommon");

// https://cloud.google.com/compute/docs/reference/rest/v1/urlMaps
exports.GcpUrlMap = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties, dependencies }) => {
    const { service } = dependencies;
    return defaultsDeep({
      name,
      description: managedByDescription,
      defaultService: getField(service, "selfLink"),
    })(properties);
  };

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${project}/global/urlMaps`,
    config,
    configDefault,
    shouldRetryOnException: (error) => {
      return error.response?.status === 404;
    },
  });
};
