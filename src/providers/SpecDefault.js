const logger = require("../logger")({ prefix: "SpecDefault" });
const { compare } = require("../Utils");

exports.SpecDefault = ({ providerName }) => ({
  compare,
  providerName,
  listOnly: false,
  propertiesDefault: {},
});
