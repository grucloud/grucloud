const AWS = require("aws-sdk");
const { defaultsDeep, unionWith, isEqual, isEmpty } = require("lodash/fp");
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
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 4 };
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
    logger.debug(`getList`);
    const { Buckets } = await s3.listBuckets().promise();
    //logger.debug(`getList ${tos(Buckets)}`);
    const fullBuckets = await map.pool(listBucketPoolSize, async (bucket) => ({
      ...bucket,
      ...(await getByName({ name: bucket.Name })),
    }))(Buckets);
    logger.debug(`getList full ${tos(fullBuckets)}`);

    return {
      total: Buckets.length,
      items: fullBuckets,
    };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property

  const getByName = async ({ name }) => {
    logger.debug(`getByName ${name}`);

    const params = { Bucket: name };

    if (!(await isUpById({ id: name }))) {
      logger.debug(`getByName cannot find: ${name}`);
      return;
    }

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLocation-property
    const { LocationConstraint } = await s3.getBucketLocation(params).promise();

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketTagging-property
    const TagSet = await new Promise((resolve, reject) =>
      s3.getBucketTagging(params, function (err, data) {
        if (err) {
          if (err.code === "NoSuchTagSet") {
            resolve();
          } else {
            logger.error(`getBucketTagging ${name}, error ${tos(err)}`);
            reject(err);
          }
        } else {
          //logger.debug(`getBucketTagging ${name}: done ${tos(data.TagSet)}`);
          resolve(data.TagSet);
        }
      })
    );

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicyStatus-property
    const PolicyStatus = await new Promise((resolve, reject) =>
      s3.getBucketPolicyStatus(params, function (err, data) {
        if (err) {
          if (err.code === "NoSuchBucketPolicy") {
            resolve();
          } else {
            logger.error(`getBucketPolicyStatus ${name}, error ${tos(err)}`);
            reject(err);
          }
        } else {
          //logger.debug(`getBucketPolicyStatus ${name}: done ${tos(data)}`);
          resolve(data);
        }
      })
    );

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketVersioning-property
    const VersioningConfiguration = await new Promise((resolve, reject) =>
      s3.getBucketVersioning(params, function (err, data) {
        if (err) {
          logger.error(`getBucketVersioning ${name}, error ${tos(err)}`);
          reject(err);
        } else {
          resolve(isEmpty(data) ? undefined : data);
        }
      })
    );
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAcl-property
    const { Grants, Owner } = await s3.getBucketAcl(params).promise();

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketWebsite-property
    const WebsiteConfiguration = await new Promise((resolve, reject) =>
      s3.getBucketWebsite(params, function (err, data) {
        if (err) {
          if (err.code === "NoSuchWebsiteConfiguration") {
            resolve();
          } else {
            logger.error(`getBucketWebsite ${name}, error ${tos(err)}`);
            reject(err);
          }
        } else {
          resolve(data);
        }
      })
    );

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketCors-property
    const CORSConfiguration = await new Promise((resolve, reject) =>
      s3.getBucketCors(params, function (err, data) {
        if (err) {
          if (err.code === "NoSuchCORSConfiguration") {
            resolve();
          } else {
            logger.error(`getBucketWebsite ${name}, error ${tos(err)}`);
            reject(err);
          }
        } else {
          resolve(data);
        }
      })
    );

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLogging-property
    const BucketLoggingStatus = await new Promise((resolve, reject) =>
      s3.getBucketLogging(params, function (err, data) {
        if (err) {
          logger.error(`getBucketLogging ${name}, error ${tos(err)}`);
          reject(err);
        } else {
          resolve(isEmpty(data) ? undefined : data);
        }
      })
    );
    // Result
    const s3Bucket = {
      Acl: { Grants, Owner },
      PolicyStatus,
      LocationConstraint,
      TagSet,
      VersioningConfiguration,
      WebsiteConfiguration,
      CORSConfiguration,
      BucketLoggingStatus,
    };
    logger.debug(`getByName ${name}: ${tos(s3Bucket)}`);

    return s3Bucket;
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
      logger.error(`headBucket`);
      logger.error(error);

      throw error;
    }
  };

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

    const {
      Tagging,
      VersioningConfiguration,
      WebsiteConfiguration,
      CORSConfiguration,
      BucketLoggingStatus,
      ...otherProperties
    } = payload;
    logger.debug(`create bucket ${tos({ name, payload })}`);

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

    await retryExpectOk({
      name: `s3 isUpById: ${name}`,
      fn: () => isUpById({ id: name }),
      config: clientConfig,
    });

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketTagging-property
    // TODO check if tags correctly
    await s3.putBucketTagging(paramsTag).promise();

    try {
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketVersioning-property
      if (VersioningConfiguration) {
        await s3
          .putBucketVersioning({ Bucket: name, VersioningConfiguration })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property
      if (WebsiteConfiguration) {
        await s3
          .putBucketWebsite({ Bucket: name, WebsiteConfiguration })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property
      if (CORSConfiguration) {
        await s3.putBucketCors({ Bucket: name, CORSConfiguration }).promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLogging-property
      if (BucketLoggingStatus) {
        await s3
          .putBucketLogging({ Bucket: name, BucketLoggingStatus })
          .promise();
      }
    } catch (error) {
      logger.error(error);
      await destroy({ id: name, name });
      throw error;
    }
    return { Location };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
  const destroy = async ({ id, name }) => {
    logger.debug(`destroy bucket ${tos({ name, id })}`);
    assert(id, `destroy invalid s3 id`);

    const params = {
      Bucket: id,
    };

    const result = await s3.deleteBucket(params).promise();
    logger.debug(`destroy in progress, ${tos({ name, id })}`);

    await retryExpectOk({
      name: `isDownById: ${name} id: ${id}`,
      fn: () => isDownById({ id }),
      config,
    });

    logger.debug(`destroy done, ${tos({ name, id, result })}`);
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
