const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  assign,
  tryCatch,
  switchCase,
  flatMap,
} = require("rubico");
const { pluck, defaultsDeep, when } = require("rubico/x");
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

const pickId = ({ restApiId, resourceId, httpMethod }) => ({
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
    //TODO
    // {
    //   type: "Resource",
    //   group: "APIGateway",
    //   ids: [live.restApiId],
    // },
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getIntegration-property
  const getById = client.getById({
    pickId,
    method: "getIntegration",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getIntegration-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList integration`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "Method",
          group: "APIGateway",
        }),
      pluck("live"),
      flatMap((method) =>
        tryCatch(
          pipe([
            tap((params) => {
              assert(true);
            }),
            () =>
              apiGateway().getIntegration({
                restApiId: method.restApiId,
                resourceId: method.resourceId,
                httpMethod: method.httpMethod,
              }),
            get("items"),
            map(
              defaultsDeep({
                restApiId: resource.restApiId,
                resourceId: resource.id,
              })
            ),
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
      pickId,
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
    dependencies: { method, lambdaFunction },
  }) =>
    pipe([
      tap(() => {
        assert(method, "missing 'method' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        httpMethod: getField(method, "httpMethod"),
        restApiId: getField(method, "restApiId"),
        resource: getField(method, "resourceId"),
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
    getById,
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
