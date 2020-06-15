const assert = require("assert");
const urljoin = require("url-join");
const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");
const logger = require("../../logger")({ prefix: "AzClient" });
const toString = (x) => JSON.stringify(x, null, 4);

const BASE_URL = "https://management.azure.com";

const onResponseList = ({ value }) => ({
  total: value.length,
  items: value,
});

module.exports = AzClient = ({
  url,
  spec,
  path,
  pathList,
  queryParameters,
  config,
  configDefault,
}) => {
  assert(url);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(config.bearerToken);

  const core = CoreClient({
    type: "azure",
    spec,
    onResponseList,
    configDefault,
    path,
    pathList,
    queryParameters,
    verbCreate: "PUT",
    findTargetId: (item) => item.name,
    findId: (item) => item.name,
    axios: AxiosMaker({
      baseURL: urljoin(BASE_URL, url),
      onHeaders: () => ({
        Authorization: `Bearer ${config.bearerToken}`,
      }),
    }),
  });

  return core;
};
