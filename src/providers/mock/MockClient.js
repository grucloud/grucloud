const _ = require("lodash");
const logger = require("logger")({ prefix: "MockClient" });
const toJSON = (x) => JSON.stringify(x, null, 4);

module.exports = MockClient = ({ spec, config }) => {
  const { type } = spec;
  logger.debug(`MockClient init ${type}, ${JSON.stringify(config)}`);

  const list = async () => {
    return config.onList({ type });
  };

  const create = async ({ name, payload }) => {
    return config.onCreate({ type, name, payload });
  };

  const get = async (name, options) => {
    return config.onGet({ type, name, options });
  };

  const destroy = async (name) => {
    return config.onDestroy({ type, name });
  };

  const destroyAll = async () => {
    return config.onDestroyAll({ type });
  };

  return {
    spec,
    type: "mockClient",
    get,
    list,
    create,
    destroy,
    destroyAll,
  };
};
