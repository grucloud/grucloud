const _ = require("lodash");
const assert = require("assert");
const logger = require("../logger")({ prefix: "SpecDefault" });
const compare = require("../Utils").compare;

exports.SpecDefault = () => ({
  toId: (item) => item.id,
  findName: (item) => {
    if (item.name) {
      return item.name;
    } else {
      throw Error(`cannot find name in ${toString(item)}`);
    }
  },
  getByName: ({ name, items }) => {
    assert(name);
    assert(items);
    logger.debug(`getByName: ${name}, items: ${toString(items)}`);
    logger.debug(`getByName #items ${items.length}`);

    const item = items.find((item) => item.name.includes(name));
    logger.debug(`getByName: ${name}, returns: ${toString(item)}`);
    return item;
  },
  compare: ({ target, live }) => {
    logger.debug(`compare default`);
    const diff = compare({
      target,
      targetKeys: Object.getOwnPropertyNames(target),
      live,
    });

    logger.debug(`compare ${toString(diff)}`);
    return diff;
  },

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
