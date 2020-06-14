const assert = require("assert");
const { pipe, tryCatch } = require("rubico");
const { head, tap } = require("ramda");
const logger = require("../../logger")({ prefix: "AwsCommon" });
const tos = (x) => JSON.stringify(x, null, 4);

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
    logger.error(`findNameInTags: cannot find name ${tos({ item })}`);
  }
};

exports.getByIdCore = ({ fieldIds, list }) =>
  tryCatch(
    pipe([
      tap(({ id }) => logger.debug(`getById ${fieldIds} ${id}`)),
      async ({ id }) => await list({ [fieldIds]: [id] }),
      ({ data: { items } }) => items,
      head,
      tap((item) => logger.debug(`getById  ${fieldIds} result: ${tos(item)}`)),
    ]),
    (error) => {
      logger.debug(`getById  ${fieldIds} no result: ${error.message}`);
    }
  );

exports.isUpByIdCore = ({ states, getStateName, getById }) => async ({
  id,
}) => {
  logger.debug(`isUpById ${id}`);
  assert(id);
  let up = false;
  const instance = await getById({ id });
  if (instance) {
    if (states) {
      assert(getStateName);
      up = states.includes(getStateName(instance));
    } else {
      up = true;
    }
  }
  logger.info(`isUpById ${id} ${up ? "UP" : "NOT UP"}`);
  return up;
};
