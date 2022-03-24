const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  tryCatch,
  switchCase,
  and,
  pick,
  assign,
} = require("rubico");
const { defaultsDeep, find, when } = require("rubico/x");
const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { createLambda } = require("../Lambda/LambdaCommon");
const { lambdaAddPermission, throwIfNotAwsError } = require("../AwsCommon");
const { createAPIGateway, ignoreErrorCodes } = require("./ApiGatewayCommon");

const findName = pipe([
  get("live"),
  tap(({ restApiName, path, httpMethod }) => {
    assert(restApiName);
    assert(path);
    assert(httpMethod);
  }),
  ({ restApiName, path, httpMethod }) =>
    `integration::${restApiName}::${path}::${httpMethod}`,
]);

const findId = pipe([
  get("live"),
  ({ restApiId, path, httpMethod }) =>
    `integration::${restApiId}::${path}::${httpMethod}`,
]);

const pickId = pipe([
  tap(({ restApiId, httpMethod, resourceId }) => {
    assert(restApiId);
    assert(resourceId);
    assert(httpMethod);
  }),
  pick(["restApiId", "resourceId", "httpMethod"]),
]);

exports.Integration = ({ spec, config }) => {
  const apiGateway = createAPIGateway(config);
  const lambda = createLambda(config);

  const client = AwsClient({ spec, config })(apiGateway);

  const findDependencies = ({ live, lives }) => [
    {
      type: "Method",
      group: "APIGateway",
      ids: [
        pipe([
          () =>
            lives.getByType({
              providerName: config.providerName,
              type: "Method",
              group: "APIGateway",
            }),
          find(
            and([
              eq(get("live.restApiId"), live.restApiId),
              eq(get("live.resourceId"), live.resourceId),
              eq(get("live.httpMethod"), live.httpMethod),
            ])
          ),
          get("id"),
        ])(),
      ],
    },
    {
      type: "Function",
      group: "Lambda",
      ids: [
        pipe([
          () => live,
          //TODO
          switchCase([
            eq(get("integrationType"), "AWS_PROXY"),
            () => live.integrationUri,
            () => undefined,
          ]),
        ])(),
      ],
    },
    {
      type: "Role",
      group: "IAM",
      ids: [live.credentials],
    },
    {
      type: "Table",
      group: "DynamoDB",
      ids: [
        pipe([
          () => live,
          get("requestTemplates.application/json.TableName"),
          (name) =>
            lives.getByName({
              name,
              providerName: config.providerName,
              type: "Table",
              group: "DynamoDB",
            }),
          get("id"),
        ])(),
      ],
    },
  ];

  const requestTemplatesStringify = pipe([
    tap(({ requestTemplates }) => {
      assert(requestTemplates);
    }),
    assign({
      requestTemplates: pipe([
        get("requestTemplates"),
        when(
          get("application/json"),
          assign({
            "application/json": pipe([get("application/json"), JSON.stringify]),
          })
        ),
      ]),
    }),
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getIntegration-property
  const getById = client.getById({
    pickId,
    method: "getIntegration",
    ignoreErrorCodes,
    decorate: ({ live: { method } }) =>
      pipe([
        tap((params) => {
          assert(method);
        }),
        defaultsDeep(
          pipe([
            () => method,
            pick([
              "restApiId",
              "restApiName",
              "resourceId",
              "path",
              "httpMethod",
            ]),
          ])()
        ),
        assign({ httpMethod: () => method.httpMethod }),
        tap((params) => {
          assert(true);
        }),
        assign({
          requestTemplates: pipe([
            get("requestTemplates"),
            when(
              get("application/json"),
              assign({
                "application/json": pipe([get("application/json"), JSON.parse]),
              })
            ),
          ]),
        }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getIntegration-property
  const getList = client.getListWithParent({
    parent: { type: "Method", group: "APIGateway" },
    config,
    decorate: ({ lives, parent }) => pipe([getById]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#putIntegration-property
  const create = client.create({
    method: "putIntegration",
    filterPayload: requestTemplatesStringify,
    postCreate: ({ resolvedDependencies: { method, lambdaFunction } }) =>
      pipe([
        tap(() => {
          assert(method);
        }),
        when(
          () => lambdaFunction,
          lambdaAddPermission({
            lambda,
            lambdaFunction,
            SourceArn: () =>
              `arn:aws:execute-api:${
                config.region
              }:${config.accountId()}:${getField(method, "restApiId")}/*/*/${
                lambdaFunction.resource.name
              }`,
          })
        ),
      ]),
  });

  const update = client.update({
    pickId,
    filterParams: ({ payload, live, diff }) =>
      pipe([() => payload, requestTemplatesStringify])(),
    method: "updateIntegration",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lambda.html#removePermission-property
  const lambdaRemovePermission = ({ live }) =>
    pipe([
      () => live,
      tap.if(
        and([eq(get("integrationType"), "AWS_PROXY"), get("integrationUri")]),
        pipe([
          () => ({
            FunctionName: live.integrationUri,
            StatementId: live.id,
          }),
          tryCatch(lambda().removePermission, throwIfNotAwsError),
        ])
      ),
    ])();

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteIntegration-property
  const destroy = client.destroy({
    pickId,
    preDestroy: lambdaRemovePermission,
    method: "deleteIntegration",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { method, lambdaFunction, role },
  }) =>
    pipe([
      tap(() => {
        assert(method, "missing 'method' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        httpMethod: getField(method, "httpMethod"),
        integrationHttpMethod: getField(method, "httpMethod"),
        restApiId: getField(method, "restApiId"),
        resourceId: getField(method, "resourceId"),
      }),
      when(
        () => lambdaFunction,
        defaultsDeep({
          integrationUri: getField(lambdaFunction, "FunctionArn"),
        })
      ),
      when(
        () => role,
        defaultsDeep({
          credentials: getField(role, "Arn"),
        })
      ),
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
    findDependencies,
  };
};
