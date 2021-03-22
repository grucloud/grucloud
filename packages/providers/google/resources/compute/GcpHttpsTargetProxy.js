const assert = require("assert");
const { get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { isUpByIdCore } = require("@grucloud/core/Common");

// https://cloud.google.com/compute/docs/reference/rest/v1/targetHttpsProxies
exports.GcpHttpsTargetProxy = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { projectId, managedByDescription } = config;

  const isInstanceUp = get("selfLink");

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  const configDefault = ({ name, properties, dependencies }) => {
    const { urlMap, sslCertificate } = dependencies;
    assert(urlMap, "missing urlMap dependencies");
    assert(sslCertificate, "missing sslCertificate dependencies");

    return defaultsDeep({
      name,
      description: managedByDescription,
      urlMap: `projects/${projectId(config)}/global/urlMaps/${
        urlMap.resource.name
      }`,
      sslCertificates: [getField(sslCertificate, "selfLink")],
    })(properties);
  };

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId(config)}/global/targetHttpsProxies`,
    config,
    isInstanceUp,
    isUpByIdFactory,
    configDefault,
  });
};
