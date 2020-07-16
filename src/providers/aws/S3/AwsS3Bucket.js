const AWS = require("aws-sdk");
const {
  defaultsDeep,
  unionWith,
  isEqual,
  isEmpty,
  flatten,
} = require("lodash/fp");
const assert = require("assert");
const logger = require("../../../logger")({ prefix: "S3Bucket" });
const { retryExpectOk } = require("../../Retry");
const { tos } = require("../../../tos");
const {
  map,
  tap,
  pipe,
  switchCase,
  fork,
  get,
  pick,
  all,
  tryCatch,
} = require("rubico");
const { mapPoolSize } = require("../AwsCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
assert(flatten);
exports.AwsS3Bucket = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 7 };
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
    const fullBuckets = await map.pool(
      mapPoolSize,
      async (bucket) => {
        try {
          return {
            ...bucket,
            ...(await getByName({ name: bucket.Name })),
          };
        } catch (error) {
          return {
            ...bucket,
            error,
          };
        }
      }
      //TODO try
      /*tryCatch(
        async (bucket) => ({
          bucket,
          ...(await getByName({ name: bucket.Name })),
        }),
        (err, bucket) => ({
          bucket,
          err,
        })
      )*/
    )(Buckets);
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

    const s3Bucket = await fork({
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAccelerateConfiguration-property
      AccelerateConfiguration: () =>
        new Promise((resolve, reject) =>
          s3.getBucketAccelerateConfiguration(params, (err, data) =>
            switchCase([
              get("err"),
              ({ err }) => {
                logger.error(
                  `getBucketAccelerateConfiguration ${name}, error ${tos(err)}`
                );
                reject(err);
              },
              ({ data }) => resolve(isEmpty(data) ? undefined : data),
            ])({ err, data })
          )
        ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAcl-property
      ACL: pipe([
        () => s3.getBucketAcl(params).promise(),
        pick(["Grants", "Owner"]),
      ]),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketCors-property
      CORSConfiguration: tryCatch(
        () => s3.getBucketCors(params).promise(),
        switchCase([
          err => err.code === "NoSuchCORSConfiguration", () => undefined,
          err => {
            logger.error(`getBucketCors ${name}, error ${tos(err)}`);
            throw err;
          },
        ]),
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketEncryption-property
      ServerSideEncryptionConfiguration: () =>
        new Promise((resolve, reject) =>
          s3.getBucketEncryption(params, (err, data) =>
            switchCase([
              get("err"),
              switchCase([
                ({ err }) =>
                  err.code === "ServerSideEncryptionConfigurationNotFoundError",
                () => resolve(),
                ({ err }) => {
                  logger.error(
                    `getBucketEncryption ${name}, error ${tos(err)}`
                  );
                  reject(err);
                },
              ]),
              ({ data }) => resolve(isEmpty(data) ? undefined : data),
            ])({ err, data })
          )
        ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLifecycleConfiguration-property
      LifecycleConfiguration: () =>
        new Promise((resolve, reject) =>
          s3.getBucketLifecycleConfiguration(params, (err, data) =>
            switchCase([
              get("err"),
              switchCase([
                ({ err }) => err.code === "NoSuchLifecycleConfiguration",
                () => resolve(),
                ({ err }) => {
                  logger.error(
                    `getBucketLifecycleConfiguration ${name}, error ${tos(err)}`
                  );
                  reject(err);
                },
              ]),
              ({ data }) => resolve(data.Rules),
            ])({ err, data })
          )
        ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLocation-property
      LocationConstraint: pipe([
        () => s3.getBucketLocation(params).promise(),
        get("LocationConstraint"),
      ]),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLogging-property
      BucketLoggingStatus: () =>
        new Promise((resolve, reject) =>
          s3.getBucketLogging(params, (err, data) =>
            switchCase([
              get("err"),
              ({ err }) => {
                logger.error(`getBucketLogging ${name}, error ${tos(err)}`);
                reject(err);
              },
              ({ data }) => resolve(isEmpty(data) ? undefined : data),
            ])({ err, data })
          )
        ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketNotificationConfiguration-property

      /* "TopicConfigurations": [],
        "QueueConfigurations": [],
        "LambdaFunctionConfigurations": []
        */
      NotificationConfiguration: () =>
        new Promise((resolve, reject) =>
          s3.getBucketNotificationConfiguration(params, (err, data) =>
            switchCase([
              get("err"),
              ({ err }) => {
                logger.error(
                  `getBucketNotificationConfiguration ${name}, error ${tos(
                    err
                  )}`
                );
                reject(err);
              },
              pipe([
                get("data"),
                switchCase([
                  (data) => all(isEmpty)(Object.values(data)),
                  () => resolve(),
                  (data) => resolve(data),
                ]),
              ]),
            ])({ err, data })
          )
        ),

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property
      Policy: () =>
        new Promise((resolve, reject) =>
          s3.getBucketPolicy(params, (err, data) =>
            switchCase([
              get("err"),
              switchCase([
                ({ err }) => err.code === "NoSuchBucketPolicy",
                () => resolve(),
                ({ err }) => {
                  logger.error(`getBucketPolicy ${name}, error ${tos(err)}`);
                  reject(err);
                },
              ]),
              ({ data }) => resolve(isEmpty(data) ? undefined : data),
            ])({ err, data })
          )
        ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicyStatus-property
      PolicyStatus: () =>
        new Promise((resolve, reject) =>
          s3.getBucketPolicyStatus(params, (err, data) =>
            switchCase([
              get("err"),
              switchCase([
                ({ err }) => err.code === "NoSuchBucketPolicy",
                () => resolve(),
                ({ err }) => {
                  logger.error(
                    `getBucketPolicyStatus ${name}, error ${tos(err)}`
                  );
                  reject(err);
                },
              ]),
              ({ data }) => resolve(data.PolicyStatus),
            ])({ err, data })
          )
        ),
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketReplication-property
      ReplicationConfiguration: () =>
        new Promise((resolve, reject) =>
          s3.getBucketReplication(params, (err, data) =>
            switchCase([
              get("err"),
              switchCase([
                ({ err }) =>
                  err.code === "ReplicationConfigurationNotFoundError",
                () => resolve(),
                ({ err }) => {
                  logger.error(
                    `getBucketReplication ${name}, error ${tos(err)}`
                  );
                  reject(err);
                },
              ]),
              ({ data }) => resolve(data.ReplicationConfiguration),
            ])({ err, data })
          )
        ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketRequestPayment-property

      // Payer:'BucketOwner'
      RequestPayment: () =>
        new Promise((resolve, reject) =>
          s3.getBucketRequestPayment(params, (err, data) =>
            switchCase([
              get("err"),
              ({ err }) => {
                logger.error(
                  `getBucketRequestPayment ${name}, error ${tos(err)}`
                );
                reject(err);
              },
              pipe([
                get("data"),
                switchCase([
                  (data) => data.Payer === "BucketOwner",
                  () => resolve(),
                  (data) => resolve(data),
                ]),
              ]),
            ])({ err, data })
          )
        ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketTagging-property
      TagSet: () =>
        new Promise((resolve, reject) =>
          s3.getBucketTagging(params, (err, data) =>
            switchCase([
              get("err"),
              switchCase([
                ({ err }) => err.code === "NoSuchTagSet",
                () => resolve(),
                ({ err }) => {
                  logger.error(`getBucketTagging ${name}, error ${tos(err)}`);
                  reject(err);
                },
              ]),
              ({ data }) => resolve(data.TagSet),
            ])({ err, data })
          )
        ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketVersioning-property
      VersioningConfiguration: () =>
        new Promise((resolve, reject) =>
          s3.getBucketVersioning(params, (err, data) =>
            switchCase([
              get("err"),
              ({ err }) => {
                logger.error(`getBucketVersioning ${name}, error ${tos(err)}`);
                reject(err);
              },
              ({ data }) => resolve(isEmpty(data) ? undefined : data),
            ])({ err, data })
          )
        ),

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketWebsite-property
      WebsiteConfiguration: () =>
        new Promise((resolve, reject) =>
          s3.getBucketWebsite(params, (err, data) =>
            switchCase([
              get("err"),
              switchCase([
                ({ err }) => err.code === "NoSuchWebsiteConfiguration",
                () => resolve(),
                ({ err }) => {
                  logger.error(`getBucketWebsite ${name}, error ${tos(err)}`);
                  reject(err);
                },
              ]),
              ({ data }) => resolve(data),
            ])({ err, data })
          )
        ),

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLifecycleConfiguration-property
      LifecycleConfiguration: () =>
        new Promise((resolve, reject) =>
          s3.getBucketLifecycleConfiguration(params, (err, data) =>
            switchCase([
              get("err"),
              switchCase([
                ({ err }) => err.code === "NoSuchLifecycleConfiguration",
                () => resolve(),
                ({ err }) => {
                  logger.error(
                    `getBucketLifecycleConfiguration ${name}, error ${tos(err)}`
                  );
                  reject(err);
                },
              ]),
              ({ data }) => resolve(data),
            ])({ err, data })
          )
        ),
    })();

    logger.debug(`getByName ${name}: ${tos(s3Bucket)}`);
    return s3Bucket;
  };

  const getById = async ({ id }) => await getByName({ name: id });

  //TODO retry
  const headBucket = async ({ id }) => {
    try {
      await s3.headBucket({ Bucket: id }).promise();
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        return false;
      }
      logger.error(`headBucket ${id}`);
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
    //TODO name: Bucket
    assert(name);
    assert(payload);

    const {
      AccelerateConfiguration,
      ACL,
      AccessControlPolicy,
      GrantFullControl,
      GrantRead,
      GrantReadACP,
      GrantWrite,
      GrantWriteACP,
      AnalyticsConfiguration,
      CORSConfiguration,
      ServerSideEncryptionConfiguration,
      LifecycleConfiguration,
      BucketLoggingStatus,
      NotificationConfiguration,
      Policy,
      ReplicationConfiguration,
      RequestPaymentConfiguration,
      Tagging,
      VersioningConfiguration,
      WebsiteConfiguration,
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
      switchCase([
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAccelerateConfiguration-property
        () => AccelerateConfiguration,
        () =>
          s3
            .putBucketAccelerateConfiguration({
              Bucket: name,
              AccelerateConfiguration,
            })
            .promise(),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAcl-property
        () =>
          ACL ||
          AccessControlPolicy ||
          GrantFullControl ||
          GrantRead ||
          GrantReadACP ||
          GrantWrite ||
          GrantWriteACP,
        async () => {
          try {
            await s3
              .putBucketAcl({
                Bucket: name,
                ACL,
                AccessControlPolicy,
                GrantFullControl,
                GrantRead,
                GrantReadACP,
                GrantWrite,
                GrantWriteACP,
              })
              .promise();
          } catch (error) {
            logger.error(`putBucketAcl ${name}, error: ${error}`);
            throw error;
          }
        },
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property
        () => CORSConfiguration,
        () => s3.putBucketCors({ Bucket: name, CORSConfiguration }).promise(),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketEncryption-property
        () => ServerSideEncryptionConfiguration,
        () =>
          s3
            .putBucketEncryption({
              Bucket: name,
              ServerSideEncryptionConfiguration,
            })
            .promise(),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLifecycleConfiguration-property
        () => LifecycleConfiguration,
        () =>
          s3
            .putBucketLifecycleConfiguration({
              Bucket: name,
              LifecycleConfiguration,
            })
            .promise(),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLogging-property
        () => BucketLoggingStatus,
        () =>
          s3.putBucketLogging({ Bucket: name, BucketLoggingStatus }).promise(),
        //  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketNotificationConfiguration-property
        () => NotificationConfiguration,
        () =>
          s3
            .putBucketNotificationConfiguration({
              Bucket: name,
              NotificationConfiguration,
            })
            .promise(),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketPolicy-property
        () => Policy,
        () =>
          s3
            .putBucketPolicy({
              Bucket: name,
              Policy,
            })
            .promise(),

        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketReplication-property
        () => ReplicationConfiguration,
        () =>
          s3
            .putBucketReplicationConfiguration({
              Bucket: name,
              ReplicationConfiguration,
            })
            .promise(),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketRequestPayment-property
        () => RequestPaymentConfiguration,
        () =>
          s3
            .putBucketRequestPayment({
              Bucket: name,
              RequestPaymentConfiguration,
            })
            .promise(),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketVersioning-property
        () => VersioningConfiguration,
        () =>
          s3
            .putBucketVersioning({ Bucket: name, VersioningConfiguration })
            .promise(),
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property
        () => WebsiteConfiguration,
        () =>
          s3.putBucketWebsite({ Bucket: name, WebsiteConfiguration }).promise(),
        () => {},
      ])();
    } catch (error) {
      logger.error(error);
      await destroy({ id: name, name });
      throw error;
    }
    return { Location };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
  const destroy = async ({ id: Bucket }) => {
    assert(Bucket, `destroy invalid s3 id`);

    await pipe([
      tap(() => {
        logger.debug(`destroy bucket ${tos({ Bucket })}`);
      }),
      async () => {
        do {
          var isTruncated = await pipe([
            async () => await s3.listObjectsV2({ Bucket }).promise(),
            ({ Contents }) => Contents,
            tap((Contents) => {
              logger.debug(`listObjects Contents: ${tos({ Contents })}`);
            }),
            tap(
              map.pool(mapPoolSize, async (content) => {
                try {
                  await s3
                    .deleteObject({
                      Bucket,
                      Key: content.Key,
                    })
                    .promise();
                } catch (error) {
                  logger.error(`listObjects error: ${tos({ error })}`);
                  //
                }
              })
            ),
            ({ IsTruncated }) => IsTruncated,
            tap((IsTruncated) => {
              logger.debug(`listObjects IsTruncated: ${IsTruncated}`);
            }),
          ])();
        } while (isTruncated);
      },
      async () => {
        do {
          var isTruncated = await pipe([
            async () => await s3.listObjectVersions({ Bucket }).promise(),
            tap((result) => {
              logger.debug(`listObjectVersions: ${tos({ result })}`);
            }),
            tap(
              switchCase([
                (object) => !isEmpty(object.Versions),
                async (object) =>
                  await s3
                    .deleteObjects({
                      Bucket,
                      Delete: {
                        Objects: object.Versions.map((version) => ({
                          Key: version.Key,
                          VersionId: version.VersionId,
                        })),
                      },
                    })
                    .promise(),
                () => {
                  logger.debug(`listObjectVersions: not versions`);
                },
              ])
            ),
            tap(
              switchCase([
                (object) => !isEmpty(object.DeleteMarkers),
                async (object) =>
                  await s3
                    .deleteObjects({
                      Bucket,
                      Delete: {
                        Objects: object.DeleteMarkers.map((version) => ({
                          Key: version.Key,
                          VersionId: version.VersionId,
                        })),
                      },
                    })
                    .promise(),
                () => {
                  logger.debug(`listObjectVersions: no DeleteMarkers `);
                },
              ])
            ),
            ({ IsTruncated }) => IsTruncated,
            tap((IsTruncated) => {
              logger.debug(`listObjectVersions IsTruncated: ${IsTruncated}`);
            }),
          ])();
        } while (isTruncated);
      },
      async () => await s3.deleteBucket({ Bucket }).promise(),
      tap(() => {
        logger.debug(`destroyed, ${tos({ Bucket })}`);
      }),
    ])();
  };

  const configDefault = async ({ name, properties }) => {
    logger.debug(`configDefault ${tos({ name, properties })}`);
    return defaultsDeep({ Bucket: name }, properties);
  };

  return {
    type: "S3Bucket",
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

exports.isOurMinionS3Bucket = ({ resource, resourceNames, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(resource);
  const isMinion = !!resource.TagSet?.find(
    (tag) => tag.Key === managedByKey && tag.Value === managedByValue
  );

  logger.debug(
    `isOurMinion s3: isMinion ${isMinion}, ${tos({
      resource,
      resourceNames,
    })}`
  );
  return isMinion;
};
