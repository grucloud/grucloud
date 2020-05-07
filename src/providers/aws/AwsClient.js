const assert = require("assert");
const toString = (x) => JSON.stringify(x, null, 4);

module.exports = AwsClient = ({ config }) => {
  const getById = async ({ id }) => {
    logger.debug(`get ${toString({ id })}`);
    assert(false, "TODO");
  };

  const getByName = async ({ name }) => {
    logger.info(`getByName ${type}/${name}`);
    assert(false, "TODO");
  };

  const create = async ({ name, payload }) => {
    logger.debug(`create ${name}, payload: ${toString(payload)}`);
    assert(false, "TODO");
  };

  const list = async () => {
    logger.debug(`list type ${type}`);
    assert(false, "TODO");
  };

  const destroy = async ({ id, name }) => {
    logger.debug(`destroy ${toString({ name, id })}`);
    if (_.isEmpty(id)) {
      throw Error(`destroy invalid id`);
    }
    assert(false, "TODO");
  };

  return {
    getById,
    getByName,
    create,
    destroy,
    list,
  };
};
