const assert = require("assert");
const { pipe, tryCatch, tap, switchCase, and } = require("rubico");
const { first, find } = require("rubico/x");
const logger = require("../../logger")({ prefix: "Aws" });
const { tos } = require("../../tos");

const KeyName = "Name";
exports.KeyName = KeyName;

exports.buildTags = ({
  name,
  config: {
    managedByKey,
    managedByValue,
    stageTagKey,
    createdByProviderKey,
    stage,
    providerName,
  },
}) => {
  assert(name);
  assert(providerName);
  assert(stage);
  return [
    {
      Key: KeyName,
      Value: name,
    },
    {
      Key: managedByKey,
      Value: managedByValue,
    },
    {
      Key: createdByProviderKey,
      Value: providerName,
    },
    {
      Key: stageTagKey,
      Value: stage,
    },
  ];
};

exports.isOurMinion = ({ resource, config }) => {
  const { createdByProviderKey, providerName, stageTagKey, stage } = config;
  return pipe([
    tap(() => {
      assert(providerName);
      assert(createdByProviderKey);
      assert(resource);
      assert(stage);
    }),
    switchCase([
      and([
        find(
          (tag) =>
            tag.Key === createdByProviderKey && tag.Value === providerName
        ),
        find((tag) => tag.Key === stageTagKey && tag.Value === stage),
      ]),
      () => true,
      () => false,
    ]),
    tap((minion) => {
      logger.debug(`isOurMinion ${minion} ${tos(resource)}`);
    }),
  ])(resource.Tags || []);
};

exports.findNameInTags = (item) => {
  assert(item);
  assert(Array.isArray(item.Tags), `no Tags array in ${tos(item)}`);
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
