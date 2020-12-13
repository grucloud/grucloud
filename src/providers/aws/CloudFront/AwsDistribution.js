const assert = require("assert");
const AWS = require("aws-sdk");
const {
  map,
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
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("../../../logger")({ prefix: "AwsDistribution" });
const { retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { buildTags, findNameInTags } = require("../AwsCommon");
const { getField } = require("../../ProviderCommon");

const findName = findNameInTags;
const findId = get("Id");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.AwsDistribution = ({ spec, config }) => {
  assert(spec);
  assert(config);

  const cloudfront = new AWS.CloudFront();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listDistributions-property
  const getList = async ({ params } = {}) =>
    pipe([
      tap(() => {
        logger.info(`getList distributions ${tos(params)}`);
      }),
      () => cloudfront.listDistributions(params).promise(),
      get("DistributionList.Items"),
      map(
        assign({
          Tags: pipe([
            (distribution) =>
              cloudfront
                .listTagsForResource({
                  Resource: distribution.ARN,
                })
                .promise(),
            get("Tags.Items"),
          ]),
        })
      ),
      (distributions) => ({
        total: distributions.length,
        items: distributions,
      }),
      tap((distributions) => {
        logger.info(`getList #distributions ${distributions.length}`);
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
      ({ id }) => cloudfront.getDistribution({ Id: id }).promise(),
      switchCase([
        (error) => error.code !== "NoSuchDistribution",
        (error) => {
          logger.debug(`getById error: ${tos(error)}`);
          throw error;
        },
        (error, { id }) => {
          logger.debug(`getById ${id} ResourceNotFoundException`);
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
      () => cloudfront.createDistributionWithTags(payload).promise(),
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
        assert(payload.DistributionConfigWithTags);
      }),
      () => cloudfront.getDistributionConfig({ Id: id }).promise(),
      (config) =>
        pipe([
          get("DistributionConfig"),
          (distributionConfig) =>
            defaultsDeep(distributionConfig)(
              omit(["CallerReference", "Origin"])(
                payload.DistributionConfigWithTags.DistributionConfig
              )
            ),
          (DistributionConfig) =>
            cloudfront
              .updateDistribution({
                Id: id,
                IfMatch: config.ETag,
                DistributionConfig,
              })
              .promise(),
          tap((xxx) => {
            logger.debug(`updated distribution ${tos({ name, id })}`);
          }),
        ])(config),
      () =>
        retryCall({
          name: `is distribution  updated ? : ${name} id: ${id}`,
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
            DistributionConfigWithTags: {
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
          },
        }),
      ({ ETag }) =>
        cloudfront
          .deleteDistribution({
            Id: id,
            IfMatch: ETag,
          })
          .promise(),
      tap(() =>
        retryCall({
          name: `isDownById: ${name} id: ${id}`,
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
      DistributionConfigWithTags: {
        DistributionConfig: {
          CallerReference: `grucloud-${new Date()}`,
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
        },
        Tags: { Items: buildTags({ name, config }) },
      },
    })(properties);

  return {
    type: "CloudFrontDistribution",
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
    shouldRetryOnException: pipe([
      tap((error) => {
        logger.info(`distribution shouldRetryOnException ${tos(error)}`);
      }),
      or([
        not(eq(get("statusCode"), 400)),
        eq(get("code"), "InvalidViewerCertificate"),
      ]),
      tap((result) => {
        logger.info(
          `distribution shouldRetryOnException result: ${tos(result)}`
        );
      }),
    ]),
  };
};
//TODO omit with deep keys
exports.compareDistribution = async ({ target, live, dependencies }) =>
  pipe([
    () =>
      pipe([
        get("DistributionConfigWithTags.DistributionConfig"),
        omit(["CallerReference"]),
      ])(target),
    (targetFiltered) => ({
      ...targetFiltered,
      ViewerCertificate: omit(["CloudFrontDefaultCertificate"])(
        targetFiltered.ViewerCertificate
      ),
    }),
    tap((targetFiltered) => {
      logger.debug(`compareDistribution diff:${tos(targetFiltered)}`);
    }),
    (targetFiltered) => detailedDiff(live, targetFiltered),
    tap((diff) => {
      logger.debug(`compareDistribution diff:${tos(diff)}`);
    }),
  ])();
