const assert = require("assert");
const { defaultsDeep } = require("rubico/x");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { getField } = require("../../../ProviderCommon");

// https://cloud.google.com/compute/docs/reference/rest/v1/targetHttpsProxies
exports.GcpHttpsTargetProxy = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties, dependencies }) => {
    const { urlMap, sslCertificate } = dependencies;
    assert(urlMap, "missing urlMap dependencies");
    assert(sslCertificate, "missing sslCertificate dependencies");

    return defaultsDeep({
      name,
      description: managedByDescription,
      urlMap: `projects/${project}/global/urlMaps/${urlMap.resource.name}`,
      sslCertificates: [getField(sslCertificate, "selfLink")],
    })(properties);
  };
  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${project}/global/targetHttpsProxies`,
    config,
    configDefault,
  });
};
