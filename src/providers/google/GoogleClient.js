const assert = require("assert");
const urljoin = require("url-join");
const CoreClient = require("../CoreClient");
const AxiosMaker = require("../AxiosMaker");
const BASE_URL = "https://compute.googleapis.com/compute/v1/";
const logger = require("../../logger")({ prefix: "GoogleClient" });
const toString = (x) => JSON.stringify(x, null, 4);

const onResponseList = (data) => {
  const { items = [] } = data;
  return { total: items.length, items };
};

module.exports = GoogleClient = ({
  url,
  spec,
  config,
  configDefault,
  toName,
}) => {
  assert(url);
  assert(spec);
  assert(spec.type);
  assert(config);
  const { type } = spec;
  const findName = (item) => {
    assert(item);
    logger.debug(`findName: ${toString(item)}`);

    if (item.name) {
      return item.name;
    } else {
      throw Error(`cannot find name in ${toString(item)}`);
    }
  };

  const getByName = async ({ name }) => {
    logger.info(`getByName ${type}/${name}`);
    assert(name);
    const {
      data: { items },
    } = await core.list();
    assert(items);
    const instance = items.find((item) => core.toName(item).includes(name));
    logger.info(`getByName ${type}/${name}, out: ${toString(instance)}`);
    return instance;
  };

  const core = CoreClient({
    type: "google",
    spec,
    onResponseList,
    configDefault,
    toName,
    getByName,
    findName,
    axios: AxiosMaker({
      baseURL: urljoin(BASE_URL, url),
      onHeaders: () => ({
        Authorization: `Bearer ${config.accessToken}`,
      }),
    }),
  });

  return {
    spec,
    // TODO spread core ?
    getById: core.getById,
    getByName: core.getByName,
    findName: core.findName,
    isUp: core.isUp,
    isDown: core.isDown,
    create: core.create,
    destroy: core.destroy,
    list: core.list,
    configDefault: core.configDefault,
    toName: core.toName,
  };
};
