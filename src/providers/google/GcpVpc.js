const assert = require("assert");
const { defaultsDeep } = require("lodash/fp");
const logger = require("../../logger")({ prefix: "GcpInstance" });
const { tos } = require("../../tos");
const GoogleClient = require("./GoogleClient");

const { isUpByIdCore } = require("../Common");

// https://cloud.google.com/compute/docs/reference/rest/v1/networks
module.exports = GcpVpc = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { project, managedByDescription } = config;

  const configDefault = ({ name, properties }) =>
    defaultsDeep(
      {
        name,
        description: managedByDescription,
      },
      properties
    );

  const isUpByIdFactory = (getById) =>
    isUpByIdCore({
      getById,
    });

  const cannotBeDeleted = (item) => {
    return item.name === "default";
  };

  return GoogleClient({
    spec,
    url: `/projects/${project}/global/networks`,
    config,
    isUpByIdFactory,
    configDefault,
    cannotBeDeleted,
  });
};
