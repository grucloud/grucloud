const assert = require("assert");
const path = require("path");
const CoreClient = require("@grucloud/core/CoreClient");
const AxiosMaker = require("@grucloud/core/AxiosMaker");
const logger = require("@grucloud/core/logger")({ prefix: "AzClient" });
//const {tos} = require("@grucloud/core")
const BASE_URL = "https://management.azure.com";

const onResponseList = ({ value = [] }) => ({
  total: value.length,
  items: value,
});

module.exports = AzClient = ({
  spec,
  pathBase,
  pathSuffix,
  pathSuffixList,
  queryParameters,
  isUpByIdFactory,
  isInstanceUp,
  config,
  configDefault,
  cannotBeDeleted,
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
      queryParameters()
    );
  const pathDelete = ({ id }) => path.join(`/${id}`, queryParameters());
  const pathList = () =>
    path.join(
      pathBase,
      pathSuffixList ? pathSuffixList() : "",
      queryParameters()
    );

  const core = CoreClient({
    type: "azure",
    spec,
    config,
    onResponseList,
    configDefault,
    pathGet,
    pathCreate,
    pathDelete,
    pathList,
    verbCreate: "PUT",
    isUpByIdFactory,
    isInstanceUp,
    cannotBeDeleted,
    axios: AxiosMaker({
      baseURL: BASE_URL,
      onHeaders: () => ({
        Authorization: `Bearer ${config.bearerToken()}`,
      }),
    }),
  });

  return core;
};
