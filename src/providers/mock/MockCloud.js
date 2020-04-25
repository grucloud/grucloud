const _ = require("lodash");
const assert = require("assert");
const { v4: uuidv4 } = require("uuid");
const logger = require("logger")({ prefix: "MockCloud" });
const toString = (x) => JSON.stringify(x, null, 4);

const mockCloudInitStatesDefault = [
  [
    "Ip",
    [
      [
        "51.15.246.48",
        {
          address: "51.15.246.48",
        },
      ],
      [
        "51.15.246.50",
        {
          address: "51.15.246.50",
        },
      ],
    ],
  ],
  [
    "Image",
    [
      ["1", { name: "Ubuntu", arch: "x86_64" }],
      ["2", { name: "CentOS", arch: "x86_64" }],
    ],
  ],
  ["Volume"],
  ["Server"],
];

module.exports = MockCloud = (initStates = []) => {
  logger.debug(`MockCloud ${toString(initStates)}`);
  initStates = _.defaults(initStates, mockCloudInitStatesDefault);
  const states = initStates.map((state) => [
    state[0],
    new Map(_.cloneDeep(state[1])),
  ]);
  const resourceMap = new Map(states);
  const onGet = ({ type, id }) => {
    logger.info(`onGet ${toString({ type, id })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      if (!resource.has(id)) {
        throw Error(`onGetCannot find ${toString({ type, id })}`);
      }
      const item = resource.get(id);
      logger.info(`onGet ${toString({ item })}`);
      return item;
    } else {
      throw Error(`onGet cannot find type ${toString({ type })}`);
    }
  };
  const onDestroy = async ({ type, id }) => {
    logger.info(`onDestroy ${toString({ type, id })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      if (!resource.has(id)) {
        logger.error(`onDestroy cannot find ${toString({ type, id })}`);
        return;
      }
      resource.delete(id);
      logger.info(`onDestroy #remaining ${resource.size}`);
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
  const onList = ({ type }) => {
    const resource = resourceMap.get(type);
    if (resource) {
      const items = [...resource.values()];
      const result = { total: items.length, items };
      logger.debug(`onList type: ${type}, result: ${toString(result)}`);
      return result;
    } else {
      throw Error(`onList cannot find ${toString({ type })}`);
    }
  };
  const onCreate = ({ type, payload }) => {
    logger.info(`onCreate ${toString({ type, payload })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      const id = uuidv4();
      const newPayload = { id, ...payload };
      //TODO check if already exist
      resource.set(id, newPayload);
      return newPayload;
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
