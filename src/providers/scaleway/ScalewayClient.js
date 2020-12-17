const assert = require("assert");
const { get } = require("rubico");
const urljoin = require("url-join");

const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");
const logger = require("../../logger")({ prefix: "ScalewayClient" });
const { tos } = require("../../tos");
const BASE_URL = "https://api.scaleway.com/instance/v1/";

module.exports = ScalewayClient = ({
  spec,
  url,
  onResponseList,
  config,
  findTargetId,
  configDefault,
}) => {
  assert(url);
  assert(spec);
  assert(spec.type);
  assert(config);
  assert(process.env.SCW_SECRET_KEY);

  const findName = get("title");

  const core = CoreClient({
    type: "scaleway",
    spec,
    config,
    onResponseList,
    findName,
    findTargetId,
    configDefault,
    axios: AxiosMaker({
      baseURL: urljoin(BASE_URL, "zones", config.zone, url),
      onHeaders: () => ({ "X-Auth-Token": process.env.SCW_SECRET_KEY }),
    }),
  });

  return core;
};
