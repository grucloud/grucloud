const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  not,
  assign,
  filter,
  omit,
  tryCatch,
  switchCase,
  pick,
  flatMap,
} = require("rubico");
const { isEmpty, callProp, defaultsDeep, size } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");

const logger = require("@grucloud/core/logger")({
  prefix: "ApiMapping",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  createEndpoint,
  shouldRetryOnException,
  findNameInTagsOrId,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.ApiMappingId");
const findName = findNameInTagsOrId({ findId });

const domainNameArn = ({ config, DomainName }) =>
  `arn:aws:apigateway:${config.region}::/domainnames/${DomainName}`;

const buildTagKey = ({ ApiMappingId }) => `gc-api-mapping-${ApiMappingId}`;

exports.ApiMapping = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "ApiGatewayV2" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Api",
      group: "apiGatewayV2",
      ids: [live.ApiId],
    },
    {
      type: "DomainName",
      group: "apiGatewayV2",
      ids: [live.DomainName],
    },
    {
      type: "Stage",
      group: "apiGatewayV2",
      ids: [live.Stage],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApiMappings-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList apiMapping`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "DomainName",
          group: "apiGatewayV2",
        }),
      flatMap(({ live }) =>
        tryCatch(
          pipe([
            () => apiGateway().getApiMappings({ DomainName: live.DomainName }),
            get("Items"),
            map(defaultsDeep({ DomainName: live.DomainName })),
            map(
              assign({
                Tags: ({ ApiMappingId }) =>
                  pipe([
                    () =>
                      apiGateway().getTags({
                        ResourceArn: domainNameArn({
                          config,
                          DomainName: live.DomainName,
                        }),
                      }),
                    get("Tags"),
                    assign({ Name: get(buildTagKey({ ApiMappingId })) }),
                    omit([buildTagKey({ ApiMappingId })]),
                  ])(),
              })
            ),
          ]),
          (error) =>
            pipe([
              tap(() => {
                logger.error(
                  `error getList api mapping: ${tos({ live, error })}`
                );
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
    ])();

  //const isUpByName = pipe([getByName, not(isEmpty)]);
  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApiMapping-property
  const create = ({
    name,
    payload,
    resolvedDependencies: { api, domainName },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create apiMapping: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      apiGateway().createApiMapping,
      tap((result) => {
        logger.info(`created apiMapping ${name}`);
      }),
      pipe([
        ({ ApiMappingId }) => ({
          ResourceArn: domainNameArn({
            config,
            DomainName: domainName.live.DomainName,
          }),
          Tags: { ...api.live.Tags, [buildTagKey({ ApiMappingId })]: name },
        }),
        apiGateway().tagResource,
      ]),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update apiMapping: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      defaultsDeep(pick(["ApiId", "ApiMappingId", "DomainName"])(live)),
      apiGateway().updateApiMapping,
      tap(() => {
        logger.info(`updated apiMapping ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteApiMapping-property

  //TODO untag resources
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pick(["ApiMappingId", "DomainName"]),
      tap((params) => {
        logger.info(`destroy apiMapping ${JSON.stringify(params)}`);
        assert(live.ApiMappingId);
        assert(live.DomainName);
      }),
      tap(apiGateway().deleteApiMapping),
      tap((params) => {
        logger.debug(`destroyed apiMapping ${JSON.stringify(params)}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { api, stage, domainName },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
        assert(domainName, "missing 'domainName' dependency");
        assert(stage, "missing 'stage' dependency");
      }),
      () => properties,
      defaultsDeep({
        ApiId: getField(api, "ApiId"),
        DomainName: getField(domainName, "DomainName"),
        Stage: getField(stage, "StageName"),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    shouldRetryOnException,
    findDependencies,
  };
};

const filterTarget = ({ target }) => pipe([() => target, omit(["Tags"])])();
const filterLive = ({ live }) => pipe([() => live, omit(["Tags"])])();

exports.compareApiMapping = pipe([
  assign({
    target: filterTarget,
    live: filterLive,
  }),
  ({ target, live }) => ({
    targetDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      tap((params) => {
        assert(true);
      }),
    ])(),
    liveDiff: pipe([
      () => detailedDiff(target, live),
      omit(["added", "deleted"]),
      tap((params) => {
        assert(true);
      }),
    ])(),
  }),
  tap((diff) => {
    logger.debug(`compareApiMapping ${tos(diff)}`);
  }),
]);
