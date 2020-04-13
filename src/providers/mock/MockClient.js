const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const logger = require("logger")({ prefix: "MockClient" });

module.exports = MockClient = ({ options = {}, name }) => {
  const { initState } = options;
  const resourceMap = new Map(initState);
  //console.log("MockClient init ", name, [...resourceMap.values()]);
  const list = async () => {
    const result = { data: { items: [...resourceMap.values()] } };
    logger.debug(`list name: ${name}, ${JSON.stringify(result, null, 4)}`);
    return result;
  };

  const create = async (options) => {
    logger.debug(`create ${JSON.stringify(options, null, 4)}`);
    const uuid = uuidv4();
    const resource = { uuid, ...options };
    resourceMap.set(uuid, resource);
    return resource;
  };

  const get = async (name, options) => {
    const result = resourceMap.get(name);
    logger.debug(`get ${name} = ${JSON.stringify(result, null, 4)}`);
    return result;
  };

  const destroy = async (name) => {
    logger.debug(`destroy  ${name} `);

    resourceMap.delete(name);
  };

  const destroyAll = async () => {
    logger.debug(`destroyAll`);
    const all = await list();
    resourceMap.clear();
    return all;
  };

  return {
    options: {
      methods: {},
    },
    get,
    list,
    create,
    destroy,
    destroyAll,
    reset: () => resourceMap.clear(),
  };
};
