const assert = require("assert");
const { defaultsDeep } = require("rubico/x");

const logger = require("../../../../logger")({ prefix: "GcpInstance" });
const { tos } = require("../../../../tos");
const GoogleClient = require("../../GoogleClient");
const { buildLabel } = require("../../GoogleCommon");

// https://cloud.google.com/resource-manager/reference/rest/v1/projects
module.exports = GcpProject = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const configDefault = ({ name, properties }) =>
    defaultsDeep({
      name,
      projectId: name,
      labels: buildLabel(config),
    })(properties);

  return GoogleClient({
    spec,
    baseURL: `https://cloudresourcemanager.googleapis.com/v1`,
    url: `/projects`,
    config,
    configDefault,
  });
};
