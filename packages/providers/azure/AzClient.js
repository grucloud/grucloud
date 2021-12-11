const assert = require("assert");
const path = require("path");
const { get } = require("rubico");
const CoreClient = require("@grucloud/core/CoreClient");
const AxiosMaker = require("@grucloud/core/AxiosMaker");

const { isInstanceUp: isInstanceUpDefault } = require("./AzureCommon");

const BASE_URL = "https://management.azure.com";

const queryParameters = (apiVersion) => `?api-version=${apiVersion}`;

module.exports = AzClient = ({
  spec,
  pathBase = () => `/subscriptions/${process.env.SUBSCRIPTION_ID}`,
  pathSuffix,
  pathSuffixList,
  apiVersion,
  isInstanceUp = isInstanceUpDefault,
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
  verbCreate = "PUT",
  verbUpdate = "PATCH",
  pathUpdate = ({ id }) => `${id}${queryParameters(apiVersion)}`,
}) => {
  assert(spec);
  assert(spec.type);
  assert(apiVersion);
  assert(config);
  assert(config.bearerToken);

  const pathGet = ({ id }) => `${id}${queryParameters(apiVersion)}`;

  const pathCreate = ({ dependencies, name }) =>
    `${path.join(
      pathBase(),
      pathSuffix ? `${pathSuffix({ dependencies })}/${name}` : ""
    )}${queryParameters(apiVersion)}`;

  const pathDelete = ({ id }) => `${id}${queryParameters(apiVersion)}`;

  const pathList = () =>
    `${path.join(
      pathBase(),
      pathSuffixList ? pathSuffixList() : ""
    )}${queryParameters(apiVersion)}`;

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
    verbCreate,
    verbUpdate,
    isInstanceUp,
    isDefault,
    cannotBeDeleted,
    axios,
    getList: getList({ axios }),
    getByName: getByName({ axios }),
  });
};
