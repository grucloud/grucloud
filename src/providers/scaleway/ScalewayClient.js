const assert = require("assert");
const CoreClient = require("../CoreClient");
const urljoin = require("url-join");
const AxiosMaker = require("../AxiosMaker");
const logger = require("../../logger")({ prefix: "ScalewayClient" });
const toString = (x) => JSON.stringify(x, null, 4);

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
  assert(config.secretKey);
  const { type } = spec;
  const findName = (item) => {
    assert(item);
    logger.debug(`findName: ${toString(item)}`);
    if (item.name) {
      return item.name;
    }
    const tagName = item.tags.find((tag) => tag.includes("name:"));
    if (tagName) {
      const name = tagName.replace("name:", "");
      logger.debug(`findName: is ${name}`);
      return name;
    } else {
      throw Error(`cannot find name in ${toString(item)}`);
    }
  };
  //TODO same getByName for everyone now ?
  const getByName = async ({ name }) => {
    logger.debug(`getByName: ${name}`);
    assert(name);
    const {
      data: { items },
    } = await core.list();
    assert(items);

    logger.debug(`getByName: ${name}, items: ${toString(items)}`);
    //TODO check with tag
    const instance = items.find((item) => core.toName(item).includes(name));
    logger.info(`getByName ${type}/${name}, out: ${toString(instance)}`);
  };

  const core = CoreClient({
    type: "scaleway",
    spec,
    onResponseList,
    toName,
    configDefault,
    getByName,
    findName,
    axios: AxiosMaker({
      baseURL: urljoin(BASE_URL, "zones", config.zone, url),
      onHeaders: () => ({ "X-Auth-Token": config.secretKey }),
    }),
  });

  return {
    spec,
    toId: core.toId,
    getById: core.getById,
    getByName,
    findName,
    isUp: core.isUp,
    create: core.create,
    destroy: core.destroy,
    list: core.list,
    configDefault: core.configDefault,
    toName: core.toName,
  };
};
