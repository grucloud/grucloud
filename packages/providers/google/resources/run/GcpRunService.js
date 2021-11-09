const assert = require("assert");
const { get, pipe, eq, map, tap } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "GcpRunService" });
const { tos } = require("@grucloud/core/tos");
const GoogleClient = require("../../GoogleClient");
const { isUpByIdCore } = require("@grucloud/core/Common");

// https://cloud.google.com/run/docs/reference/rest/v1/namespaces.services
exports.GcpRunService = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { projectId, region, managedByDescription, providerName } = config;

  const findName = pipe([get("live.metadata.name")]);
  const findId = findName;
  const findTargetId = findName;

  const configDefault = ({ name, properties }) => defaultsDeep({})(properties);

  const isInstanceUp = identity;

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  return GoogleClient({
    spec,
    baseURL: `https://${region}-run.googleapis.com`,
    url: `apis/serving.knative.dev/v1/namespaces/${projectId}/services`,
    pathUpdate: ({ name }) => `/${name}`,
    verbUpdate: "PUT",
    findTargetId,
    config,
    findName,
    findId,
    isInstanceUp,
    isUpByIdFactory,
    configDefault,
  });
};
