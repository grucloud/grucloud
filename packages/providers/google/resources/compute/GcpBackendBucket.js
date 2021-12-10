const assert = require("assert");
const { get, pipe, eq, map, tap } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");
const GoogleClient = require("../../GoogleClient");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");

// https://cloud.google.com/compute/docs/reference/rest/v1/backendBuckets/insert
exports.GcpBackendBucket = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { projectId, managedByDescription, providerName } = config;

  const isInstanceUp = get("selfLink");

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      description: managedByDescription,
    })(properties);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Bucket",
      group: "storage",
      ids: pipe([
        () => live,
        get("bucketName"),
        (bucketName) => [
          pipe([
            () =>
              lives.getByType({
                type: "Bucket",
                group: "storage",
                providerName,
              }),
            find(eq(get("live.name"), bucketName)),
            get("id"),
          ])(),
        ],
      ])(),
    },
  ];

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/global/backendBuckets`,
    config: { ...config, repeatCount: 1 },
    configDefault,
    isInstanceUp,
    findDependencies,
  });
};
