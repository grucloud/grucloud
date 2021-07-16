const assert = require("assert");
const { get, pipe, eq, map, tap } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

// https://cloud.google.com/compute/docs/reference/rest/v1/urlMaps
exports.GcpUrlMap = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { projectId, managedByDescription, providerName } = config;

  const configDefault = ({ name, properties, dependencies }) => {
    const { service } = dependencies;
    return defaultsDeep({
      name,
      description: managedByDescription,
      defaultService: getField(service, "selfLink"),
    })(properties);
  };

  const findDependencies = ({ live, lives }) => [
    {
      type: "BackendBucket",
      ids: pipe([
        () => live,
        get("defaultService"),
        (defaultService) => [
          pipe([
            () =>
              lives.getByType({
                type: "BackendBucket",
                group: "compute",
                providerName,
              }),
            find(eq(get("live.selfLink"), defaultService)),
            get("id"),
          ])(),
        ],
      ])(),
    },
  ];
  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/global/urlMaps`,
    config,
    configDefault,
    findDependencies,
  });
};
