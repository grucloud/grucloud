const assert = require("assert");
const { get, pipe, eq, map, tap } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { isUpByIdCore } = require("@grucloud/core/Common");

// https://cloud.google.com/compute/docs/reference/rest/v1/targetHttpsProxies
exports.GcpHttpsTargetProxy = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { projectId, managedByDescription, providerName } = config;

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
      urlMap: `projects/${projectId}/global/urlMaps/${urlMap.resource.name}`,
      sslCertificates: [getField(sslCertificate, "selfLink")],
    })(properties);
  };

  const findDependencies = ({ live, lives }) => [
    {
      type: "SslCertificate",
      group: "compute",
      ids: pipe([
        () => live,
        get("sslCertificates"),
        map((sslCertificateLink) =>
          pipe([
            () =>
              lives.getByType({
                type: "SslCertificate",
                group: "compute",
                providerName,
              }),
            find(eq(get("live.selfLink"), sslCertificateLink)),
            get("id"),
          ])()
        ),
      ])(),
    },
    {
      type: "UrlMap",
      group: "compute",
      ids: [
        pipe([
          () => live,
          get("urlMap"),
          (urlMap) =>
            pipe([
              () =>
                lives.getByType({
                  type: "UrlMap",
                  group: "compute",
                  providerName,
                }),
              find(eq(get("live.selfLink"), urlMap)),
              get("id"),
            ])(),
        ])(),
      ],
    },
  ];

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/global/targetHttpsProxies`,
    config,
    isInstanceUp,
    isUpByIdFactory,
    configDefault,
    findDependencies,
  });
};
