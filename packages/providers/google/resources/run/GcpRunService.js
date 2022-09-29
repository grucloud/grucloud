const assert = require("assert");
const { get, pipe, eq, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const GoogleClient = require("../../GoogleClient");

// https://cloud.google.com/run/docs/reference/rest/v1/namespaces.services
exports.GcpRunService = ({ spec, config }) => {
  assert(spec);
  assert(config);
  assert(config.stage);
  const { projectId, region } = config;

  const findName = get("live.metadata.name");
  const findId = findName;
  const findTargetId = () => get("metadata.name");

  const configDefault = ({ name, properties }) => defaultsDeep({})(properties);

  const isInstanceUp = get("status.url");

  return GoogleClient({
    spec,
    baseURL: `https://${region}-run.googleapis.com`,
    url: `apis/serving.knative.dev/v1/namespaces/${projectId}/services`,
    verbUpdate: "PUT",
    findTargetId,
    config,
    findName,
    findId,
    isInstanceUp,
    configDefault,
  });
};
