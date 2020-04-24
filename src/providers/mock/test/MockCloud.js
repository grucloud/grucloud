const _ = require("lodash");
const assert = require("assert");
const { v4: uuidv4 } = require("uuid");
const logger = require("logger")({ prefix: "MockCloud" });
const toString = (x) => JSON.stringify(x, null, 4);

module.exports = MockCloud = (initStates) => {
  //logger.debug(`MockCloud ${toString(initStates)}`);
  const states = initStates.map((state) => [
    state[0],
    new Map(_.cloneDeep(state[1])),
  ]);
  const resourceMap = new Map(states);
  const onGet = ({ type, name }) => {
    logger.info(`onGet ${toString({ type, name })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      return resource.get(name);
    } else {
      throw Error(`onGet cannot find ${toString({ type })}`);
    }
  };
  const onDestroy = async ({ type, name }) => {
    logger.info(`onDestroy ${toString({ type, name })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      if (!resource.has(name)) {
        logger.error(`onDestroy cannot find ${toString({ type, name })}`);
        return;
      }
      resource.delete(name);
    } else {
      throw Error(`onDestroy cannot find ${toString({ type })}`);
    }
  };
  const onDestroyAll = async ({ type }) => {
    logger.info(`onDestroyAll ${toString({ type })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      resource.clear();
    } else {
      throw Error(`onDestroyAll cannot find ${toString({ type })}`);
    }
  };
  const onList = async ({ type }) => {
    const resource = resourceMap.get(type);
    if (resource) {
      const result = { data: { items: [...resource.values()] } };
      logger.debug(`onList type: ${type}, result: ${toString(result)}`);
      return result;
    } else {
      throw Error(`onList cannot find ${toString({ type })}`);
    }
  };
  const onCreate = ({ type, name, payload }) => {
    logger.info(`onCreate ${toString({ type, name, payload })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      const newPayload = { id: uuidv4(), ...payload };
      //TODO check if already exist
      resource.set(name, newPayload);
    } else {
      throw Error(`onDestroyAll cannot find ${toString({ type })}`);
    }
  };

  const reset = () => {
    states.forEach((state) => resourceMap.set(state[0], state[1]));
  };

  return {
    onGet,
    onCreate,
    onDestroy,
    onDestroyAll,
    onList,
    reset,
  };
};
