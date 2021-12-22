const assert = require("assert");
const CoreClient = require("@grucloud/core/CoreClient");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

module.exports = OpenStackClient = ({
  spec,
  pathBase,
  pathSuffixList,
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
    isInstanceUp,
    isDefault,
    cannotBeDeleted,
    axios,
  });
};
