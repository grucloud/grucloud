const _ = require("lodash");
const assert = require("assert");
const logger = require("../logger")({ prefix: "SpecDefault" });
const { compare } = require("../Utils");

exports.SpecDefault = () => ({
  compare,
  listOnly: false,
});
