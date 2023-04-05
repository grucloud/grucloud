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
  isIn,
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

const rejectPrefixes = ["appstream" /*"cf-template"*/];

const managedByOther =
  () =>
  ({ Name }) =>
    pipe([
      tap((params) => {
        assert(Name);
      }),
      () => rejectPrefixes,
      any((prefix) => Name.startsWith(prefix)),
    ])();

const putBucketEncryption = ({
  endpoint,
  Bucket,
  ServerSideEncryptionConfiguration,
}) =>
  tap.if(
    get("ServerSideEncryptionConfiguration"),
    pipe([
      () => ({
        Bucket,
        ServerSideEncryptionConfiguration,
      }),
      endpoint().putBucketEncryption,
    ])
  );

const putBucketNotificationConfiguration = ({
  endpoint,
  Bucket,
  NotificationConfiguration,
}) =>
  tap.if(
    get("NotificationConfiguration"),
    pipe([
      () => ({
        Bucket,
        NotificationConfiguration,
      }),
      endpoint().putBucketNotificationConfiguration,
    ])
  );

const putBucketPolicy = ({ endpoint, Bucket, Policy }) =>
  tap.if(
    get("Policy"),
    pipe([
      fork({ Policy: pipe([() => Policy, JSON.stringify]) }),
      defaultsDeep({ Bucket }),
      endpoint().putBucketPolicy,
    ])
  );

const putBucketVersioning = ({ endpoint, Bucket, VersioningConfiguration }) =>
  tap.if(
    get("VersioningConfiguration"),
    pipe([
      () => ({
        Bucket,
        VersioningConfiguration,
      }),
      endpoint().putBucketVersioning,
    ])
  );

const putPublicAccessBlockConfiguration = ({
  endpoint,
  Bucket,
  PublicAccessBlockConfiguration = {
    BlockPublicAcls: true,
    BlockPublicPolicy: true,
    IgnorePublicAcls: true,
    RestrictPublicBuckets: true,
  },
}) =>
  pipe([
    () => ({
      Bucket,
      PublicAccessBlockConfiguration,
    }),
    endpoint().putPublicAccessBlock,
  ]);

