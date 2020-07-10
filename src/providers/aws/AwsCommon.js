const assert = require("assert");
const { pipe, tryCatch } = require("rubico");
const { head, tap } = require("ramda");
const logger = require("../../logger")({ prefix: "AwsCommon" });
const { tos } = require("../../tos");
const { logError } = require("../Common");

const KeyName = "Name";
exports.KeyName = KeyName;

exports.findNameInTags = (item) => {
  assert(item);
  assert(item.Tags);
  const tag = item.Tags.find((tag) => tag.Key === KeyName);
  if (tag?.Value) {
    logger.debug(`findNameInTags ${tos({ name: tag.Value, item })}`);
    return tag.Value;
  } else {
    logger.debug(`findNameInTags: cannot find name ${tos({ item })}`);
  }
};

exports.getByIdCore = ({ fieldIds, getList }) =>
  tryCatch(
    pipe([
      tap(({ id }) => logger.debug(`getById ${fieldIds} ${id}`)),
      async ({ id }) => await getList({ [fieldIds]: [id] }),
      ({ items }) => items,
      head,
      tap((item) => logger.debug(`getById  ${fieldIds} result: ${tos(item)}`)),
    ]),
    (error) => {
      logger.debug(`getById  ${fieldIds} no result: ${error.message}`);
    }
  );
