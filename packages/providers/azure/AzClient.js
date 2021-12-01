const assert = require("assert");
const path = require("path");
const { get } = require("rubico");
const CoreClient = require("@grucloud/core/CoreClient");
const AxiosMaker = require("@grucloud/core/AxiosMaker");
const logger = require("@grucloud/core/logger")({ prefix: "AzClient" });
//const {tos} = require("@grucloud/core")
const BASE_URL = "https://management.azure.com";

const onResponseList = get("value", []);

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
  getList = () => undefined,
  getByName = () => undefined,
}) => {
  assert(pathBase);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.bearerToken);

  const pathGet = ({ id }) => path.join(`/${id}`, queryParameters());
  const pathCreate = ({ dependencies, name }) =>
    path.join(
      pathBase,
      pathSuffix ? `${pathSuffix({ dependencies })}/${name}` : "",
      queryParametersCreate() || queryParameters()
    );
  const pathDelete = ({ id }) => path.join(`/${id}`, queryParameters());

  const pathList = () =>
    path.join(
      pathBase,
      pathSuffixList ? pathSuffixList() : "",
      queryParameters()
    );

  const pathUpdate = ({ id }) => path.join(`/${id}`, queryParameters());

  const axios = AxiosMaker({
    baseURL: BASE_URL,
    onHeaders: () => ({
      Authorization: `Bearer ${config.bearerToken()}`,
    }),
  });

  const core = CoreClient({
    type: "azure",
    spec,
    config,
    findDependencies,
    onResponseList,
    configDefault,
    pathGet,
    pathCreate,
    pathUpdate,
    pathDelete,
    pathList,
    verbCreate: "PUT",
    isUpByIdFactory,
    isInstanceUp,
    isDefault,
    cannotBeDeleted,
    axios,
    getList: getList({ axios }),
    getByName: getByName({ axios }),
  });

  return core;
};
