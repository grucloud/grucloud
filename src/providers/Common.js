const assert = require("assert");
const logger = require("../logger")({ prefix: "Common" });
const { tos } = require("../tos");

exports.findField = ({ item, field }) => {
  assert(item, "findField item");
  assert(field, "findField field");
  //logger.debug(`findName: ${tos(item)}`);
  const name = item[field];
  if (name) {
    logger.debug(`findField: ${name}`);
    return name;
  } else {
    logger.debug(`findFields: cannot find name in ${tos(item)}`);
  }
};

exports.getByNameCore = async ({ name, findName, getList }) => {
  logger.info(`getByName ${name}`);
  assert(name, "name");
  assert(findName, "findName");
  assert(getList, "getList");

  const { items } = await getList();
  const instance = items.find((item) => findName(item) === name);
  logger.debug(`getByName ${name}: ${tos({ instance })}`);

  return instance;
};
const getByIdCore = async ({ id, findId, getList }) => {
  logger.info(`getById ${id}`);
  assert(id, "getByIdCore id");
  assert(findId, "getByIdCore findId");
  assert(getList, "getByIdCore getList");

  const { items } = await getList();
  const instance = items.find((item) => findId(item) === id);
  logger.debug(`getById ${id}: ${tos({ instance })}`);

  return instance;
};

exports.getByIdCore = getByIdCore;

exports.isUpByIdCore = ({ states, getStateName, getById }) => async ({
  id,
}) => {
  logger.debug(`isUpById ${id}`);
  assert(id, "isUpByIdCore id");
  assert(getById, "isUpByIdCore getById");
  let up = false;
  const instance = await getById({ id });
  if (instance) {
    if (states) {
      assert(getStateName);
      up = states.includes(getStateName(instance));
    } else {
      up = true;
    }
  }
  logger.info(`isUpById ${id} ${up ? "UP" : "NOT UP"}`);
  return up;
};

exports.isDownByIdCore = ({
  states,
  getStateName,
  getById,
  getList,
  findId,
}) => async ({ id }) => {
  logger.debug(`isDownById ${id}`);
  assert(id, "isDownByIdCore id");
  assert(getById, "isDownByIdCore getById");

  let down = false;

  const theGet = getList ? getByIdCore : getById;
  const instance = await theGet({ id, getList, findId });
  if (instance) {
    if (states) {
      assert(getStateName, "getStateName");
      down = states.includes(getStateName(instance));
    }
  } else {
    down = true;
  }

  logger.info(`isDownById ${down} ${down ? "DOWN" : "NOT DOWN"}`);
  return down;
};

exports.logError = (prefix, error) => {
  logger.error(`${prefix} error:${error.toString()}`);
  if (error.response) {
    if (error.response.data) {
      logger.error(`data: ${tos(error.response.data)}`);
    }
    const { baseURL, url, method } = error.config;
    logger.error(`config: ${method} ${baseURL}${url}`);
  }
  //logger.error(`${prefix} stack:${error.stack}`);
};
