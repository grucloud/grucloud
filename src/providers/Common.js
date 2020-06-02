const assert = require("assert");
const logger = require("../logger")({ prefix: "Common" });
const toString = (x) => JSON.stringify(x, null, 4);

exports.isUpCore = async ({ name, getByName }) => {
  logger.info(`isUp name:${name}`);
  assert(name);
  assert(getByName);
  const up = !!(await getByName({ name }));
  logger.info(`isUp ${name} ${up ? "IS UP" : "NOT UP"}`);
  return up;
};

exports.isDownCore = async ({ id, name, getById }) => {
  logger.info(`isDown name: ${name} id: ${id}`);
  assert(id);
  assert(getById);
  const down = !(await getById({ id }));
  logger.info(`isDown ${name} ${down ? "IS DOWN" : "NOT DOWN"}`);
  return down;
};

exports.findField = ({ item, field }) => {
  assert(item);
  assert(field);
  logger.debug(`findName: ${toString(item)}`);

  if (item[field]) {
    return item[field];
  } else {
    logger.error(`findName: cannot find name in ${toString(item)}`);
    // throw Error(`cannot find name in ${toString(item)}`);
  }
};

exports.getByNameCore = async ({ name, findName, list }) => {
  logger.info(`getByName ${name}`);
  assert(name);
  assert(findName);
  assert(list);

  const {
    data: { items },
  } = await list();
  const instance = items.find((item) => findName(item) === name);
  logger.debug(`getByName ${name}: ${toString({ instance })}`);

  return instance;
};
exports.getByIdCore = async ({ id, findId, list }) => {
  logger.info(`getById ${id}`);
  assert(id);
  assert(findId);
  assert(list);

  const {
    data: { items },
  } = await list();
  const instance = items.find((item) => findId(item) === id);
  logger.debug(`getById ${id}: ${toString({ instance })}`);

  return instance;
};
