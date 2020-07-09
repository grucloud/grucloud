const assert = require("assert");
const { defaultsDeep } = require("lodash/fp");
const logger = require("../../../logger")({ prefix: "GcpInstance" });
const { tos } = require("../../../tos");
const GoogleClient = require("../GoogleClient");
const { isUpByIdCore } = require("../../Common");

// https://cloud.google.com/resource-manager/reference/rest/v1/projects
module.exports = GcpProject = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { managedByKey, managedByValue, stageTagKey, stage } = config;

  //TODO common
  const buildLabel = () => ({
    [managedByKey]: managedByValue,
    [stageTagKey]: stage,
  });

  const configDefault = ({ name, properties }) =>
    defaultsDeep(
      {
        name,
        projectId: name,
        labels: buildLabel(),
      },
      properties
    );

  const isUpByIdFactory = (getById) => isUpByIdCore({ getById });

  return GoogleClient({
    spec,
    baseURL: `https://cloudresourcemanager.googleapis.com/v1`,
    url: `/projects`,
    config,
    isUpByIdFactory,
    configDefault,
  });
};
