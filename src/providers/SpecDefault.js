const _ = require("lodash");
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
  getByName: ({ name, items = [] }) => {
    logger.debug(`getByName: ${name}, items: ${toString(items)}`);
    const item = items.find((item) => item.name === name);
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
  configStatic: ({ config }) => config,
  configLive: ({ config }) => config,
  configDefault: ({ name, options }) => ({ name, ...options }),

  methods: {
    get: true,
    list: true,
    create: true,
    del: true,
  },
});
