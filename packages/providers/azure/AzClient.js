const assert = require("assert");
const path = require("path");
const { get } = require("rubico");
const CoreClient = require("@grucloud/core/CoreClient");
const AxiosMaker = require("@grucloud/core/AxiosMaker");
const logger = require("@grucloud/core/logger")({ prefix: "AzClient" });

const BASE_URL = "https://management.azure.com";

module.exports = AzClient = ({
  spec,
  pathBase,
  pathSuffix,
  pathSuffixList,
  queryParametersCreate = () => undefined,
  queryParameters,
  isUpByIdFactory,
  isInstanceUp,
  config,
  configDefault,
  isDefault,
  cannotBeDeleted,
  findDependencies,
  findTargetId,
  getList = () => undefined,
  getByName = () => undefined,
  onResponseList = () => get("value", []),
  decorate,
}) => {
  assert(pathBase);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.bearerToken);

  const pathGet = ({ id }) => `${id}${queryParameters()}`;

  const pathCreate = ({ dependencies, name }) =>
    `${path.join(
      pathBase,
      pathSuffix ? `${pathSuffix({ dependencies })}/${name}` : ""
    )}${queryParametersCreate() || queryParameters()}`;

  const pathDelete = ({ id }) => `${id}${queryParameters()}`;

  const pathList = () =>
    `${path.join(
      pathBase,
      pathSuffixList ? pathSuffixList() : ""
    )}${queryParameters()}`;

  const pathUpdate = ({ id }) => `${id}${queryParameters()}`;

  const axios = AxiosMaker({
    baseURL: BASE_URL,
    onHeaders: () => ({
      Authorization: `Bearer ${config.bearerToken()}`,
    }),
  });

  return CoreClient({
    type: "azure",
    spec,
    config,
    findDependencies,
    onResponseList,
    decorate,
    configDefault,
    pathGet,
    pathCreate,
    pathUpdate,
    pathDelete,
    pathList,
    findTargetId,
    verbCreate: "PUT",
    isUpByIdFactory,
    isInstanceUp,
    isDefault,
    cannotBeDeleted,
    axios,
    getList: getList({ axios }),
    getByName: getByName({ axios }),
  });
};