const getPublicAccessBlock = ({ endpoint }) =>
  tryCatch(
    pipe([
      endpoint().getPublicAccessBlock,
      get("PublicAccessBlockConfiguration"),
      when(isEmpty, () => undefined),
    ]),
    (error) => undefined
  );

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html
exports.AwsS3Bucket = ({ spec, config }) => {
  const s3 = createS3(config);

  const clientConfig = { ...config, retryDelay: 2000, repeatCount: 5 };

  const findName = () => get("Name");
  const findId = findName;
  const findNamespace = findNamespaceInTags;

  const getAccelerateConfiguration = ({}) =>
    tryCatch(
      pipe([
        s3().getBucketAccelerateConfiguration,
        when(isEmpty, () => undefined),
      ]),
      (error) => {
        throw error;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketAcl-property
  const getACL = ({}) =>
    tryCatch(
      pipe([
        s3().getBucketAcl,
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
  const getCORSConfiguration = ({}) =>
    tryCatch(
      pipe([s3().getBucketCors]),
      throwIfNotAwsError("NoSuchCORSConfiguration")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketEncryption-property
  const getServerSideEncryptionConfiguration = ({}) =>
    tryCatch(
      pipe([
        s3().getBucketEncryption,
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
  const getLifecycleConfiguration = ({}) =>
    tryCatch(
      pipe([
        s3().getBucketLifecycleConfiguration,
        when(isEmpty, () => undefined),
      ]),
      throwIfNotAwsError("NoSuchLifecycleConfiguration")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLocation-property
  const getLocationConstraint = ({}) =>
    tryCatch(
      pipe([s3().getBucketLocation, get("LocationConstraint")]),
      (error) => {
        throw error;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketLogging-property
  const getBucketLoggingStatus = ({}) =>
    tryCatch(
      pipe([
        s3().getBucketLogging,
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
  const getNotificationConfiguration = ({}) =>
    tryCatch(
      pipe([
        s3().getBucketNotificationConfiguration,
        when(isEmpty, () => undefined),
      ]),
      (error) => {
        throw error;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicy-property
  const getPolicy = ({}) =>
    tryCatch(
      pipe([
        s3().getBucketPolicy,
        get("Policy"),
        tryCatch(JSON.parse, () => undefined),
      ]),
      throwIfNotAwsError("NoSuchBucketPolicy")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketPolicyStatus-property
  const getPolicyStatus = ({}) =>
    tryCatch(
      pipe([s3().getBucketPolicyStatus, get("PolicyStatus")]),
      throwIfNotAwsError("NoSuchBucketPolicy")
    );
  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketReplication-property
  const getReplicationConfiguration = ({}) =>
    tryCatch(
      pipe([s3().getBucketReplication, get("ReplicationConfiguration")]),
      throwIfNotAwsError("ReplicationConfigurationNotFoundError")
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketRequestPayment-property
  const getRequestPaymentConfiguration = ({}) =>
    tryCatch(
      pipe([
        s3().getBucketRequestPayment,
        when(eq(get("Payer"), "BucketOwner"), () => undefined),
      ]),
      (err) => {
        throw err;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketVersioning-property
  const getVersioningConfiguration = ({ name }) =>
    tryCatch(
      pipe([
        tap((input) => {
          assert(name);
        }),
        s3().getBucketVersioning,
        omitIfEmpty(["MFADelete"]),
        when(isEmpty, () => undefined),
      ]),
      (err) => {
        throw err;
      }
    );
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getBucketWebsite-property
  const getWebsiteConfiguration = ({}) =>
    tryCatch(
      pipe([s3().getBucketWebsite, when(isEmpty, () => undefined)]),
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
              () => params,
              s3().getBucketTagging,
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
              fn: pipe([
                () => params,
                fork({
                  Name: () => name,
                  Arn: () => `arn:aws:s3:::${name}`,
                  ...(getTags && { Tags: getBucketTagging(params) }),
                  ...(deep && {
                    AccelerateConfiguration: getAccelerateConfiguration({
                      name,
                      params,
                    }),
                    ACL: getACL({ name }),
                    CORSConfiguration: getCORSConfiguration({ name }),
                    ServerSideEncryptionConfiguration:
                      getServerSideEncryptionConfiguration({ name }),
                    LocationConstraint: getLocationConstraint({ name }),
                    BucketLoggingStatus: getBucketLoggingStatus({
                      name,
                    }),
                    NotificationConfiguration: getNotificationConfiguration({
                      name,
                    }),
                    Policy: getPolicy({ name, params }),
                    PublicAccessBlockConfiguration: getPublicAccessBlock({
                      endpoint: s3,
                    }),
                    PolicyStatus: getPolicyStatus({ name, params }),
                    ReplicationConfiguration: getReplicationConfiguration({
                      name,
                    }),
                    RequestPaymentConfiguration: getRequestPaymentConfiguration(
                      {
                        name,
                      }
                    ),
                    VersioningConfiguration: getVersioningConfiguration({
                      name,
                    }),
                    LifecycleConfiguration: getLifecycleConfiguration({
                      name,
                    }),
                    WebsiteConfiguration: getWebsiteConfiguration({
                      name,
                    }),
                  }),
                }),
              ]),
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
  const updateProperties = ({
    Bucket,
    Policy,
    NotificationConfiguration,
    ServerSideEncryptionConfiguration,
    VersioningConfiguration,
    PublicAccessBlockConfiguration,
  }) =>
    pipe([
      tap((params) => {
        assert(Bucket);
      }),
      putBucketEncryption({
        endpoint: s3,
        Bucket,
        ServerSideEncryptionConfiguration,
      }),
      putBucketNotificationConfiguration({
        endpoint: s3,
        Bucket,
        NotificationConfiguration,
      }),
      putBucketPolicy({
        endpoint: s3,
        Bucket,
        Policy,
      }),
      putBucketVersioning({
        endpoint: s3,
        Bucket,
        VersioningConfiguration,
      }),
      putPublicAccessBlockConfiguration({
        endpoint,
        Bucket,
        PublicAccessBlockConfiguration,
      }),
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
      PublicAccessBlockConfiguration = {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true,
      },
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

          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketVersioning-property
          // Must be before replication configuration:
          // "Versioning must be 'Enabled' on the bucket to apply a replication configuration"
          if (VersioningConfiguration) {
            await s3().putBucketVersioning({ Bucket, VersioningConfiguration });
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
            await retryCall({
              name: `putBucketNotificationConfiguration ${Bucket}`,
              fn: pipe([
                () => ({
                  Bucket,
                  NotificationConfiguration,
                }),
                s3().putBucketNotificationConfiguration,
              ]),
              shouldRetryOnException: ({ error, name }) =>
                pipe([
                  () => [
                    "Unable to validate the following destination configurations",
                  ],
                  any(isIn(error.message)),
                ])(),
              config: { retryCount: 12, retryDelay: 5e3 },
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

          // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketWebsite-property
          if (WebsiteConfiguration) {
            logger.debug(
              `putBucketWebsite ${Bucket}: ${tos(WebsiteConfiguration)}`
            );
            await s3().putBucketWebsite({ Bucket, WebsiteConfiguration });
          }
          await putPublicAccessBlockConfiguration({
            endpoint: s3,
            Bucket,
            PublicAccessBlockConfiguration,
          })();
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
      () => diff.liveDiff.deleted,
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
      () =>
        retryCall({
          name: `deleteBucket ${Bucket}`,
          fn: pipe([() => ({ Bucket }), s3().deleteBucket]),
          isExpectedException: isAwsError("NoSuchBucket"),
          shouldRetryOnException: ({ error, name }) =>
            pipe([
              () => error,
              get("message"),
              (message) =>
                pipe([
                  () => [
                    "Bucket has access points attached and cannot be deleted",
                  ],
                  any(isIn(message)),
                ])(),
            ])(),
          config: { retryCount: 12, retryDelay: 5e3 },
        }),
      tap(() => {
        logger.info(`destroyed s3 bucket ${tos({ Bucket })}`);
      }),
    ])();

  const configDefault = ({ name, properties, config }) =>
    defaultsDeep({ Bucket: name })(properties);

  return {
    spec,
    config: clientConfig,
    managedByOther,
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
