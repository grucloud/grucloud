const AWS = require("aws-sdk");
const assert = require("assert");
const {
  map,
  tap,
  pipe,
  switchCase,
  fork,
  get,
  all,
  tryCatch,
} = require("rubico");
const { isEmpty, isDeepEqual, defaultsDeep, unionWith } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "S3Bucket" });
const { retryExpectOk, retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { mapPoolSize } = require("../../Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
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
    if (
      !(await retryCall({
        name: `getByName isUpById ${name}`,
        fn: () => isUpById({ id: name }),
        isExpectedResult: (result) => result,
        repeatCount: 7,
        retryCount: 7,
        retryDelay: 1e3,
      }))
    ) {
      logger.debug(`getByName cannot find: ${name}`);
      return;
    }

    const s3Bucket = await fork({
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAccelerateConfiguration-property
      AccelerateConfiguration: tryCatch(
        pipe([
          () => s3.getBucketAccelerateConfiguration(params).promise(),
          tap((x) => {
            logger.debug(`getBucketAccelerateConfiguration ${name} ${tos(x)}`);
          }),
          switchCase([isEmpty, () => undefined, (data) => data]),
        ]),
        (error) => {
          logger.error(
            `getBucketAccelerateConfiguration ${name}, error ${tos(error)}`
          );
          throw error;
        }
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAcl-property
      ACL: tryCatch(
        pipe([
          () => s3.getBucketAcl(params).promise(),
          tap((x) => {
            logger.debug(`getBucketAcl ${name} ${tos(x)}`);
          }),
        ]),
        (error) => {
          logger.error(`getBucketAcl ${name}, error ${tos(error)}`);
          throw error;
        }
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketCors-property
      CORSConfiguration: tryCatch(
        pipe([
          () => s3.getBucketCors(params).promise(),
          tap((x) => {
            logger.debug(`getBucketCors ${name} ${tos(x)}`);
          }),
        ]),
        switchCase([
          (error) => error.code === "NoSuchCORSConfiguration",
          () => undefined,
          (error) => {
            logger.error(`getBucketCors ${name}, error ${tos(error)}`);
            throw error;
          },
        ])
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketEncryption-property
      ServerSideEncryptionConfiguration: tryCatch(
        pipe([
          () => s3.getBucketEncryption(params).promise(),
          tap((x) => {
            logger.debug(`getBucketEncryption ${name} ${tos(x)}`);
          }),
        ]),
        switchCase([
          (err) =>
            err.code === "ServerSideEncryptionConfigurationNotFoundError",
          () => undefined,
          (err) => {
            logger.error(`getBucketEncryption ${name}, error ${tos(err)}`);
            throw err;
          },
        ])
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLifecycleConfiguration-property
      LifecycleConfiguration: tryCatch(
        pipe([
          () => s3.getBucketLifecycleConfiguration(params).promise(),
          tap((x) => {
            logger.debug(`getBucketLifecycleConfiguration ${name} ${tos(x)}`);
          }),
          switchCase([isEmpty, () => undefined, (data) => data]),
        ]),
        switchCase([
          (err) => err.code === "NoSuchLifecycleConfiguration",
          () => undefined,
          (err) => {
            logger.error(
              `getBucketLifecycleConfiguration ${name}, error ${tos(err)}`
            );
            throw err;
          },
        ])
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLocation-property
      LocationConstraint: tryCatch(
        pipe([
          () => s3.getBucketLocation(params).promise(),
          get("LocationConstraint"),
        ]),
        (error) => {
          logger.error(`getBucketLocation ${name}, error ${tos(error)}`);
          throw error;
        }
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLogging-property
      BucketLoggingStatus: tryCatch(
        pipe([
          () => s3.getBucketLogging(params).promise(),
          tap((x) => {
            logger.debug(`getBucketLogging ${name} ${tos(x)}`);
          }),
          switchCase([isEmpty, () => undefined, (data) => data]),
        ]),
        (error) => {
          logger.error(`getBucketLogging ${name}, error ${tos(error)}`);
          throw error;
        }
      ),

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketNotificationConfiguration-property
      NotificationConfiguration: tryCatch(
        pipe([
          () => s3.getBucketNotificationConfiguration(params).promise(),
          tap((x) => {
            logger.debug(
              `getBucketNotificationConfiguration ${name} ${tos(x)}`
            );
          }),
          switchCase([
            (data) => all(isEmpty)(Object.values(data)),
            () => undefined,
            (data) => data,
          ]),
        ]),
        (error) => {
          logger.error(
            `getBucketNotificationConfiguration ${name}, error ${tos(error)}`
          );
          throw error;
        }
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property
      Policy: tryCatch(
        pipe([
          () => s3.getBucketPolicy(params).promise(),
          tap((x) => {
            logger.debug(`getBucketPolicy ${name} ${tos(x)}`);
          }),
        ]),
        switchCase([
          (err) => err.code === "NoSuchBucketPolicy",
          () => undefined,
          (err) => {
            logger.error(`getBucketPolicy ${name}, error ${tos(err)}`);
            throw err;
          },
        ])
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicyStatus-property
      PolicyStatus: tryCatch(
        pipe([
          () => s3.getBucketPolicyStatus(params).promise(),
          tap((x) => {
            logger.debug(`getBucketPolicyStatus ${name} ${tos(x)}`);
          }),
          get("PolicyStatus"),
        ]),
        switchCase([
          (err) => err.code === "NoSuchBucketPolicy",
          () => undefined,
          (err) => {
            logger.error(`getBucketPolicyStatus ${name}, error ${tos(err)}`);
            throw err;
          },
        ])
      ),
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketReplication-property
      ReplicationConfiguration: tryCatch(
        pipe([
          () => s3.getBucketReplication(params).promise(),
          tap((x) => {
            logger.debug(`getBucketReplication ${name} ${tos(x)}`);
          }),
          get("ReplicationConfiguration"),
        ]),
        switchCase([
          (err) => err.code === "ReplicationConfigurationNotFoundError",
          () => undefined,
          (err) => {
            logger.error(`getBucketReplication ${name}, error ${tos(err)}`);
            throw err;
          },
        ])
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketRequestPayment-property
      RequestPaymentConfiguration: tryCatch(
        pipe([
          () => s3.getBucketRequestPayment(params).promise(),
          switchCase([
            (data) => data.Payer === "BucketOwner",
            () => undefined,
            (data) => data,
          ]),
        ]),
        (err) => {
          logger.error(`getBucketTagging ${name}, error ${tos(err)}`);
          throw err;
        }
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketTagging-property
      Tagging: tryCatch(
        pipe([
          () => s3.getBucketTagging(params).promise(),
          tap((x) => {
            logger.debug(`getBucketTagging ${name} ${tos(x)}`);
          }),
        ]),
        switchCase([
          (err) => err.code === "NoSuchTagSet",
          () => undefined,
          (err) => {
            logger.error(`getBucketTagging ${name}, error ${tos(err)}`);
            throw err;
          },
        ])
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketVersioning-property
      VersioningConfiguration: tryCatch(
        pipe([
          () => s3.getBucketVersioning(params).promise(),
          switchCase([isEmpty, () => undefined, (data) => data]),
          tap((x) => {
            logger.debug(`getBucketVersioning ${name} ${tos(x)}`);
          }),
        ]),
        (err) => {
          logger.error(`getBucketVersioning ${name}, error ${tos(err)}`);
          throw err;
        }
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLifecycleConfiguration-property
      LifecycleConfiguration: tryCatch(
        pipe([
          () => s3.getBucketLifecycleConfiguration(params).promise(),
          tap((x) => {
            logger.debug(`getBucketLifecycleConfiguration ${name} ${tos(x)}`);
          }),
        ]),
        switchCase([
          (err) => err.code === "NoSuchLifecycleConfiguration",
          () => undefined,
          (err) => {
            logger.error(
              `getBucketLifecycleConfiguration ${name}, error ${tos(err)}`
            );
            throw err;
          },
        ])
      ),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketWebsite-property
      WebsiteConfiguration: tryCatch(
        pipe([
          () => s3.getBucketWebsite(params).promise(),
          switchCase([isEmpty, () => undefined, (data) => data]),
          tap((x) => {
            logger.debug(`getBucketWebsite ${name} ${tos(x)}`);
          }),
        ]),
        switchCase([
          (err) => err.code === "NoSuchWebsiteConfiguration",
          () => undefined,
          (err) => {
            logger.error(`getBucketWebsite ${name}, error ${tos(err)}`);
            throw err;
          },
        ])
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
      //logger.debug(`headBucket ${id}: UP`);
      return true;
    } catch (error) {
      if (error.statusCode === 404) {
        //logger.debug(`headBucket ${id}:DOWN`);
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
      Tagging: {
        TagSet: unionWith(isDeepEqual)([Tagging?.TagSet || [], managementTags]),
      },
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
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAccelerateConfiguration-property
      if (AccelerateConfiguration) {
        await s3
          .putBucketAccelerateConfiguration({
            Bucket: name,
            AccelerateConfiguration,
          })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAcl-property
      if (
        ACL ||
        AccessControlPolicy ||
        GrantFullControl ||
        GrantRead ||
        GrantReadACP ||
        GrantWrite ||
        GrantWriteACP
      ) {
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

          await retryExpectOk({
            name: `s3 putBucketAcl: ${name}`,
            fn: async () => {
              const { Grants } = await s3
                .getBucketAcl({ Bucket: name })
                .promise();
              // TODO use switchCase
              if (ACL === "log-delivery-write") {
                if (Grants.length != 3) {
                  throw Error(`no ACL yet for ${name}`);
                }
              }
              if (ACL === "public-read") {
                if (Grants.length != 2) {
                  throw Error(`no ACL yet for ${name}`);
                }
              }
              return true;
            },
            config: clientConfig,
          });
        } catch (error) {
          logger.error(`putBucketAcl ${name}, error: ${error}`);
          throw error;
        }
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property
      if (CORSConfiguration) {
        await s3.putBucketCors({ Bucket: name, CORSConfiguration }).promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketEncryption-property
      if (ServerSideEncryptionConfiguration) {
        await s3
          .putBucketEncryption({
            Bucket: name,
            ServerSideEncryptionConfiguration,
          })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLifecycleConfiguration-property
      if (LifecycleConfiguration) {
        await s3
          .putBucketLifecycleConfiguration({
            Bucket: name,
            LifecycleConfiguration,
          })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLogging-property
      if (BucketLoggingStatus) {
        await s3
          .putBucketLogging({ Bucket: name, BucketLoggingStatus })
          .promise();
      }
      //  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketNotificationConfiguration-property
      if (NotificationConfiguration) {
        await s3
          .putBucketNotificationConfiguration({
            Bucket: name,
            NotificationConfiguration,
          })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketPolicy-property
      if (Policy) {
        await s3
          .putBucketPolicy({
            Bucket: name,
            Policy,
          })
          .promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketReplication-property
      if (ReplicationConfiguration) {
        await s3
          .putBucketReplication({
            Bucket: name,
            ReplicationConfiguration,
          })
          .promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketRequestPayment-property
      if (RequestPaymentConfiguration) {
        await s3
          .putBucketRequestPayment({
            Bucket: name,
            RequestPaymentConfiguration,
          })
          .promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketVersioning-property
      if (VersioningConfiguration) {
        await s3
          .putBucketVersioning({ Bucket: name, VersioningConfiguration })
          .promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property
      if (WebsiteConfiguration) {
        logger.debug(`putBucketWebsite ${name}: ${tos(WebsiteConfiguration)}`);
        await s3
          .putBucketWebsite({ Bucket: name, WebsiteConfiguration })
          .promise();
      }
    } catch (error) {
      logger.error(error);
      await destroy({ id: name, name });
      throw error;
    }
    logger.error(`created final ${name}`);

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
    const config = defaultsDeep({ Bucket: name })(properties);
    logger.debug(`configDefault ${tos({ config })}`);
    return config;
  };

  return {
    type: "S3Bucket",
    spec,
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
  const isMinion = !!resource.Tagging?.TagSet?.find(
    (tag) => tag.Key === managedByKey && tag.Value === managedByValue
  );

  logger.debug(`isOurMinion s3 bucket: isMinion ${isMinion}`);
  return isMinion;
};
