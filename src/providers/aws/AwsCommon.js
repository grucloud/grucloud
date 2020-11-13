const assert = require("assert");
const { pipe, tryCatch, tap, switchCase } = require("rubico");
const first = require("rubico/x/first");
const logger = require("../../logger")({ prefix: "Aws" });
const { tos } = require("../../tos");

const KeyName = "Name";
exports.KeyName = KeyName;

exports.buildTags = ({
  name,
  config: { managedByKey, managedByValue, stageTagKey, stage },
}) => [
  {
    Key: KeyName,
    Value: name,
  },
  {
    Key: managedByKey,
    Value: managedByValue,
  },
  {
    Key: stageTagKey,
    Value: stage,
  },
];

exports.isOurMinion = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(resource);
  assert(resource.Tags);

  let minion = false;
  if (
    resource.Tags.find(
      (tag) => tag.Key === managedByKey && tag.Value === managedByValue
    )
  ) {
    minion = true;
  }

  logger.debug(
    `isOurMinion ${tos({
      minion,
      resource,
    })}`
  );
  return minion;
};

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

exports.findNameInDescription = ({ Description = "" }) => {
  const tags = Description.split("tags:")[1];
  if (tags) {
    try {
      const tagsJson = JSON.parse(tags);
      const tag = tagsJson.find((tag) => tag.Key === KeyName);
      if (tag?.Value) {
        logger.debug(`findNameInDescription ${tag.Value}`);
        return tag.Value;
      }
    } catch (error) {
      logger.error(`findNameInDescription ${error}`);
    }
  }
  logger.debug(`findNameInDescription: cannot find name`);
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
