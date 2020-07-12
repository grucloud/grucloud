const AWS = require("aws-sdk");
const { defaultsDeep, unionWith, isEqual } = require("lodash/fp");
const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsS3" });
const { retryExpectOk } = require("../Retry");
const { tos } = require("../../tos");
const { map } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html

const listBucketPoolSize = 5;

module.exports = AwsS3 = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const { managedByKey, managedByValue, stageTagKey, stage } = config;
  assert(stage);

  const s3 = new AWS.S3();

  const findName = (item) => {
    assert(item);
    return item.Name;
  };

  const findId = (item) => findName(item);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listBuckets-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  const getList = async () => {
    logger.debug(`getList s3`);
    const { Buckets } = await s3.listBuckets().promise();
    logger.debug(`getList s3 ${tos(Buckets)}`);
    const fullBuckets = await map.pool(listBucketPoolSize, async (bucket) => ({
      ...bucket,
      ...(await getByName({ name: bucket.Name })),
    }))(Buckets);

    return {
      total: Buckets.length,
      items: fullBuckets,
    };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property

  const getByName = async ({ name }) => {
    logger.debug(`getByName s3 ${name}`);

    const params = { Bucket: name };

    if (!(await isUpById({ id: name }))) {
      logger.debug(`getByName s3 cannot find: ${name}`);

      return;
    }

    const { LocationConstraint } = await s3.getBucketLocation(params).promise();
    logger.debug(
      `getByName s3 ${name} LocationConstraint ${LocationConstraint}`
    );
    //docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketTagging-property

    const { TagSet } = await s3.getBucketTagging(params).promise();
    logger.debug(`getByName s3 ${name} tags: ${tos(TagSet)}`);

    const PolicyStatus = await new Promise((resolve, reject) =>
      s3.getBucketPolicyStatus(params, function (err, data) {
        if (err) {
          if (err.code === "NoSuchBucketPolicy") {
            logger.debug(`getBucketPolicyStatus ${name}: ${err.code}`);
            resolve();
          } else {
            logger.error(`getBucketPolicyStatus ${name}, error ${tos(err)}`);
            reject(err);
          }
        } else {
          logger.debug(`getBucketPolicyStatus ${name}: done ${tos(data)}`);
          resolve(data);
        }
      })
    );

    const { Grants, Owner } = await s3.getBucketAcl(params).promise();
    return { Acl: { Grants, Owner }, PolicyStatus, LocationConstraint, TagSet };
  };

  const getById = async ({ id }) => await getByName({ name: id });

  const headBucket = async ({ id }) => {
    try {
      await s3.headBucket({ Bucket: id }).promise();
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      throw error;
    }
  };

  const isUpById = async ({ id }) => {
    logger.debug(`isUpById ${id}`);
    return await headBucket({ id });
  };

  const isDownById = async ({ id }) => {
    logger.debug(`isDownById ${id}`);
    return !(await headBucket({ id }));
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const create = async ({ name, payload }) => {
    assert(name);
    assert(payload);

    const { Tagging, ...otherProperties } = payload;
    logger.debug(`create s3 bucket ${tos({ name, payload })}`);

    const managementTags = [
      {
        Key: managedByKey,
        Value: managedByValue,
      },
      {
        Key: stageTagKey,
        Value: stage,
      },
    ];

    const paramsTag = {
      Bucket: name,
      Tagging: { TagSet: unionWith(Tagging?.TagSet, managementTags, isEqual) },
    };

    const { Location } = await s3.createBucket(otherProperties).promise();
    logger.debug(`create result ${tos(Location)}`);

    const params = {
      Bucket: name,
    };

    await retryExpectOk({
      name: `s3 isUpById: ${name}`,
      fn: () => isUpById({ id: name }),
      config,
    });
    //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketTagging-property

    await s3.putBucketTagging(paramsTag).promise();

    return { Location };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucketPolicy-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucketTagging-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucketWebsite-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy s3 bucket ${tos({ name, id })}`);
    assert(id, `destroy invalid s3 id`);

    const params = {
      Bucket: id,
    };

    const result = await s3.deleteBucket(params).promise();
    logger.debug(`destroy s3 in progress, ${tos({ name, id })}`);

    await retryExpectOk({
      name: `isDownById: ${name} id: ${id}`,
      fn: () => isDownById({ id }),
      config,
    });

    logger.debug(`destroy s3 done, ${tos({ name, id, result })}`);
    return result;
  };

  const configDefault = async ({ name, properties }) => {
    logger.debug(`configDefault ${tos({ name, properties })}`);
    const { ...otherProperties } = properties;
    return defaultsDeep({ Bucket: name }, otherProperties);
  };

  return {
    type: "S3",
    spec,
    s3,
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
