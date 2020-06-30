const assert = require("assert");
const path = require("path");
const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");
const logger = require("../../logger")({ prefix: "AzClient" });
//const {tos} = require("../../tos")
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
  config,
  configDefault,
}) => {
  assert(pathBase);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.bearerToken);

  const pathGet = path.join(`/${id}`, queryParameters());
  const pathCreate = path.join(
    pathBase,
    pathSuffix ? `${pathSuffix({ dependencies })}/${name}` : "",
    queryParameters()
  );
  const pathDelete = path.join(`/${id}`, queryParameters());
  const pathList = path.join(
    pathBase,
    pathSuffixList ? pathSuffixList() : "",
    queryParameters()
  );

  const core = CoreClient({
    type: "azure",
    spec,
    onResponseList,
    configDefault,
    pathGet,
    pathCreate,
    pathDelete,
    pathList,
    verbCreate: "PUT",
    isUpByIdFactory,
    axios: AxiosMaker({
      baseURL: BASE_URL,
      onHeaders: () => ({
        Authorization: `Bearer ${config.bearerToken}`,
      }),
    }),
  });

  return core;
};
