const assert = require("assert");
const logger = require("../logger")({ prefix: "Common" });
const toString = (x) => JSON.stringify(x, null, 4);

exports.findNameCore = ({ item, field }) => {
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
  const {
    data: { items },
  } = await list();
  const instance = items.find((item) => findName(item) === name);
  logger.debug(`getByName ${name}: ${toString({ instance })}`);

  return instance;
};
