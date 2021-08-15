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
const { pluck, defaultsDeep, size, when, isEmpty } = require("rubico/x");
const { detailedDiff } = require("deep-object-diff");
const logger = require("@grucloud/core/logger")({
  prefix: "IntegrationV2",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const {
  createEndpoint,
  shouldRetryOnException,
  tagsExtractFromDescription,
  tagsRemoveFromDescription,
  findNameInTagsOrId,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildPayloadDescriptionTags } = require("./ApiGatewayCommon");

const findId = get("live.IntegrationId");
const findName = findNameInTagsOrId({ findId });

exports.Integration = ({ spec, config }) => {
  const apiGateway = () =>
    createEndpoint({ endpointName: "ApiGatewayV2" })(config);
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);
  const findDependencies = ({ live, lives }) => [
    {
      type: "Api",
      group: "apiGatewayV2",
      ids: [live.ApiId],
    },
    {
      type: "Function",
      group: "lambda",
      ids: pipe([
        () => live,
        when(
          eq(get("IntegrationType"), "AWS_PROXY"),
          () => live.IntegrationUri
        ),
        (id) => [id],
        filter(not(isEmpty)),
      ])(),
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
          group: "apiGatewayV2",
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
    ])();

  //const isUpByName = pipe([getByName, not(isEmpty)]);
  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createIntegration-property
  const create = ({
    name,
    payload,
    resolvedDependencies: { api, lambdaFunction },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create integration: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      buildPayloadDescriptionTags,
      apiGateway().createIntegration,
      tap.if(
        () => lambdaFunction,
        ({ IntegrationId }) =>
          pipe([
            () => ({
              Action: "lambda:InvokeFunction",
              FunctionName: lambdaFunction.resource.name,
              Principal: "apigateway.amazonaws.com",
              StatementId: IntegrationId,
              SourceArn: `arn:aws:execute-api:${
                config.region
              }:${config.accountId()}:${getField(api, "ApiId")}/*/*/${
                lambdaFunction.resource.name
              }`,
            }),
            lambda().addPermission,
          ])()
      ),
      tap((params) => {
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#removePermission-property
  const lambdaRemovePermission = ({ live }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => live,
      tap.if(
        eq(get("IntegrationType"), "AWS_PROXY"),
        pipe([
          () => ({
            FunctionName: live.IntegrationUri,
            StatementId: live.IntegrationId,
          }),
          tryCatch(lambda().removePermission, (error) =>
            pipe([
              tap(() => {
                logger.error(`lambdaRemovePermission ${tos(error)}`);
              }),
              () => {
                throw error;
              },
            ])()
          ),
        ])
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteIntegration-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => lambdaRemovePermission({ live }),
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
