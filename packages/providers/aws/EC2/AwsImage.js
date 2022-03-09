const {
  get,
  map,
  switchCase,
  tryCatch,
  pipe,
  not,
  tap,
  eq,
  omit,
  assign,
} = require("rubico");
const { isEmpty, defaultsDeep, last, size, identity } = require("rubico/x");
const moment = require("moment");

const assert = require("assert");
const logger = require("@grucloud/core/logger")({ prefix: "AwsImage" });

const { tos } = require("@grucloud/core/tos");
const { findNameInTagsOrId, getByIdCore, buildTags } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { createEC2, tagResource, untagResource } = require("./EC2Common");

exports.AwsImage = ({ spec, config }) => {
  const ec2 = createEC2(config);
  const client = AwsClient({ spec, config })(ec2);

  const findId = get("live.ImageId");
  const findName = findNameInTagsOrId({ findId });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeImages-property
  const getList = ({ resources = [] } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList #image ${size(resources)}`);
      }),
      () => resources,
      map(
        tryCatch(
          pipe([
            tap((resource) => {
              logger.info(`getList image name ${resource.name}`);
            }),
            getByName,
          ]),
          (error, resource) =>
            pipe([
              tap(() => {
                logger.error(`getList ${error}`);
              }),
              (error) => ({ error, resource: resource.toJSON() }),
            ])
        )
      ),
      tap((items) => {
        logger.info(`getList #image ${size(resources)}`);
      }),
    ])();

  const getByName = ({ name, properties }) =>
    pipe([
      tap(() => {
        logger.info(`getByName image ${name}`);
      }),
      () => properties(),
      tap((params) => {
        logger.info(`getByName image params ${JSON.stringify({ params })}`);
      }),
      ec2().describeImages,
      get("Images"),
      tap((items) => {
        logger.debug(`getByName #image: ${size(items)}`);
      }),
      (items) =>
        items.sort((a, b) =>
          switchCase([
            () => moment(a.CreationDate).isAfter(b.CreationDate),
            () => 1,
            () => -1,
          ])()
        ),
      last,
      switchCase([
        isEmpty,
        identity,
        assign({ Tags: () => buildTags({ name, config }) }),
      ]),
      tap((image) => {
        logger.debug(`getByName image: ${tos(image)}`);
      }),
      ,
    ])();

  const getById = getByIdCore({ fieldIds: "ImageIds", getList });

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({})(properties);

  return {
    spec,
    findId,
    getByName,
    getById,
    findName,
    getList,
    configDefault,
    cannotBeDeleted: () => true,
    tagResource: tagResource({ ec2 }),
    untagResource: untagResource({ ec2 }),
  };
};
