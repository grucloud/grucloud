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
  buildTags,
  findNameInTagsOrId,
  findNamespaceInTags,
  getNewCallerReference,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const {
  createCloudFront,
  tagResource,
  untagResource,
} = require("./CloudFrontCommon");

const ignoreErrorCodes = ["NoSuchDistribution"];
//TODO look in spec.type instead
const RESOURCE_TYPE = "Distribution";
const findId = get("live.Id");
const findName = findNameInTagsOrId({ findId });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html
exports.CloudFrontDistribution = ({ spec, config }) => {
  const cloudFront = createCloudFront(config);
  const client = AwsClient({ spec, config })(cloudFront);
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
  const getList = client.getList({
    method: "listDistributions",
    getParam: "DistributionList.Items",
    decorate: () => (distribution) =>
      pipe([
        tap((params) => {
          assert(distribution.ARN);
        }),
        () => distribution,
        pickId,
        cloudFront().getDistributionConfig,
        get("DistributionConfig"),
        assign({
          Tags: pipe([
            () => ({
              Resource: distribution.ARN,
            }),
            cloudFront().listTagsForResource,
            get("Tags.Items"),
          ]),
        }),
        defaultsDeep(distribution),
      ])(),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudFront.html#getDistribution-property
  const pickId = pipe([
    tap((params) => {
      assert(true);
    }),
    pick(["Id"]),
    tap(({ Id }) => {
      assert(Id);
    }),
  ]);

  const getById = client.getById({
    pickId,
    method: "getDistribution",
    getField: "Distribution",
    ignoreErrorCodes,
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
    shouldRetryOnExceptionCodes: ["InvalidViewerCertificate"],
    pickCreated: () => get("Distribution"),
    getById,
  });

  // TODO update
  const update = ({ name, id, payload }) =>
    pipe([
      tap(() => {
        logger.info(`update distribution ${tos({ name, id })}`);
        logger.debug(tos({ payload }));
        assert(id, "id");
      }),

      () => ({ Id: id }),
      cloudFront().getDistributionConfig,
      (config) =>
        pipe([
          () => config,
          get("DistributionConfig"),
          (distributionConfig) =>
            defaultsDeep(distributionConfig)(
              omit(["CallerReference", "Origin"])(payload.DistributionConfig)
            ),
          (DistributionConfig) => ({
            Id: id,
            IfMatch: config.ETag,
            DistributionConfig,
          }),
          tap((params) => {
            assert(true);
          }),
          cloudFront().updateDistribution,
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
        cloudFront().getDistributionConfig,
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
                ...live,
                Enabled: false,
                CallerReference: getNewCallerReference(),
              },
            },
          }),
      ])(),
    method: "deleteDistribution",
    isExpectedResult: () => true,
    shouldRetryOnExceptionCodes: ["DistributionNotDisabled"],
    getById,
    ignoreErrorCodes,
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
            //CloudFrontDefaultCertificate: false,
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
              cloudFront().createInvalidation,
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
    tagResource: tagResource({ cloudFront }),
    untagResource: untagResource({ cloudFront }),
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
