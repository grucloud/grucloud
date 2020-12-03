const AWS = require("aws-sdk");
const assert = require("assert");
const {
  map,
  filter,
  not,
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
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { mapPoolSize } = require("../../Common");
const { CheckAwsTags } = require("../AwsTagCheck");
const { buildTags } = require("../AwsCommon");
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
exports.AwsS3Bucket = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 5 };

  const s3 = new AWS.S3();

  const findName = get("Name");
  const findId = findName;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketTagging-property
  const getBucketTagging = (params) =>
    tryCatch(
      pipe([
        tap((x) => {
          logger.debug(`getBucketTagging ${params.Bucket}`);
        }),
        () => s3.getBucketTagging(params).promise(),
        get("TagSet"),
        tap((TagSet) => {
          logger.debug(
            `getBucketTagging ${params.Bucket} result: ${tos(TagSet)}`
          );
        }),
      ]),
      switchCase([
        (err) => err.code === "NoSuchTagSet",
        () => undefined,
        (err) => {
          logger.error(`getBucketTagging ${params.Bucket}, error ${tos(err)}`);
          throw err;
        },
      ])
    );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listBuckets-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  const getList = ({ deep = true }) =>
    pipe([
      tap(() => {
        logger.info(`getList s3Bucket deep:${deep}`);
      }),
      () => s3.listBuckets().promise(),
      get("Buckets"),
      tap((Buckets) => {
        logger.info(`getList s3Bucket `);
      }),
      map.pool(
        mapPoolSize,
        tryCatch(
          async (bucket) => ({
            ...bucket,
            Tags: await getBucketTagging({ Bucket: bucket.Name })(),
            ...(deep &&
              (await getByName({ name: bucket.Name, getTags: false }))),
          }),
          (error, bucket) => ({
            bucket,
            error,
          })
        )
      ),
      filter(pipe([get("error"), isEmpty])),
      tap((fullBuckets) => {
        logger.info(`getList s3bucket #items ${fullBuckets.length}`);
        logger.debug(`getList full ${tos(fullBuckets)}`);
      }),
      (fullBuckets) => ({
        total: fullBuckets.length,
        items: fullBuckets,
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property

  const getByName = async ({ name, deep = true, getTags = true }) => {
    logger.info(`getByName ${name}, deep: ${deep}`);

    const params = { Bucket: name };
    if (!(await isUpById({ id: name }))) {
      logger.debug(`getByName cannot find: ${name}`);
      return;
    }

    const s3Bucket = await fork({
      ...(getTags && { Tags: getBucketTagging(params) }),
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAccelerateConfiguration-property
      ...(deep && {
        AccelerateConfiguration: tryCatch(
          pipe([
            () => s3.getBucketAccelerateConfiguration(params).promise(),
            tap((x) => {
              logger.debug(
                `getBucketAccelerateConfiguration ${name} ${tos(x)}`
              );
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
            (acl) => {
              logger.debug(`getBucketAcl ${name} ${tos(acl)}`);
              const grant = acl.Grants[0];
              const ownerId = acl.Owner.ID;
              if (
                ownerId === grant.Grantee.ID &&
                grant.Permission === "FULL_CONTROL" &&
                acl.Grants.length === 1
              ) {
                logger.debug(`getBucketAcl ${name} default`);
                return;
              } else {
                return acl;
              }
            },
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
      }),
    })();

    logger.debug(`getByName ${name}: ${tos(s3Bucket)}`);
    return s3Bucket;
  };

  const getById = async ({ id }) => await getByName({ name: id });

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

  const putTags = ({ Bucket, paramsTag }) =>
    retryCall({
      name: `tag ${Bucket}`,
      fn: pipe([
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketTagging-property
        () => s3.putBucketTagging(paramsTag).promise(),
        () => s3.getBucketTagging({ Bucket }).promise(),
        get("TagSet"),
        tap((TagSet) => {
          logger.debug(`putTags Bucket: ${Bucket}, TagSet: ${tos(TagSet)}`);
        }),
        (TagSet) =>
          CheckAwsTags({
            config,
            tags: TagSet,
            name: Bucket,
          }),
      ]),
      isExpectedResult: (result) => result,
      shouldRetryOnException: (error) => {
        logger.error(`putTags shouldRetryOnException ${tos(error)}`);
        return true;
      },
      retryCount: 5,
      retryDelay: config.retryDelay,
    });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const create = async ({ name: Bucket, payload }) => {
    assert(Bucket);
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

    logger.info(`create bucket ${tos({ Bucket, payload })}`);

    const managementTags = buildTags({ name: Bucket, config });

    const paramsTag = {
      Bucket,
      Tagging: {
        TagSet: unionWith(isDeepEqual)([Tagging?.TagSet || [], managementTags]),
      },
    };

    const { Location } = await pipe([
      () =>
        retryCall({
          name: `s3 createBucket: ${Bucket}`,
          fn: () => s3.createBucket(otherProperties).promise(),
          shouldRetryOnException: (error) => {
            logger.error(`create error ${tos(error)}`);
            return ["OperationAborted"].includes(error.code);
          },
        }),
      tap(({ Location }) => {
        logger.info(`create bucket result ${tos(Location)}`);
      }),
      tap(() =>
        retryCall({
          name: `s3 isUpById: ${Bucket}`,
          fn: () => isUpById({ id: Bucket }),
          isExpectedResult: (result) => result,
          repeatCount: 6,
          retryCount: 10,
          retryDelay: 1e3,
        })
      ),
    ])();

    try {
      await putTags({ Bucket, paramsTag });

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAccelerateConfiguration-property
      if (AccelerateConfiguration) {
        await s3
          .putBucketAccelerateConfiguration({
            Bucket,
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
              Bucket,
              ACL,
              AccessControlPolicy,
              GrantFullControl,
              GrantRead,
              GrantReadACP,
              GrantWrite,
              GrantWriteACP,
            })
            .promise();

          await retryCall({
            name: `s3 getBucketAcl: ${Bucket}`,
            fn: pipe([
              () => s3.getBucketAcl({ Bucket }).promise(),
              get("Grants"),
              tap((Grants) => {
                logger.debug(
                  `getBucketAcl ${Bucket}, ACL: ${ACL}, ${tos({ Grants })}`
                );
              }),
              switchCase([
                () => ACL === "log-delivery-write",
                (Grants) => {
                  if (Grants.length != 3) {
                    const message = `no ACL yet for ${Bucket}`;
                    logger.error(message);
                    throw Error(message);
                  }
                },
                () => ACL === "public-read",
                (Grants) => {
                  if (Grants.length != 2) {
                    const message = `no ACL yet for ${Bucket}`;
                    logger.error(message);
                    throw Error(message);
                  }
                },
                () => true,
              ]),
            ]),
          });
        } catch (error) {
          logger.error(`putBucketAcl ${Bucket}, error: ${error}`);
          throw error;
        }
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property
      if (CORSConfiguration) {
        await s3.putBucketCors({ Bucket, CORSConfiguration }).promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketEncryption-property
      if (ServerSideEncryptionConfiguration) {
        await s3
          .putBucketEncryption({
            Bucket,
            ServerSideEncryptionConfiguration,
          })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLifecycleConfiguration-property
      if (LifecycleConfiguration) {
        await s3
          .putBucketLifecycleConfiguration({
            Bucket,
            LifecycleConfiguration,
          })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLogging-property
      if (BucketLoggingStatus) {
        await s3.putBucketLogging({ Bucket, BucketLoggingStatus }).promise();
      }
      //  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketNotificationConfiguration-property
      if (NotificationConfiguration) {
        await s3
          .putBucketNotificationConfiguration({
            Bucket,
            NotificationConfiguration,
          })
          .promise();
      }

      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketPolicy-property
      if (Policy) {
        await s3
          .putBucketPolicy({
            Bucket,
            Policy,
          })
          .promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketReplication-property
      if (ReplicationConfiguration) {
        await s3
          .putBucketReplication({
            Bucket,
            ReplicationConfiguration,
          })
          .promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketRequestPayment-property
      if (RequestPaymentConfiguration) {
        await s3
          .putBucketRequestPayment({
            Bucket,
            RequestPaymentConfiguration,
          })
          .promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketVersioning-property
      if (VersioningConfiguration) {
        await s3
          .putBucketVersioning({ Bucket, VersioningConfiguration })
          .promise();
      }
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property
      if (WebsiteConfiguration) {
        logger.debug(
          `putBucketWebsite ${Bucket}: ${tos(WebsiteConfiguration)}`
        );
        await s3.putBucketWebsite({ Bucket, WebsiteConfiguration }).promise();
      }
    } catch (error) {
      logger.error(error);
      await destroy({ id: Bucket, name: Bucket });
      throw error;
    }
    logger.info(`created final ${Bucket}`);

    return { Location };
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
  const destroy = async ({ id: Bucket }) => {
    assert(Bucket, `destroy invalid s3 id`);

    await pipe([
      tap(() => {
        logger.info(`destroy bucket ${tos({ Bucket })}`);
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
        logger.info(`destroyed, ${tos({ Bucket })}`);
      }),
    ])();
  };

  const configDefault = async ({ name, properties }) => {
    return defaultsDeep({ Bucket: name })(properties);
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
    findName,
    create,
    destroy,
    getList,
    configDefault,
    shouldRetryOnException: (error) => {
      logger.debug(`shouldRetryOnException ${tos(error)}`);
      const retry = error.code === "NoSuchBucket";
      logger.debug(`shouldRetryOnException retry: ${retry}`);
      return retry;
    },
  };
};

exports.isOurMinionS3Bucket = ({ resource, config }) => {
  const { createdByProviderKey, providerName } = config;

  assert(resource);
  assert(resource.Tags);
  const isMinion = !!resource.Tags.find(
    (tag) => tag.Key === createdByProviderKey && tag.Value === providerName
  );

  logger.debug(`isOurMinion s3 bucket: isMinion ${isMinion}`);
  return isMinion;
};
