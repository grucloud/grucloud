const { v4: uuidv4 } = require("uuid");
const logger = require("logger")({ prefix: "MocCloud" });
const toJSON = (x) => JSON.stringify(x, null, 4);

const initStates = [
  [
    "Ip",
    new Map([
      [
        "36e1766f-9d5b-426f-bb82-c8db324c3fd9",
        {
          id: "36e1766f-9d5b-426f-bb82-c8db324c3fd9",
          address: "51.15.246.48",
          tags: ["myip"],
        },
      ],
    ]),
  ],
  ["Image", new Map([["1", { name: "Ubuntu", arch: "x86_64" }]])],
  ["Volume", new Map()],
  ["Server", new Map()],
];

module.exports = MockCloud = () => {
  const resourceMap = new Map(initStates);
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
    if (resource) {
      resource.delete(name);
    } else {
      throw Error(`onDestroy cannot find ${toJSON({ type })}`);
    }
  };
  const onDestroyAll = async ({ type }) => {
    logger.info(`onDestroyAll ${toJSON({ type })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      resource.clear();
    } else {
      throw Error(`onDestroyAll cannot find ${toJSON({ type })}`);
    }
  };
  const onList = async ({ type }) => {
    logger.info(`onList ${toJSON({ type })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      const result = { data: { items: [...resource.values()] } };
      logger.debug(`list type: ${type}, result: ${toJSON(result)}`);
      return result;
    } else {
      throw Error(`onList cannot find ${toJSON({ type })}`);
    }
  };
  const onCreate = ({ type, name, payload }) => {
    logger.info(`onCreate ${toJSON({ type, name, payload })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      const uuid = uuidv4();
      const newPayload = { uuid, ...payload };
      resource.set(name, newPayload);
    } else {
      throw new Error(`onCreate no ${type}`);
    }
  };

  return {
    onGet,
    onCreate,
    onDestroy,
    onDestroyAll,
    onList,
  };
};
