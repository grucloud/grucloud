const assert = require("assert");
const {
  eq,
  map,
  filter,
  not,
  or,
  and,
  tap,
  pipe,
  switchCase,
  fork,
  get,
  all,
  tryCatch,
  any,
  assign,
  omit,
} = require("rubico");
const {
  size,
  isEmpty,
  isDeepEqual,
  defaultsDeep,
  unionWith,
  when,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "S3Bucket" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { mapPoolSize, omitIfEmpty } = require("@grucloud/core/Common");
const { CheckAwsTags } = require("../AwsTagCheck");
const {
  throwIfNotAwsError,
  buildTags,
  shouldRetryOnException,
  findNamespaceInTags,
  isAwsError,
} = require("../AwsCommon");

const { createS3 } = require("./AwsS3Common");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
exports.AwsS3Bucket = ({ spec, config }) => {
  const s3 = createS3(config);

  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 5 };

  const findName = () => get("Name");
  const findId = findName;
  const findNamespace = findNamespaceInTags;

  const getAccelerateConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => params,
        s3().getBucketAccelerateConfiguration,
        tap((params) => {
          assert(true);
        }),
        when(isEmpty, () => undefined),
      ]),
      (error) => {
        throw error;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAcl-property
  const getACL = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketAcl(params),
        get("Grants"),
        tap((params) => {
          assert(true);
        }),
        switchCase([
          any(
            and([
              eq(
                get("Grantee.URI"),
                "http://acs.amazonaws.com/groups/global/AllUsers"
              ),
              eq(get("Permission"), "READ"),
            ])
          ),
          () => "public-read",
          any(
            and([
              eq(
                get("Grantee.URI"),
                "http://acs.amazonaws.com/groups/global/AllUsers"
              ),
              eq(get("Permission"), "WRITE"),
            ])
          ),
          () => "public-write",
          () => undefined,
        ]),
        tap((params) => {
          assert(true);
        }),
      ]),
      (error) => {
        throw error;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketCors-property
  const getCORSConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([() => s3().getBucketCors(params)]),
      throwIfNotAwsError("NoSuchCORSConfiguration")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketEncryption-property
  const getServerSideEncryptionConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketEncryption(params),
        get("ServerSideEncryptionConfiguration"),
        assign({
          Rules: pipe([
            get("Rules"),
            map(
              pipe([
                when(
                  eq(get("BucketKeyEnabled"), false),
                  omit(["BucketKeyEnabled"])
                ),
              ])
            ),
          ]),
        }),
      ]),
      throwIfNotAwsError("ServerSideEncryptionConfigurationNotFoundError")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLifecycleConfiguration-property
  const getLifecycleConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketLifecycleConfiguration(params),
        when(isEmpty, () => undefined),
      ]),
      throwIfNotAwsError("NoSuchLifecycleConfiguration")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLocation-property
  const getLocationConstraint = ({ name, params }) =>
    tryCatch(
      pipe([() => s3().getBucketLocation(params), get("LocationConstraint")]),
      (error) => {
        throw error;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLogging-property
  const getBucketLoggingStatus = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketLogging(params),
        tap((params) => {
          assert(true);
        }),
        omitIfEmpty(["LoggingEnabled"]),
        when(isEmpty, () => undefined),
      ]),
      (error) => {
        throw error;
      }
    );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketNotificationConfiguration-property
  const getNotificationConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketNotificationConfiguration(params),
        when(
          (data) => all(isEmpty)(Object.values(data)),
          () => undefined
        ),
      ]),
      (error) => {
        throw error;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property
  const getPolicy = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketPolicy(params),
        get("Policy"),
        tryCatch(JSON.parse, () => undefined),
      ]),
      throwIfNotAwsError("NoSuchBucketPolicy")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicyStatus-property
  const getPolicyStatus = ({ name, params }) =>
    tryCatch(
      pipe([() => s3().getBucketPolicyStatus(params), get("PolicyStatus")]),
      throwIfNotAwsError("NoSuchBucketPolicy")
    );
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketReplication-property
  const getReplicationConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketReplication(params),
        get("ReplicationConfiguration"),
      ]),
      throwIfNotAwsError("ReplicationConfigurationNotFoundError")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketRequestPayment-property
  const getRequestPaymentConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketRequestPayment(params),
        when(eq(get("Payer"), "BucketOwner"), () => undefined),
      ]),
      (err) => {
        throw err;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketVersioning-property
  const getVersioningConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketVersioning(params),
        tap((params) => {
          assert(true);
        }),
        omitIfEmpty(["MFADelete"]),
        when(isEmpty, () => undefined),
      ]),
      (err) => {
        throw err;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketWebsite-property
  const getWebsiteConfiguration = ({ name, params }) =>
    tryCatch(
      pipe([
        () => s3().getBucketWebsite(params),
        when(isEmpty, () => undefined),
      ]),
      throwIfNotAwsError("NoSuchWebsiteConfiguration")
    );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketTagging-property
  const getBucketTagging = (params) =>
    tryCatch(
      pipe([
        tap((x) => {
          logger.debug(`getBucketTagging ${params.Bucket}`);
        }),
        () =>
          retryCall({
            name: `getBucketTagging ${params.Bucket}`,
            fn: pipe([
              () => s3().getBucketTagging(params),
              get("TagSet"),
              tap((TagSet) => {
                logger.debug(
                  `getBucketTagging ${params.Bucket} result: ${tos(TagSet)}`
                );
              }),
            ]),
            isExpectedException: isAwsError("NoSuchTagset"),
            shouldRetryOnException: ({ error, name }) =>
              pipe([
                () => error,
                or([
                  () => [503].includes(error.statusCode),
                  isAwsError("NoSuchBucket"),
                ]),
              ])(),
            config: { retryCount: 5, retryDelay: 1e3 },
          }),
      ]),
      throwIfNotAwsError("NoSuchTagSet")
    );

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listBuckets-property
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property
  const getList = ({ deep = true }) =>
    pipe([
      tap(() => {
        logger.info(`getList s3Bucket deep:${deep}`);
      }),
      () => ({}),
      s3().listBuckets,
      get("Buckets", []),
      tap((Buckets) => {
        logger.info(`getList #s3Bucket ${size(Buckets)}`);
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
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property
  const getByName = ({ name, deep = true, getTags = true }) =>
    pipe([
      tap(() => {
        logger.info(`getByName ${name}, deep: ${deep}`);
      }),
      switchCase([
        () => isUpById({ Bucket: name }),
        pipe([
          () => ({ Bucket: name }),
          (params) =>
            retryCall({
              name: `get s3 properties ${name}`,
              fn: fork({
                Name: () => name,
                ...(getTags && { Tags: getBucketTagging(params) }),
                ...(deep && {
                  AccelerateConfiguration: getAccelerateConfiguration({
                    name,
                    params,
                  }),
                  ACL: getACL({ name, params }),
                  CORSConfiguration: getCORSConfiguration({ name, params }),
                  ServerSideEncryptionConfiguration:
                    getServerSideEncryptionConfiguration({ name, params }),
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

  const isUpById = ({ Bucket }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`headBucket: ${Bucket}`);
        }),
        () => s3().headBucket({ Bucket }),
        () => true,
      ]),
      switchCase([
        or([
          eq(get("statusCode"), 404),
          and([eq(get("statusCode"), 400), isAwsError("BadRequest")]),
          isAwsError("NotFound"),
        ]),
        () => false,
        (error) => {
          logger.error(`headBucket ${Bucket}`);
          logger.error(error);
          throw error;
        },
      ])
    )();

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

  //TODO
  const updateProperties = ({ Bucket, Policy, NotificationConfiguration }) =>
    pipe([
      tap((params) => {
        assert(Bucket);
      }),
      tap.if(
        get("NotificationConfiguration"),
        pipe([
          () =>
            s3().putBucketNotificationConfiguration({
              Bucket,
              NotificationConfiguration,
            }),
        ])
      ),
      tap.if(
        get("Policy"),
        pipe([
          fork({ Policy: pipe([() => Policy, JSON.stringify]) }),
          defaultsDeep({ Bucket }),
          s3().putBucketPolicy,
        ])
      ),
    ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const create = async ({ name: Bucket, namespace, payload }) => {
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
      Tags = [],
      VersioningConfiguration,
      WebsiteConfiguration,
      ...otherProperties
    } = payload;

    logger.info(`create bucket ${tos({ Bucket, payload })}`);

    const managementTags = buildTags({ name: Bucket, namespace, config });

    const paramsTag = {
      Bucket,
      Tagging: {
        TagSet: unionWith(isDeepEqual)([Tags, managementTags]),
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
          fn: () => isUpById({ Bucket }),
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
                      const message = `no ACL yet for ${Bucket}, ${tos({
                        Grants,
                      })}`;
                      logger.error(message);
                      // TODO retry on this error
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
              Policy: JSON.stringify(Policy),
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
      await destroy({ live: { Name: Bucket } });
      throw error;
    }
    logger.info(`created final ${Bucket}`);
    return { Location };
  };
  //TODO
  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update s3: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => diff.liveDiff.added,
      tryCatch(updateProperties(payload), (error) => {
        throw error;
      }),
      () => diff.liveDiff.updated,
      tryCatch(updateProperties(payload), (error) => {
        throw error;
      }),
      tap(() => {
        logger.info(`s3 updated ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property
  const destroy = ({ live: { Name: Bucket } }) =>
    pipe([
      tap(() => {
        assert(Bucket, `destroy invalid s3`);
        logger.debug(`destroy bucket ${tos({ Bucket })}`);
      }),
      tryCatch(async () => {
        do {
          var isTruncated = await pipe([
            () => ({ Bucket }),
            s3().listObjectsV2,
            get("Contents", []),
            tap((Contents) => {
              logger.debug(`listObjects Contents: ${size(Contents)}`);
            }),
            tap(
              map.pool(
                mapPoolSize,
                tryCatch(
                  pipe([
                    ({ Key }) => ({
                      Bucket,
                      Key,
                    }),
                    //TODO
                    s3().deleteObject,
                  ]),
                  (error) => ({ error })
                )
              )
            ),
            get("IsTruncated"),
          ])();
        } while (isTruncated);
      }, throwIfNotAwsError("NoSuchBucket")),
      tryCatch(async () => {
        do {
          var isTruncated = await pipe([
            () => ({ Bucket }),
            s3().listObjectVersions,
            tap((result) => {
              logger.debug(`listObjectVersions: ${tos({ result })}`);
            }),
            tap(
              switchCase([
                pipe([get("Versions"), not(isEmpty)]),
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
                pipe([get("DeleteMarkers"), not(isEmpty)]),
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
            get("IsTruncated"),
            tap((IsTruncated) => {
              logger.debug(`listObjectVersions IsTruncated: ${IsTruncated}`);
            }),
          ])();
        } while (isTruncated);
      }, throwIfNotAwsError("NoSuchBucket")),
      tryCatch(
        () => s3().deleteBucket({ Bucket }),
        throwIfNotAwsError("NoSuchBucket")
      ),
      tap(() => {
        logger.info(`destroyed s3 bucket ${tos({ Bucket })}`);
      }),
    ])();

  const configDefault = ({ name, properties }) =>
    defaultsDeep({ Bucket: name })(properties);

  return {
    spec,
    config: clientConfig,
    findNamespace,
    findId,
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
  };
};
