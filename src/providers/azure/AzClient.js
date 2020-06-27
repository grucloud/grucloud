const assert = require("assert");
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

  const core = CoreClient({
    type: "azure",
    spec,
    onResponseList,
    configDefault,
    pathBase,
    pathSuffix,
    pathSuffixList,
    queryParameters,
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
