const assert = require("assert");
const {
  map,
  flatMap,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  assign,
  eq,
  or,
  not,
  pick,
  filter,
  omit,
  and,
} = require("rubico");
const {
  find,
  defaultsDeep,
  isEmpty,
  forEach,
  pluck,
  flatten,
} = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({ prefix: "AwsDistribution" });
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const {
  getByNameCore,
  isUpByIdCore,
  isDownByIdCore,
} = require("@grucloud/core/Common");
const {
  CloudFrontNew,
  buildTags,
  findNameInTags,
  findNamespaceInTags,
  getNewCallerReference,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

//TODO look in spec.type instead
const RESOURCE_TYPE = "Distribution";
const findName = findNameInTags;
const findId = get("Id");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.AwsDistribution = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const cloudfront = CloudFrontNew(config);

  const findDependencies = ({ live }) => [
    {
      type: "Certificate",
      ids: pipe([
        () => live,
        get("ViewerCertificate.ACMCertificateArn"),
        (arn) => [arn],
        filter(not(isEmpty)),
        tap((xxx) => {
          assert(true);
        }),
      ])(),
    },
    {
      type: "S3Bucket",
      ids: pipe([
        () => live,
        get("Origins.Items", []),
        pluck("DomainName"),
        map((domainName) =>
          domainName.replace(new RegExp(".s3.amazonaws.com$"), "")
        ),
        filter(not(isEmpty)),
        tap((xxx) => {
          assert(true);
        }),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listDistributions-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList distributions`);
      }),
      () => cloudfront().listDistributions(params),
      get("DistributionList.Items"),
      map(async (distribution) => ({
        ...distribution,
        ...(await pipe([
          () => cloudfront().getDistributionConfig({ Id: distribution.Id }),
          get("DistributionConfig"),
        ])()),
        Tags: await pipe([
          (distribution) =>
            cloudfront().listTagsForResource({
              Resource: distribution.ARN,
            }),
          get("Tags.Items"),
        ])(distribution),
      })),
      (distributions) => ({
        total: distributions.length,
        items: distributions,
      }),
      tap((distributions) => {
        logger.info(`getList #distributions ${distributions.total}`);
        logger.debug(`getList distributions result: ${tos(distributions)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getDistribution-property
  const getById = pipe([
    tap(({ id }) => {
      logger.info(`getById ${id}`);
    }),
    tryCatch(
      pipe([
        ({ id }) => cloudfront().getDistribution({ Id: id }),
        get("Distribution"),
      ]),
      switchCase([
        eq(get("code"), "NoSuchDistribution"),
        (error, { id }) => {
          logger.debug(`getById ${id} NoSuchDistribution`);
        },
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
      ])
    ),
    tap((result) => {
      logger.debug(`getById result: ${tos(result)}`);
    }),
  ]);
  const isInstanceUp = eq(get("Status"), "Deployed");
  const isUpById = isUpByIdCore({
    isInstanceUp,
    getById,
  });

  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createDistributionWithTags-property
  const create = async ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create distribution: ${name}`);
        logger.debug(`${name} => ${tos(payload)}`);
      }),
      () =>
        retryCall({
          name: `createDistributionWithTags: ${name}`,
          fn: () =>
            cloudfront().createDistributionWithTags({
              DistributionConfigWithTags: payload,
            }),
          config: { retryCount: 10, repeatDelay: 5e3 },
          shouldRetryOnException: ({ error, name }) =>
            pipe([
              tap(() => {
                logger.info(
                  `createDistributionWithTags shouldRetryOnException ${tos({
                    name,
                    error,
                  })}`
                );
              }),
              eq(get("code"), "InvalidViewerCertificate"),
              tap((retry) => {
                logger.info(
                  `createDistributionWithTags shouldRetryOnException retry: ${retry}`
                );
              }),
            ])(error),
        }),
      tap((result) => {
        logger.debug(`created distribution: ${name}, result: ${tos(result)}`);
      }),
      findId,
      tap((id) =>
        retryCall({
          name: `is distribution ${name} deployed ? name: ${name}`,
          fn: () => isUpById({ id }),
          config: { retryCount: 6 * 60, retryDelay: 10e3 },
        })
      ),
      tap((id) => {
        logger.info(`distribution created: ${name}, id: ${id}`);
      }),
    ])();

  const update = ({ name, id, payload }) =>
    pipe([
      tap(() => {
        logger.info(`update distribution ${tos({ name, id })}`);
        logger.debug(tos({ payload }));
        assert(id, "id");
      }),
      () => cloudfront().getDistributionConfig({ Id: id }),
      (config) =>
        pipe([
          () => config,
          get("DistributionConfig"),
          (distributionConfig) =>
            defaultsDeep(distributionConfig)(
              omit(["CallerReference", "Origin"])(payload.DistributionConfig)
            ),
          (DistributionConfig) =>
            cloudfront().updateDistribution({
              Id: id,
              IfMatch: config.ETag,
              DistributionConfig,
            }),
          tap((xxx) => {
            logger.debug(`updated distribution ${tos({ name, id })}`);
          }),
        ])(),
      tap(() =>
        retryCall({
          name: `distribution isUpById : ${name} id: ${id}`,
          fn: () => isUpById({ id }),
          config: { retryCount: 6 * 60, retryDelay: 10e3 },
        })
      ),
      tap(() => {
        logger.info(`distribution updated: ${tos({ name, id })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteDistribution-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy distribution ${JSON.stringify({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        update({
          id,
          name,
          payload: {
            DistributionConfig: {
              Enabled: false,
              DefaultCacheBehavior: {
                ForwardedValues: {
                  QueryString: false,
                  Cookies: {
                    Forward: "none",
                  },
                  Headers: {
                    Quantity: 0,
                    Items: [],
                  },
                  QueryStringCacheKeys: {
                    Quantity: 0,
                    Items: [],
                  },
                },
                MinTTL: 60,
                DefaultTTL: 86400,
                MaxTTL: 31536000,
                CachePolicyId: "",
              },
            },
          },
        }),
      () => cloudfront().getDistributionConfig({ Id: id }),
      tap(({ ETag }) => {
        assert(ETag);
      }),
      ({ ETag }) =>
        retryCall({
          name: `deleteDistribution: ${name} id: ${id}, IfMatch:${ETag}`,
          fn: () =>
            cloudfront().deleteDistribution({
              Id: id,
              IfMatch: ETag,
            }),
          isExpectedResult: () => true,
          config,
          shouldRetryOnException: ({ error, name }) =>
            pipe([
              tap(() => {
                logger.info(
                  `deleteDistribution shouldRetryOnException ${tos({
                    name,
                    error,
                  })}`
                );
              }),
              eq(get("code"), "DistributionNotDisabled"),
              tap((result) => {
                logger.info(
                  `deleteDistribution shouldRetryOnException result: ${result}`
                );
              }),
            ])(error),
        }),
      tap(() =>
        retryCall({
          name: `distribution isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.info(`distribution destroyed, ${JSON.stringify({ name, id })}`);
      }),
    ])();

  const configDefault = async ({
    name,
    properties,
    namespace,
    dependencies: { certificate },
  }) =>
    pipe([
      () => properties,
      defaultsDeep({
        CallerReference: getNewCallerReference(),
        Enabled: true,
        ...(certificate && {
          ViewerCertificate: {
            ACMCertificateArn: getField(certificate, "CertificateArn"),
            SSLSupportMethod: "sni-only",
            MinimumProtocolVersion: "TLSv1.2_2019",
            Certificate: getField(certificate, "CertificateArn"),
            CertificateSource: "acm",
            CloudFrontDefaultCertificate: false,
          },
        }),
      }),
      (payload) => ({
        DistributionConfig: payload,
        Tags: { Items: buildTags({ name, namespace, config }) },
      }),
    ])();

  const onDeployed = ({ resultCreate, lives }) =>
    pipe([
      tap(() => {
        logger.info(`onDeployed`);
        logger.debug(`onDeployed ${tos({ resultCreate })}`);
        assert(resultCreate);
        assert(lives);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: RESOURCE_TYPE,
        }),
      tap((distributions) => {
        logger.info(`onDeployed ${tos({ distributions })}`);
      }),
      map((distribution) =>
        pipe([
          () => distribution,
          get("live.Origins.Items"),
          flatMap(({ Id, OriginPath }) =>
            findS3ObjectUpdated({ plans: resultCreate.results, Id, OriginPath })
          ),
          tap((Items) => {
            logger.info(`distribution Items ${tos({ Items })}`);
          }),
          tap.if(
            not(isEmpty),
            pipe([
              (Items) => ({
                DistributionId: distribution.Id,
                InvalidationBatch: {
                  CallerReference: getNewCallerReference(),
                  Paths: {
                    Quantity: Items.length,
                    Items,
                  },
                },
              }),
              tap((params) => {
                logger.info(`createInvalidation params ${tos({ params })}`);
              }),
              (params) => cloudfront().createInvalidation(params),
              tap((result) => {
                logger.info(`createInvalidation done ${tos({ result })}`);
              }),
            ])
          ),
        ])()
      ),
    ])();
  return {
    spec,
    findId,
    findDependencies,
    findNamespace: findNamespaceInTags(config),
    getByName,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    onDeployed,
    shouldRetryOnException: ({ name, error }) =>
      pipe([
        tap(() => {
          logger.info(
            `distribution shouldRetryOnException ${tos({ name, error })}`
          );
        }),
        or([
          not(eq(get("statusCode"), 400)),
          eq(get("code"), "InvalidViewerCertificate"),
        ]),
        tap((result) => {
          logger.info(
            `distribution shouldRetryOnException result: ${tos(result)}`
          );
        })(error),
      ]),
  };
};

const filterTarget = ({ config, target }) =>
  pipe([
    () => target,
    get("DistributionConfig"),
    omit(["CallerReference", "ViewerCertificate.CloudFrontDefaultCertificate"]),
  ])();

const filterLive = ({ config, live }) => pipe([() => live])();

exports.compareDistribution = pipe([
  tap((xxx) => {
    assert(true);
  }),
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(live, target),
      omit(["added", "deleted"]),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareDistribution ${tos(diff)}`);
  }),
]);

const findS3ObjectUpdated = ({ plans = [], Id, OriginPath }) =>
  pipe([
    tap(() => {
      assert(Id, "Id");
      logger.debug(
        `findS3ObjectUpdated ${tos({
          Id,
          OriginPath,
          plansSize: plans.length,
        })}`
      );
    }),
    () => plans,
    filter(
      and([
        eq(get("resource.type"), "S3Object"),
        eq(get("action"), "UPDATE"),
        eq((plan) => `S3-${plan.output.Bucket}`, Id),
      ])
    ),
    pluck("live.Key"),
    map((key) => `${OriginPath}/${key}`),
    tap((results) => {
      logger.debug(`findS3ObjectUpdated ${tos({ results })}`);
    }),
  ])();
