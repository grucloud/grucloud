const { map, transform } = require("rubico");
const { copyDeep } = require("rubico/monad/Struct");
const { defaultsDeep } = require("rubico/x");
const assert = require("assert");
const { v4: uuidv4 } = require("uuid");
const logger = require("../../logger")({ prefix: "MockCloud" });
const { tos } = require("../../tos");
const mockCloudInitStatesDefault = [
  [
    "Ip",
    [
      [
        "51.15.246.48",
        {
          id: "47FF72A9-0665-4EA8-A7D2-9EAA3D749213",
          name: "ip1",
          address: "51.15.246.48",
        },
      ],
      [
        "51.15.246.50",
        {
          id: "57890757-7E7C-4E35-A9B5-201FE1FBD2E0",
          name: "ip2",
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
  ["Volume", [["1", { id: "1", name: "volume" }]]],
  ["SecurityGroup"],
  ["Server", [["1", { id: "1", name: "myserver" }]]],
];

module.exports = MockCloud = (initStates = []) => {
  logger.debug(`MockCloud ${tos(initStates)}`);
  initStates = defaultsDeep(mockCloudInitStatesDefault)(initStates);
  const states = transform(
    map((state) => [state[0], new Map(copyDeep(state[1] || []))]),
    () => []
  )(initStates);
  const resourceMap = new Map(states);
  const resourceNameMap = new Map();

  const onGet = ({ type, id }) => {
    logger.info(`onGet ${tos({ type, id })}`);
    const resource = resourceMap.get(type);
    if (resource) {
      if (!resource.has(id)) {
        throw Error(`onGetCannot find ${tos({ type, id })}`);
      }
      const item = resource.get(id);
      logger.info(`onGet ${tos({ item })}`);
      return item;
    } else {
      throw Error(`onGet cannot find type ${tos({ type })}`);
    }
  };
  const onDestroy = async ({ type, id }) => {
    logger.info(`onDestroy ${tos({ type, id })}`);

    const resource = resourceMap.get(type);
    if (resource) {
      if (!resource.has(id)) {
        logger.error(`onDestroy cannot find ${tos({ type, id })}`);
        return;
      }
      const { name } = resource.get(id);
      assert(name);
      if (name) {
        resourceNameMap.delete(name);
      }
      assert(name);
      resource.delete(id);
      logger.info(`onDestroy #remaining ${resource.size}`);
    } else {
      throw Error(`onDestroy cannot find ${tos({ type })}`);
    }
  };

  const onList = ({ type }) => {
    const resource = resourceMap.get(type);
    if (resource) {
      const items = [...resource.values()];
      const result = { total: items.length, items };
      logger.debug(`onList type: ${type}, result: ${tos(result)}`);
      return result;
    } else {
      throw Error(`onList cannot find ${tos({ type })}`);
    }
  };
  const onCreate = ({ type, payload }) => {
    logger.info(`onCreate ${tos({ type, payload })}`);
    const resource = resourceMap.get(type);
    const { name } = payload;
    assert(name);

    if (resource) {
      const id = uuidv4();
      const newPayload = { id, ...payload };
      if (resourceNameMap.has(name)) {
        throw Error(`${name} already created`);
      } else {
        resourceNameMap.set(name, newPayload);
      }

      resource.set(id, newPayload);
      return newPayload;
    } else {
      throw Error(`onDestroyAll cannot find ${tos({ type })}`);
    }
  };

  return {
    onGet,
    onCreate,
    onDestroy,
    //onDestroyAll,
    onList,
    //reset,
  };
};
