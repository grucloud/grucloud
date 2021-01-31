const assert = require("assert");
const AWS = require("aws-sdk");
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

const logger = require("../../../logger")({ prefix: "AwsDistribution" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const {
  CloudFrontNew,
  buildTags,
  findNameInTags,
  getNewCallerReference,
} = require("../AwsCommon");
const { getField } = require("../../ProviderCommon");

const RESOURCE_TYPE = "CloudFrontDistribution";
const findName = findNameInTags;
const findId = get("Id");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.AwsDistribution = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const cloudfront = CloudFrontNew(config);

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
      ({ id }) => cloudfront().getDistribution({ Id: id }),
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

  const isUpById = isUpByIdCore({
    isInstanceUp: eq(get("Distribution.Status"), "Deployed"),
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
        logger.debug(`create distribution: ${name}, ${tos(payload)}`);
      }),
      () =>
        cloudfront().createDistributionWithTags({
          DistributionConfigWithTags: {
            DistributionConfig: payload,
            Tags: { Items: buildTags({ name, config }) },
          },
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
        assert(id, "id");
      }),
      () => cloudfront().getDistributionConfig({ Id: id }),
      (config) =>
        pipe([
          get("DistributionConfig"),
          (distributionConfig) =>
            defaultsDeep(distributionConfig)(
              omit(["CallerReference", "Origin"])(payload)
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
        ])(config),
      () =>
        retryCall({
          name: `distribution isUpById : ${name} id: ${id}`,
          fn: () => isUpById({ id }),
          config: { retryCount: 6 * 60, retryDelay: 10e3 },
        }),
      tap(() => {
        logger.info(`distribution updated: ${tos({ name, id })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteDistribution-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.info(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        update({
          id,
          name,
          payload: {
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
        }),
      ({ ETag }) =>
        retryCall({
          name: `deleteDistribution: ${name} id: ${id}`,
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
        logger.info(`distribution destroyed, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({
    name,
    properties,
    dependencies: { certificate },
  }) =>
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
    })(properties);

  const onDeployed = ({ resultCreate, lives }) =>
    pipe([
      tap(() => {
        logger.debug(`onDeployed ${tos({ resultCreate, lives })}`);
      }),
      () => find(eq(get("type"), RESOURCE_TYPE))(lives.results),
      get("results.items"),
      tap((distributions) => {
        logger.info(`onDeployed ${tos({ distributions })}`);
      }),
      map((distribution) =>
        pipe([
          get("Origins.Items"),
          flatMap(({ Id, OriginPath }) =>
            findS3ObjectUpdated({ plans: resultCreate.plans, Id, OriginPath })
          ),
          tap((Items) => {
            logger.info(`distribution Items ${tos({ Items })}`);
          }),
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
        ])(distribution)
      ),
    ])();

  return {
    type: RESOURCE_TYPE,
    spec,
    isUpById,
    isDownById,
    findId,
    getByName,
    getById,
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

exports.compareDistribution = async ({ target, live, dependencies }) =>
  pipe([
    omit(["CallerReference", "ViewerCertificate.CloudFrontDefaultCertificate"]),
    tap((targetFiltered) => {
      logger.debug(`compareDistribution diff:${tos(targetFiltered)}`);
    }),
    (targetFiltered) => detailedDiff(live, targetFiltered),
    tap((diff) => {
      logger.debug(`compareDistribution diff:${tos(diff)}`);
    }),
  ])(target);

const findS3ObjectUpdated = ({ plans, Id, OriginPath }) =>
  pipe([
    tap(() => {
      logger.debug(`findS3ObjectUpdated ${tos({ Id })}`);
    }),
    filter(
      and([
        eq(get("resource.type"), "S3Object"),
        eq(get("action"), "UPDATE"),
        eq((plan) => `S3-${plan.live.Bucket}`, Id),
      ])
    ),
    pluck("live.Key"),
    map((key) => `${OriginPath}/${key}`),
    tap((results) => {
      logger.debug(`findS3ObjectUpdated ${tos({ results })}`);
    }),
  ])(plans);
