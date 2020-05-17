const _ = require("lodash");
const toString = (x) => JSON.stringify(x, null, 4);
const assert = require("assert");
const logger = require("../logger")({ prefix: "SpecDefault" });
const compareObject = require("../Utils").compare;

const findName = (item) => {
  assert(item);
  logger.debug(`findName: ${toString(item)}`);

  if (item.name) {
    return item.name;
  } else {
    throw Error(`cannot find name in ${toString(item)}`);
  }
};

const getByName = ({ name, items }) => {
  assert(name);
  assert(items, "items");
  logger.debug(`getByName: ${name}, items: ${toString(items)}`);
  logger.debug(`getByName #items ${items.length}`);
  const item = items.find((item) => item.name.includes(name));
  logger.debug(`getByName: ${name}, returns: ${toString(item)}`);
  return item;
};

const compare = ({ target, live }) => {
  logger.debug(`compare default`);
  const diff = compareObject({
    target,
    targetKeys: Object.getOwnPropertyNames(target),
    live,
  });
  logger.debug(`compare ${toString(diff)}`);
  return diff;
};

const isUp = async ({ instance }) => {
  logger.debug(`isUp ${instance}`);
  assert(instance, "isUp instance");
  return !!instance;
};

exports.SpecDefault = () => ({
  toId: (item) => item.id,
  findName,
  getByName,
  isUp,
  compare,
  postConfig: ({ config }) => config,
  configStatic: () => ({}),
  configLive: async () => ({}),
  configDefault: ({ name, properties }) => ({ name, ...properties }),

  methods: {
    get: true,
    list: true,
    create: true,
    del: true,
  },
});
