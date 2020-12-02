const logger = require("../logger")({ prefix: "SpecDefault" });
const { detailedDiff } = require("deep-object-diff");

exports.SpecDefault = ({ providerName }) => ({
  compare: detailedDiff,
  providerName,
  listOnly: false,
  propertiesDefault: {},
});
