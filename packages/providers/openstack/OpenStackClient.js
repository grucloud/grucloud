const assert = require("assert");
const path = require("path");
const CoreClient = require("@grucloud/core/CoreClient");
const AxiosMaker = require("@grucloud/core/AxiosMaker");
const logger = require("@grucloud/core/logger")({ prefix: "OpenStackClient" });
//const {tos} = require("@grucloud/core")

const onResponseList = ({ value = [] }) => ({
  total: value.length,
  items: value,
});

module.exports = OpenStackClient = ({
  spec,
  pathBase,
  pathSuffix,
  pathSuffixList,
  isUpByIdFactory,
  isInstanceUp,
  config,
  configDefault,
  isDefault,
  cannotBeDeleted,
  findDependencies,
}) => {
  assert(pathBase);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.bearerToken);

  const pathGet = ({ id }) => path.join(`/${id}`);
  const pathCreate = ({ dependencies, name }) =>
    path.join(
      pathBase,
      pathSuffix ? `${pathSuffix({ dependencies })}/${name}` : ""
    );
  const pathDelete = ({ id }) => path.join(`/${id}`);
  const pathList = () => `${pathBase}${pathSuffixList()}`;

  const core = CoreClient({
    type: "openstack",
    spec,
    config,
    findDependencies,
    onResponseList,
    configDefault,
    pathGet,
    pathCreate,
    pathDelete,
    pathList,
    isUpByIdFactory,
    isInstanceUp,
    isDefault,
    cannotBeDeleted,
    axios: AxiosMaker({
      onHeaders: () => ({
        "X-Auth-Token": `${config.bearerToken()}`,
      }),
    }),
  });

  return core;
};
