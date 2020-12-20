const AWS = require("aws-sdk");
const assert = require("assert");
const {
  eq,
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
const { S3New, buildTags, shouldRetryOnException } = require("../AwsCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
exports.AwsS3Bucket = ({ spec, config }) => {
  assert(spec);
  assert(config);
  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 5 };

  const s3 = S3New(config);

  const findName = get("Name");
  const findId = findName;

  const getAccelerateConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketAccelerateConfiguration(params),
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
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAcl-property
  const getACL = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketAcl(params),
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
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketCors-property
  const getCORSConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketCors(params),
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
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketEncryption-property
  const getServerSideEncryptionConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketEncryption(params),
        tap((x) => {
          logger.debug(`getBucketEncryption ${name} ${tos(x)}`);
        }),
      ]),
      switchCase([
        (err) => err.code === "ServerSideEncryptionConfigurationNotFoundError",
        () => undefined,
        (err) => {
          logger.error(`getBucketEncryption ${name}, error ${tos(err)}`);
          throw err;
        },
      ])
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLifecycleConfiguration-property
  const getLifecycleConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketLifecycleConfiguration(params),
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
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLocation-property
  const getLocationConstraint = ({ name, params }) =>
    tryCatch(
      pipe([() => s3().getBucketLocation(params), get("LocationConstraint")]),
      (error) => {
        logger.error(`getBucketLocation ${name}, error ${tos(error)}`);
        throw error;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLogging-property
  const getBucketLoggingStatus = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketLogging(params),
        tap((x) => {
          logger.debug(`getBucketLogging ${name} ${tos(x)}`);
        }),
        switchCase([isEmpty, () => undefined, (data) => data]),
      ]),
      (error) => {
        logger.error(`getBucketLogging ${name}, error ${tos(error)}`);
        throw error;
      }
    );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketNotificationConfiguration-property
  const getNotificationConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketNotificationConfiguration(params),
        tap((x) => {
          logger.debug(`getBucketNotificationConfiguration ${name} ${tos(x)}`);
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
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property
  const getPolicy = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketPolicy(params),
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
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicyStatus-property
  const getPolicyStatus = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketPolicyStatus(params),
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
    );
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketReplication-property
  const getReplicationConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketReplication(params),
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
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketRequestPayment-property
  const getRequestPaymentConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketRequestPayment(params),
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
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketVersioning-property
  const getVersioningConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketVersioning(params),
        switchCase([isEmpty, () => undefined, (data) => data]),
        tap((x) => {
          logger.debug(`getBucketVersioning ${name} ${tos(x)}`);
        }),
      ]),
      (err) => {
        logger.error(`getBucketVersioning ${name}, error ${tos(err)}`);
        throw err;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketWebsite-property
  const getWebsiteConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketWebsite(params),
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
    );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketTagging-property
  const getBucketTagging = (params) =>
    tryCatch(
      pipe([
        tap((x) => {
          logger.debug(`getBucketTagging ${params.Bucket}`);
        }),
        () => s3().getBucketTagging(params),
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
      () => s3().listBuckets(),
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
  const getByName = async ({ name, deep = true, getTags = true }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}, deep: ${deep}`);
      }),
      switchCase([
        () => isUpById({ id: name }),
        pipe([
          () => ({ Bucket: name }),
          (params) =>
            retryCall({
              name: `get s3 properties ${name}`,
              fn: fork({
                ...(getTags && { Tags: getBucketTagging(params) }),
                ...(deep && {
                  AccelerateConfiguration: getAccelerateConfiguration({
                    name,
                    params,
                  }),
                  ACL: getACL({ name, params }),
                  CORSConfiguration: getCORSConfiguration({ name, params }),
                  ServerSideEncryptionConfiguration: getServerSideEncryptionConfiguration(
                    { name, params }
                  ),
                  LocationConstraint: getLocationConstraint({ name, params }),
                  BucketLoggingStatus: getBucketLoggingStatus({ name, params }),
                  NotificationConfiguration: getNotificationConfiguration({
                    name,
                    params,
                  }),
                  Policy: getPolicy({ name, params }),
                  PolicyStatus: getPolicyStatus({ name, params }),
                  ReplicationConfiguration: getReplicationConfiguration({
                    name,
                    params,
                  }),
                  RequestPaymentConfiguration: getRequestPaymentConfiguration({
                    name,
                    params,
                  }),
                  VersioningConfiguration: getVersioningConfiguration({
                    name,
                    params,
                  }),
                  LifecycleConfiguration: getLifecycleConfiguration({
                    name,
                    params,
                  }),
                  WebsiteConfiguration: getWebsiteConfiguration({
                    name,
                    params,
                  }),
                }),
              }),
              shouldRetryOnException,
              config: { retryCount: 5, retryDelay: config.retryDelay },
            }),
        ]),
        () => undefined,
      ]),
      tap((s3Bucket) => {
        logger.debug(`getByName ${name}: ${tos(s3Bucket)}`);
      }),
    ])();

  const getById = async ({ id }) => await getByName({ name: id });

  const headBucket = async ({ id }) => {
    try {
      await s3().headBucket({ Bucket: id });
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
        () => s3().putBucketTagging(paramsTag),
        () => s3().getBucketTagging({ Bucket }),
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
      shouldRetryOnException,
      config: { retryCount: 5, retryDelay: config.retryDelay },
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
          fn: () => s3().createBucket(otherProperties),
          shouldRetryOnException,
          config: { retryCount: 600 },
        }),
      tap(({ Location }) => {
        logger.info(`create bucket result ${tos(Location)}`);
      }),
      tap(() =>
        retryCall({
          name: `s3 isUpById: ${Bucket}`,
          fn: () => isUpById({ id: Bucket }),
          config: { repeatCount: 6, retryCount: 10, retryDelay: 1e3 },
        })
      ),
    ])();

    try {
      await putTags({ Bucket, paramsTag });
      await retryCall({
        name: `s3 put: ${Bucket}`,
        fn: async () => {
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAccelerateConfiguration-property
          if (AccelerateConfiguration) {
            await s3().putBucketAccelerateConfiguration({
              Bucket,
              AccelerateConfiguration,
            });
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
            await retryCall({
              name: `s3 getBucketAcl: ${Bucket}`,
              isExpectedResult: () => true,
              shouldRetryOnException,
              fn: pipe([
                () =>
                  s3().putBucketAcl({
                    Bucket,
                    ACL,
                    AccessControlPolicy,
                    GrantFullControl,
                    GrantRead,
                    GrantReadACP,
                    GrantWrite,
                    GrantWriteACP,
                  }),
                () => s3().getBucketAcl({ Bucket }),
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
          }
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketCors-property
          if (CORSConfiguration) {
            await s3().putBucketCors({ Bucket, CORSConfiguration });
          }
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketEncryption-property
          if (ServerSideEncryptionConfiguration) {
            await s3().putBucketEncryption({
              Bucket,
              ServerSideEncryptionConfiguration,
            });
          }

          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLifecycleConfiguration-property
          if (LifecycleConfiguration) {
            await s3().putBucketLifecycleConfiguration({
              Bucket,
              LifecycleConfiguration,
            });
          }

          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketLogging-property
          if (BucketLoggingStatus) {
            await s3().putBucketLogging({ Bucket, BucketLoggingStatus });
          }
          //  https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketNotificationConfiguration-property
          if (NotificationConfiguration) {
            await s3().putBucketNotificationConfiguration({
              Bucket,
              NotificationConfiguration,
            });
          }

          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketPolicy-property
          if (Policy) {
            await s3().putBucketPolicy({
              Bucket,
              Policy,
            });
          }
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketReplication-property
          if (ReplicationConfiguration) {
            await s3().putBucketReplication({
              Bucket,
              ReplicationConfiguration,
            });
          }
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketRequestPayment-property
          if (RequestPaymentConfiguration) {
            await s3().putBucketRequestPayment({
              Bucket,
              RequestPaymentConfiguration,
            });
          }
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketVersioning-property
          if (VersioningConfiguration) {
            await s3().putBucketVersioning({ Bucket, VersioningConfiguration });
          }
          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property
          if (WebsiteConfiguration) {
            logger.debug(
              `putBucketWebsite ${Bucket}: ${tos(WebsiteConfiguration)}`
            );
            await s3().putBucketWebsite({ Bucket, WebsiteConfiguration });
          }
        },
        isExpectedResult: () => true,
        shouldRetryOnException,
        config: { retryCount: 10, retryDelay: 2e3 },
      });
    } catch (error) {
      logger.error("s3 bucket put error");
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
            async () => await s3().listObjectsV2({ Bucket }),
            ({ Contents }) => Contents,
            tap((Contents) => {
              logger.debug(`listObjects Contents: ${tos({ Contents })}`);
            }),
            tap(
              map.pool(mapPoolSize, async (content) => {
                try {
                  await s3().deleteObject({
                    Bucket,
                    Key: content.Key,
                  });
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
            () => s3().listObjectVersions({ Bucket }),
            tap((result) => {
              logger.debug(`listObjectVersions: ${tos({ result })}`);
            }),
            tap(
              switchCase([
                (object) => !isEmpty(object.Versions),
                (object) =>
                  s3().deleteObjects({
                    Bucket,
                    Delete: {
                      Objects: object.Versions.map((version) => ({
                        Key: version.Key,
                        VersionId: version.VersionId,
                      })),
                    },
                  }),
                () => {
                  logger.debug(`listObjectVersions: not versions`);
                },
              ])
            ),
            tap(
              switchCase([
                (object) => !isEmpty(object.DeleteMarkers),
                (object) =>
                  s3().deleteObjects({
                    Bucket,
                    Delete: {
                      Objects: object.DeleteMarkers.map((version) => ({
                        Key: version.Key,
                        VersionId: version.VersionId,
                      })),
                    },
                  }),
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
      tryCatch(
        () => s3().deleteBucket({ Bucket }),
        switchCase([
          eq(get("code"), "NoSuchBucket"),
          () => null,
          (error) => {
            logger.error(`destroy s3 bucket ${Bucket}, error: ${tos(error)}`);
            throw error;
          },
        ])
      ),
      tap(() => {
        logger.info(`destroyed s3 bucket ${tos({ Bucket })}`);
      }),
    ])();
  };

  const configDefault = async ({ name, properties }) =>
    defaultsDeep({ Bucket: name })(properties);

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
    shouldRetryOnException: ({ error, name }) => {
      logger.error(`shouldRetryOnException ${tos({ name, error })}`);
      const retry = error.code === "NoSuchBucket";
      logger.error(`shouldRetryOnException retry: ${retry}`);
      return retry;
    },
    shouldRetryOnExceptionDelete: shouldRetryOnException,
  };
};
