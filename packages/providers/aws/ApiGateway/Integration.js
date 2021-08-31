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
  prefix: "Integration",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");

const {
  createEndpoint,
  shouldRetryOnException,
  tagsExtractFromDescription,
  tagsRemoveFromDescription,
  findNameInTagsOrId,
} = require("../AwsCommon");

const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.id");
const findName = findNameInTagsOrId({ findId });

//TODO
const pickParam = ({ restApiId, resourceId, httpMethod }) => ({
  restApiId,
  resourceId,
  httpMethod,
});

exports.Integration = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);
  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "APIGateway",
      ids: [live.restApiId],
    },
    {
      type: "Function",
      group: "Lambda",
      ids: pipe([
        () => live,
        //TODO
        when(
          eq(get("integrationType"), "AWS_PROXY"),
          () => live.integrationUri
        ),
        (id) => [id],
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getIntegrations-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList integration`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "RestApi",
          group: "APIGateway",
        }),
      pluck("id"),
      flatMap((restApiId) =>
        tryCatch(
          pipe([
            () => apiGateway().getIntegrations({ restApiId }),
            get("items"),
            map(defaultsDeep({ restApiId })),
            map(
              assign({
                tags: tagsExtractFromDescription,
                description: tagsRemoveFromDescription,
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#putIntegration-property
  const create = ({
    name,
    payload,
    resolvedDependencies: { restApi, lambdaFunction },
  }) =>
    pipe([
      tap(() => {
        logger.info(`create integration: ${name}`);
        logger.debug(tos(payload));
      }),
      () => payload,
      apiGateway().putIntegration,
      tap.if(
        () => lambdaFunction,
        ({ id }) =>
          pipe([
            () => ({
              Action: "lambda:InvokeFunction",
              FunctionName: lambdaFunction.resource.name,
              Principal: "apigateway.amazonaws.com",
              StatementId: id,
              SourceArn: `arn:aws:execute-api:${
                config.region
              }:${config.accountId()}:${getField(restApi, "id")}/*/*/${
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
        eq(get("integrationType"), "AWS_PROXY"),
        pipe([
          () => ({
            FunctionName: live.integrationUri,
            StatementId: live.id,
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteIntegration-property
  const destroy = ({ live }) =>
    pipe([
      tap(() => {
        assert(true);
      }),
      () => lambdaRemovePermission({ live }),
      () => live,
      pickParam,
      tap((params) => {
        logger.info(`destroy integration ${JSON.stringify({ params })}`);
        assert(params.restApiId);
        assert(params.resourceId);
        assert(params.httpMethod);
      }),
      tryCatch(apiGateway().deleteIntegration, (error, params) =>
        pipe([
          tap(() => {
            logger.error(
              `deleteIntegration ${JSON.stringify({ params, error })}`
            );
          }),
          () => error,
          switchCase([
            eq(get("code"), "NotFoundException"),
            () => undefined,
            () => {
              throw error;
            },
          ]),
        ])()
      ),
      tap((params) => {
        logger.debug(`destroyed integration ${JSON.stringify({ params })}`);
      }),
    ])();

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { restApi, resource, lambdaFunction },
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
        assert(resource, "missing 'resource' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        restApiId: getField(restApi, "id"),
        resource: getField(resource, "id"),
        ...(lambdaFunction && {
          integrationUri: getField(lambdaFunction, "FunctionArn"),
        }),
        tags: buildTagsObject({ name, namespace, config, userTags: Tags }),
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
