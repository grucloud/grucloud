const assert = require("assert");
const {
  pipe,
  tap,
  get,
  eq,
  not,
  assign,
  filter,
  omit,
  tryCatch,
  pick,
  switchCase,
} = require("rubico");
const { defaultsDeep, callProp, last, when, isEmpty } = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "IntegrationV2",
});

const { tos } = require("@grucloud/core/tos");
const { getByNameCore } = require("@grucloud/core/Common");
const {
  createEndpoint,
  shouldRetryOnException,
  lambdaAddPermission,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const { findDependenciesApi } = require("./ApiGatewayCommon");

const findId = get("live.IntegrationId");

const integrationUriToName = pipe([
  callProp("split", ":"),
  last,
  tap((params) => {
    assert(true);
  }),
]);

const findName = pipe([
  tap((params) => {
    assert(true);
  }),
  get("live"),
  ({ ApiName, IntegrationUri }) =>
    `integration::${ApiName}::${integrationUriToName(IntegrationUri)}`,
  tap((params) => {
    assert(true);
  }),
]);

const pickId = pick(["ApiId", "IntegrationId"]);

exports.Integration = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const lambda = () => createEndpoint({ endpointName: "Lambda" })(config);

  // Integration findDependencies
  const findDependencies = ({ live, lives }) => [
    findDependenciesApi({ live }),
    {
      type: "Function",
      group: "Lambda",
      ids: pipe([
        () => live,
        when(
          eq(get("IntegrationType"), "AWS_PROXY"),
          () => live.IntegrationUri
        ),
        (id) => [id],
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getIntegration-property
  const getById = client.getById({
    pickId,
    method: "getIntegration",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getIntegrations-property
  const getList = client.getListWithParent({
    parent: { type: "Api", group: "ApiGatewayV2" },
    pickKey: pipe([pick(["ApiId"])]),
    method: "getIntegrations",
    getParam: "Items",
    config,
    decorate:
      ({ parent: { ApiId, Name, Tags } }) =>
      (live) =>
        pipe([
          () => live,
          defaultsDeep({ ApiId, ApiName: Name }),
          assign({
            Tags: pipe([() => Tags, omit(["Name"])]),
          }),
        ])(),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createIntegration-property
  const create = client.create({
    method: "createIntegration",
    pickCreated:
      ({ payload }) =>
      (result) =>
        pipe([() => result, defaultsDeep({ ApiId: payload.ApiId })])(),
    pickId,
    getById,
    config,
    postCreate: ({ resolvedDependencies: { api, lambdaFunction } }) =>
      pipe([
        tap(() => {
          assert(api);
          assert(lambdaFunction);
        }),
        lambdaAddPermission({
          lambda,
          lambdaFunction,
          SourceArn: `arn:aws:execute-api:${
            config.region
          }:${config.accountId()}:${getField(api, "ApiId")}/*/*/${
            lambdaFunction.resource.name
          }`,
        }),
      ]),
  });

  const update = client.update({
    pickId,
    method: "updateIntegration",
    getById,
    config,
  });

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
              () => error,
              switchCase([
                eq(get("code"), "ResourceNotFoundException"),
                () => {},
                () => {
                  throw error;
                },
              ]),
            ])()
          ),
        ])
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteIntegration-property
  const destroy = client.destroy({
    preDestroy: lambdaRemovePermission,
    pickId,
    method: "deleteIntegration",
    getById,
    ignoreErrorCodes: ["NotFoundException"],
    config,
  });

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
          IntegrationUri: getField(lambdaFunction, "Configuration.FunctionArn"),
        }),
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
