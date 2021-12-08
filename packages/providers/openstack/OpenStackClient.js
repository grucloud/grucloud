const assert = require("assert");
const CoreClient = require("@grucloud/core/CoreClient");
const AxiosMaker = require("@grucloud/core/AxiosMaker");
const logger = require("@grucloud/core/logger")({ prefix: "OpenStack" });

module.exports = OpenStackClient = ({
  spec,
  pathBase,
  pathSuffixList,
  isUpByIdFactory,
  isInstanceUp,
  config,
  configDefault,
  isDefault,
  cannotBeDeleted,
  findDependencies,
  onResponseList,
  findName,
}) => {
  assert(pathBase);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.bearerToken);
  assert(onResponseList);

  const pathGet = ({ id }) => `/${id}`;
  const pathCreate = () => pathBase;
  const pathDelete = ({ id }) => `/${id}`;
  const pathList = () => `${pathBase}${pathSuffixList()}`;

  const axios = AxiosMaker({
    onHeaders: () => ({
      "X-Auth-Token": `${config.bearerToken()}`,
    }),
  });

  return CoreClient({
    type: "openstack",
    spec,
    config,
    findDependencies,
    onResponseList,
    findName,
    configDefault,
    pathGet,
    pathCreate,
    pathDelete,
    pathList,
    isUpByIdFactory,
    isInstanceUp,
    isDefault,
    cannotBeDeleted,
    axios,
  });
};
