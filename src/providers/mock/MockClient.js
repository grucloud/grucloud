const _ = require("lodash");
const { v4: uuidv4 } = require("uuid");
const logger = require("logger")({ prefix: "MockClient" });

const clientsMap = new Map();

module.exports = MockClient = ({ options = {}, config }) => {
  const { initState, name } = options;
  const resourceMap = new Map(initState);
  logger.error(`MockClient init ", ${name}, ${[...resourceMap.values()]}`);
  const list = async () => {
    const result = { data: { items: [...resourceMap.values()] } };
    logger.debug(`list type: ${name}, ${JSON.stringify(result, null, 4)}`);
    return result;
  };

  const create = async (options) => {
    logger.debug(
      `create type: ${name}, #items: ${resourceMap.size}, ${JSON.stringify(
        options,
        null,
        4
      )}`
    );
    const uuid = uuidv4();
    const resource = { uuid, ...options };
    resourceMap.set(uuid, resource);
    return resource;
  };

  const get = async (name, options) => {
    const result = resourceMap.get(name);
    logger.debug(
      `get type: ${options.name}, #items: ${
        resourceMap.size
      }, ${name} = ${JSON.stringify(result, null, 4)}`
    );
    return result;
  };

  const destroy = async (name) => {
    logger.debug(`destroy type: ${name}, name: ${name} `);
    resourceMap.delete(name);
  };

  const destroyAll = async () => {
    logger.debug(`destroyAll,  type: ${name}`);
    const all = await list();
    resourceMap.clear();
    return all;
  };

  return {
    options,
    get,
    list,
    create,
    destroy,
    destroyAll,
    reset: () => resourceMap.clear(),
  };
};
