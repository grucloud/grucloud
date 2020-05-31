const _ = require("lodash");
const toString = (x) => JSON.stringify(x, null, 4);
const assert = require("assert");
const logger = require("../logger")({ prefix: "SpecDefault" });
const compareObject = require("../Utils").compare;

exports.SpecDefault = () => ({
  compare: compareObject,
  //TODO move that to client ?
  methods: {
    get: true,
    list: true,
    create: true,
    del: true,
  },
});
