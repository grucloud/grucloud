const assert = require("assert");
const { pipe, tryCatch, tap } = require("rubico");
const first = require("rubico/x/first");
const logger = require("../../logger")({ prefix: "Aws" });
const { tos } = require("../../tos");

const KeyName = "Name";
exports.KeyName = KeyName;

exports.findNameInTags = (item) => {
  assert(item);
  assert(item.Tags);
  const tag = item.Tags.find((tag) => tag.Key === KeyName);
  if (tag?.Value) {
    logger.debug(`findNameInTags ${tag.Value}`);
    return tag.Value;
  } else {
    logger.debug(`findNameInTags: cannot find name`);
  }
};

exports.getByIdCore = ({ fieldIds, getList }) =>
  tryCatch(
    pipe([
      tap(({ id }) => logger.debug(`getById ${fieldIds} ${id}`)),
      async ({ id }) => await getList({ params: { [fieldIds]: [id] } }),
      ({ items }) => items,
      first,
      tap((item) => logger.debug(`getById  ${fieldIds} result: ${tos(item)}`)),
    ]),
    (error) => {
      logger.debug(`getById  ${fieldIds} no result: ${error.message}`);
    }
  );
