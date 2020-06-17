const _ = require("lodash");
const assert = require("assert");
const logger = require("../logger")({ prefix: "SpecDefault" });
const { compare } = require("../Utils");

exports.SpecDefault = () => ({
  compare,
  //TODO move that to client ?
  methods: {
    get: true,
    list: true,
    create: true,
    del: true,
  },
});
