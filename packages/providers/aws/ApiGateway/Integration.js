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
const { pluck, defaultsDeep, size } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const logger = require("@grucloud/core/logger")({
  prefix: "Integration",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const {
  createEndpoint,
  shouldRetryOnException,
  tagsExtractFromDescription,
  tagsRemoveFromDescription,
  findNameInTags,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildPayloadDescriptionTags } = require("./ApiGatewayCommon");

const findId = get("live.IntegrationId");
const findName = findNameInTags;

exports.Integration = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "ApiGatewayV2" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Api",
      group: "apigateway",
      ids: [live.ApiId],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getIntegrations-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList integration`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Api",
          group: "apigateway",
        }),
      pluck("id"),
      flatMap((ApiId) =>
        tryCatch(
          pipe([
            () => apiGateway().getIntegrations({ ApiId }),
            get("Items"),
            map(defaultsDeep({ ApiId })),
            map(
              assign({
                Tags: tagsExtractFromDescription,
                Description: tagsRemoveFromDescription,
              })
            ),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
      (items = []) => ({
        total: size(items),
        items,
      }),
      tap(({ total }) => {
        logger.info(`getList integration #total: ${total}`);
      }),
    ])();

  //const isUpByName = pipe([getByName, not(isEmpty)]);
  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createIntegration-property
  const create = ({ name, payload }) =>
    pipe([
      tap(() => {
        logger.info(`create integration: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      buildPayloadDescriptionTags,
      apiGateway().createIntegration,
      tap(() => {
        logger.info(`created integration ${name}`);
      }),
    ])();

  const update = ({ name, payload, diff, live }) =>
    pipe([
      tap(() => {
        logger.info(`update integration: ${name}`);
        logger.debug(tos({ payload, diff, live }));
      }),
      () => payload,
      apiGateway().updateIntegration,
      tap(() => {
        logger.info(`updated integration ${name}`);
      }),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteIntegration-property
  const destroy = ({ live }) =>
    pipe([
      () => live,
      pick(["ApiId", "IntegrationId"]),
      tap((params) => {
        logger.info(`destroy integration ${JSON.stringify({ params })}`);
        assert(live.ApiId);
        assert(live.IntegrationId);
      }),
      tap(apiGateway().deleteIntegration),
      tap((params) => {
        logger.debug(`destroyed integration ${JSON.stringify({ params })}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { api, lambdaFunction },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        ApiId: getField(api, "ApiId"),
        ...(lambdaFunction && {
          IntegrationUri: getField(lambdaFunction, "FunctionArn"),
        }),
        Tags: buildTagsObject({ name, namespace, config, userTags: Tags }),
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

exports.compareIntegration = pipe([
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
    logger.debug(`compareIntegration ${tos(diff)}`);
  }),
]);
