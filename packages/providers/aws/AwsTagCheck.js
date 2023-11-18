const assert = require("assert");
const { switchCase, eq, get, pipe, and } = require("rubico");
const { find } = require("rubico/x");
const logger = require("@grucloud/core/logger")({ prefix: "AwsTagCheck" });
const { tos } = require("@grucloud/core/tos");

exports.CheckAwsTags = ({ config, tags, name }) => {
  const {
    nameKey,
    managedByKey,
    managedByValue,
    stageTagKey,
    stage,
    createdByProviderKey,
    providerName,
  } = config;
  assert(tags);
  return switchCase([
    and([
      eq(
        pipe([find(eq(get("Key"), managedByKey)), get("Value")]),
        managedByValue
      ),
      //eq(pipe([find(eq(get("Key"), nameKey)), get("Value")]), name),
      eq(pipe([find(eq(get("Key"), stageTagKey)), get("Value")]), stage),
      eq(
        pipe([find(eq(get("Key"), createdByProviderKey)), get("Value")]),
        providerName
      ),
    ]),
    () => true,
    () => {
      logger.error(
        `CheckAwsTags: missing tags for resource ${name}, tags: ${tos(tags)}`
      );
      return false;
    },
  ])(tags);
};
