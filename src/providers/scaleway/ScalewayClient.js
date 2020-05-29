const assert = require("assert");
const CoreClient = require("../CoreClient");
const urljoin = require("url-join");
const AxiosMaker = require("../AxiosMaker");

const BASE_URL = "https://api.scaleway.com/instance/v1/";

module.exports = ScalewayClient = ({
  spec,
  url,
  onResponseList,
  config,
  configDefault,
  toName,
}) => {
  assert(url);
  assert(spec);
  assert(spec.type);
  assert(config);
  const core = CoreClient({
    type: "scaleway",
    spec,
    onResponseList,
    toName,
    configDefault,
    axios: AxiosMaker({
      baseURL: urljoin(BASE_URL, "zones", config.zone, url),
      onHeaders: () => ({ "X-Auth-Token": config.secretKey }),
    }),
  });

  return {
    spec,
    getById: core.getById,
    getByName: core.getByName,
    findName: core.findName,
    isUp: core.isUp,
    create: core.create,
    destroy: core.destroy,
    list: core.list,
    configDefault: core.configDefault,
    toName: core.toName,
  };
};
