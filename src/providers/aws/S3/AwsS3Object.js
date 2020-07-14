const AWS = require("aws-sdk");
const { defaultsDeep, unionWith, isEqual, isEmpty } = require("lodash/fp");
const assert = require("assert");
const logger = require("../../../logger")({ prefix: "AwsS3" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const { map } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

exports.AwsS3Object = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 4 };
  const { managedByKey, managedByValue, stageTagKey, stage } = config;
  assert(stage);

  const s3 = new AWS.S3();

  const findName = (item) => {
    assert(item);
    return item.Name;
  };

  const findId = (item) => findName(item);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  const getList = async () => {
    logger.debug(`listObjects`);
    //TODO name
    const { Contents } = await s3.listObjects({ Bucket: "" }).promise();

    logger.debug(`listObjects ${tos(Contents)}`);

    return {
      total: Contents.length,
      items: Contents,
    };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property

  const getByName = async ({ name }) => {
    logger.debug(`getByName ${name}`);

    const params = { Bucket: name };

    logger.debug(`getByName ${name}: ${tos({})}`);

    return {};
  };

  const getById = async ({ id }) => await getByName({ name: id });

  const isUpById = async ({ id }) => {
    const up = await headBucket({ id });
    logger.debug(`isUpById ${id} ${up ? "UP" : "DOWN"}`);
    return up;
  };

  const isDownById = async ({ id }) => {
    const up = await headBucket({ id });
    logger.debug(`isDownById ${id} ${up ? "UP" : "DOWN"}`);
    return !up;
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);

    logger.debug(`create object ${tos({ name, payload })}`);

    return {};
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy bucket ${tos({ name, id })}`);
    assert(id, `destroy invalid object id`);
    return;
  };

  const configDefault = async ({ name, properties }) => {
    logger.debug(`configDefault ${tos({ name, properties })}`);
    const { ...otherProperties } = properties;
    return defaultsDeep({ Bucket: name }, otherProperties);
  };

  return {
    type: "S3Object",
    spec,
    s3,
    config: clientConfig,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
    cannotBeDeleted: () => false,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
