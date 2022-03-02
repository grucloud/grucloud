const assert = require("assert");
const {
  map,
  flatMap,
  pipe,
  tap,
  get,
  pick,
  assign,
  eq,
  or,
  not,
  filter,
  omit,
  and,
} = require("rubico");
const {
  find,
  defaultsDeep,
  isEmpty,
  pluck,
  callProp,
  last,
  includes,
} = require("rubico/x");

const { AwsClient } = require("../AwsClient");

const logger = require("@grucloud/core/logger")({
  prefix: "CloudFrontDistribution",
});
const { retryCall } = require("@grucloud/core/Retry");
const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  CloudFrontNew,
  buildTags,
  findNameInTagsOrId,
  findNamespaceInTags,
  getNewCallerReference,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

//TODO look in spec.type instead
const RESOURCE_TYPE = "Distribution";
const findId = get("live.Id");
const findName = findNameInTagsOrId({ findId });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontDistribution = ({ spec, config }) => {
  const cloudfront = CloudFrontNew(config);
  const client = AwsClient({ spec, config });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Certificate",
      group: "ACM",
      ids: pipe([
        () => live,
        get("ViewerCertificate.ACMCertificateArn"),
        (arn) => [arn],
      ])(),
    },
    {
      type: "Bucket",
      group: "S3",
      ids: pipe([
        () => live,
        get("Origins.Items", []),
        pluck("DomainName"),
        map((domainName) =>
          pipe([
            () =>
              lives.getByType({
                type: "Bucket",
                group: "S3",
                providerName: config.providerName,
              }),
            find(({ id }) => pipe([() => domainName, includes(id)])()),
            get("id"),
          ])()
        ),
      ])(),
    },
    {
      type: "OriginAccessIdentity",
      group: "CloudFront",
      ids: pipe([
        () => live,
        get("Origins.Items", []),
        pluck("S3OriginConfig"),
        pluck("OriginAccessIdentity"),
        map(
          pipe([
            callProp("split", "/"),
            last,
            (id) =>
              lives.getById({
                id,
                type: "OriginAccessIdentity",
                group: "CloudFront",
                providerName: config.providerName,
              }),
            get("id"),
          ])
        ),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#listDistributions-property
  //TODO
  const getList = ({ params } = {}) =>
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
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getDistribution-property
  const pickId = pick(["Id"]);

  const getById = client.getById({
    pickId,
    method: "getDistribution",
    getField: "Distribution",
    ignoreErrorCodes: ["NoSuchDistribution"],
  });

  const isInstanceUp = eq(get("Status"), "Deployed");
  const isUpById = pipe([getById, isInstanceUp]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#createDistributionWithTags-property

  const create = client.create({
    method: "createDistributionWithTags",
    filterPayload: (payload) => ({
      DistributionConfigWithTags: payload,
    }),
    isInstanceUp,
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
        () => error,
        eq(get("code"), "InvalidViewerCertificate"),
        tap((retry) => {
          logger.info(
            `createDistributionWithTags shouldRetryOnException retry: ${retry}`
          );
        }),
      ])(),
    pickCreated: () => (result) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        () => result,
      ])(),
    pickId,
    getById,
    config,
  });

  // TODO update
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
          fn: () => isUpById({ Id: id }),
          config: { retryCount: 6 * 60, retryDelay: 10e3 },
        })
      ),
      tap(() => {
        logger.info(`distribution updated: ${tos({ name, id })}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#deleteDistribution-property
  const destroy = client.destroy({
    pickId: (live) =>
      pipe([
        tap(() => {
          assert(live.Id);
        }),
        () => live,
        pickId,
        cloudfront().getDistributionConfig,
        tap(({ ETag }) => {
          assert(ETag);
        }),
        ({ ETag }) => ({ IfMatch: ETag, Id: live.Id }),
      ])(),
    preDestroy: ({ name, live }) =>
      pipe([
        () =>
          update({
            id: live.Id,
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
      ])(),
    method: "deleteDistribution",
    isExpectedResult: () => true,
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
        () => error,
        eq(get("code"), "DistributionNotDisabled"),
        tap((result) => {
          logger.info(
            `deleteDistribution shouldRetryOnException result: ${result}`
          );
        }),
      ])(),
    getById,
    ignoreErrorCodes: ["NoSuchDistribution"],
    config,
  });

  //TODO Tags
  const configDefault = ({
    name,
    properties: { Tags, ...otherProps },
    namespace,
    dependencies: { certificate },
  }) =>
    pipe([
      () => otherProps,
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
        Tags: { Items: buildTags({ name, namespace, config, UserTags: Tags }) },
      }),
    ])();

  const onDeployed = ({ resultCreate, lives }) =>
    pipe([
      tap(() => {
        logger.info(`onDeployed`);
        //logger.debug(`onDeployed ${tos({ resultCreate })}`);
        assert(resultCreate);
        assert(lives);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: RESOURCE_TYPE,
          group: "CloudFront",
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
              cloudfront().createInvalidation,
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
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    onDeployed,
    //TODO
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
