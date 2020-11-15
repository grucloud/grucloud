const assert = require("assert");
const AWS = require("aws-sdk");
const {
  map,
  pipe,
  tap,
  tryCatch,
  get,
  switchCase,
  pick,
  filter,
  omit,
} = require("rubico");
const { defaultsDeep, isEmpty, forEach, pluck, flatten } = require("rubico/x");

const logger = require("../../../logger")({ prefix: "AwsDistribution" });
const { retryExpectOk, retryCall } = require("../../Retry");
const { tos } = require("../../../tos");
const { getByNameCore, isUpByIdCore, isDownByIdCore } = require("../../Common");
const { buildTags, findNameInTags } = require("../AwsCommon");

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
        logger.debug(`getList distributions ${tos(params)}`);
      }),
      () => cloudfront.listDistributions(params).promise(),
      get("DistributionList.Items"),
      tap((xxx) => {
        logger.debug(`getList ${tos(xxx)}`);
      }),
      map(async (distribution) => ({
        ...distribution,
        Tags: await pipe([
          () =>
            cloudfront
              .listTagsForResource({
                Resource: distribution.ARN,
              })
              .promise(),
          tap((xxx) => {
            logger.debug(`getList tags ${tos(xxx)}`);
          }),
          get("Tags.Items"),
        ])(),
      })),
      (distributions) => ({
        total: distributions.length,
        items: distributions,
      }),
      tap((distributions) => {
        logger.debug(`getList distributions result: ${tos(distributions)}`);
      }),
    ])();

  const getByName = ({ name }) => getByNameCore({ name, getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getDistribution-property
  const getById = pipe([
    tap(({ id }) => {
      logger.debug(`getById ${id}`);
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

  const isUpById = isUpByIdCore({ getById });
  const isDownById = isDownByIdCore({ getById });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createDistributionWithTags-property
  const create = async ({ name, payload = {} }) =>
    pipe([
      tap(() => {
        assert(name);
        assert(payload);
        logger.info(`create distribution: ${name}, ${tos(payload)}`);
      }),
      () => cloudfront.createDistributionWithTags(payload).promise(),
      tap((result) => {
        logger.debug(`created distribution: ${name}, result: ${tos(result)}`);
      }),
      tap((result) => {
        logger.debug(`created done`);
      }),
    ])();

  const update = ({ name, id, payload }) =>
    pipe([
      tap(() => {
        logger.debug(`update ${tos({ id })}`);
      }),
      () => cloudfront.getDistributionConfig({ Id: id }).promise(),
      (config) =>
        pipe([
          get("DistributionConfig"),
          tap((xxx) => {
            logger.debug(`update `);
          }),
          (distributionConfig) =>
            defaultsDeep(distributionConfig)(payload.DistributionConfig),
          tap((distributionConfig) => {
            logger.debug(`update `);
          }),
          (DistributionConfig) =>
            cloudfront
              .updateDistribution({
                Id: id,
                IfMatch: config.ETag,
                DistributionConfig,
              })
              .promise(),
          tap((xxx) => {
            logger.debug(`update `);
          }),
        ])(config),
      () =>
        retryCall({
          name: `distribution is deployed ? : id: ${id}`,
          fn: () => cloudfront.getDistribution({ Id: id }).promise(),
          isExpectedResult: (result) => ["Deployed"].includes(result.Status),
          retryCount: 6 * 60,
          retryDelay: 10e3,
        }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteDistribution-property
  const destroy = async ({ id, name }) =>
    pipe([
      tap(() => {
        logger.debug(`destroy ${tos({ name, id })}`);
        assert(!isEmpty(id), `destroy invalid id`);
      }),
      () =>
        update({
          id,
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
      tap((xxx) => {
        logger.debug(`destroy`);
      }),
      ,
      tap((xxx) => {
        logger.debug(`destroy`);
      }),
      ({ ETag }) =>
        cloudfront
          .deleteDistribution({
            Id: id,
            IfMatch: ETag,
          })
          .promise(),
      tap(() =>
        retryExpectOk({
          name: `isDownById: ${name} id: ${id}`,
          fn: () => isDownById({ id }),
          config,
        })
      ),
      tap(() => {
        logger.debug(`destroy done, ${tos({ name, id })}`);
      }),
    ])();

  const configDefault = async ({ name, properties, dependencies }) =>
    defaultsDeep({
      DistributionConfigWithTags: {
        DistributionConfig: {
          CallerReference: `grucloud-${new Date()}`,
          Enabled: true,
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
    cannotBeDeleted: () => false,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
