const assert = require("assert");
const { v4: uuidv4 } = require("uuid");
const logger = require("logger")({ prefix: "MocCloud" });
const toJSON = (x) => JSON.stringify(x, null, 4);

module.exports = MockCloud = (initStates) => {
  const defaultInitStates = [
    [
      "Ip",
      new Map([
        [
          "51.15.246.48",
          {
            address: "51.15.246.48",
          },
        ],
      ]),
    ],
    ["Image", new Map([["1", { name: "Ubuntu", arch: "x86_64" }]])],
    ["Volume", new Map()],
    ["Server", new Map()],
  ];

  const resourceMap = new Map(initStates || defaultInitStates);
  const onGet = ({ type, name }) => {
    logger.info(`onGet ${toJSON({ type, name })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      return resource.get(name);
    } else {
      throw Error(`onGet cannot find ${toJSON({ type })}`);
    }
  };
  const onDestroy = async ({ type, name }) => {
    logger.info(`onDestroy ${toJSON({ type, name })}`);
    const resource = resourceMap.get(type);
    assert(resource);
    if (!resource.has(name)) {
      logger.error(`onDestroy cannot find ${toJSON({ type, name })}`);
      return;
    }
    resource.delete(name);
  };
  const onDestroyAll = async ({ type }) => {
    logger.info(`onDestroyAll ${toJSON({ type })}`);
    const resource = resourceMap.get(type);
    assert(resource);
    resource.clear();
  };
  const onList = async ({ type }) => {
    const resource = resourceMap.get(type);
    assert(resource, `no ${type}`);
    const result = { data: { items: [...resource.values()] } };
    logger.debug(`onList type: ${type}, result: ${toJSON(result)}`);
    return result;
  };
  const onCreate = ({ type, name, payload }) => {
    logger.info(`onCreate ${toJSON({ type, name, payload })}`);
    const resource = resourceMap.get(type);
    assert(resource);
    const newPayload = { id: uuidv4(), ...payload };
    //TODO check if already exist
    resource.set(name, newPayload);
  };

  const reset = () => {
    initStates.forEach((initState) =>
      resourceMap.set(initState[0], initState[1])
    );
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
