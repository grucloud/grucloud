const assert = require("assert");
const logger = require("../../logger")({ prefix: "GoogleCommon" });
const { tos } = require("../../tos");

exports.buildLabel = ({
  managedByKey,
  stageTagKey,
  managedByValue,
  stage,
}) => ({
  [managedByKey]: managedByValue,
  [stageTagKey]: stage,
});
