const assert = require("assert");
const { pipe, tap, get, pick, eq, switchCase, omit } = require("rubico");
const { defaultsDeep, callProp, when, isEmpty, last } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { dependencyIdApi, ignoreErrorCodes } = require("./ApiGatewayV2Common");

const findId = () => get("AuthorizerId");
const findName = () => get("Name");
const pickId = pick(["ApiId", "AuthorizerId"]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2Authorizer = () => ({
  type: "Authorizer",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName: () => get("Name"),
  findName,
  findId,
  propertiesDefault: {},
  ignoreErrorCodes,
  omitProperties: ["AuthorizerId", "ApiName"],
  filterLive: () =>
    pipe([
      pick([
        "Name",
        "AuthorizerType",
        "IdentitySource",
        "AuthorizerPayloadFormatVersion",
        "AuthorizerResultTtlInSeconds",
        "EnableSimpleResponses",
        "IdentityValidationExpression",
        "JwtConfiguration",
      ]),
      when(
        pipe([
          get("JwtConfiguration.Issuer", ""),
          callProp("startsWith", "https://cognito-idp"),
        ]),
        omit(["JwtConfiguration.Issuer"])
      ),
    ]),
  dependencies: {
    api: {
      type: "Api",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: dependencyIdApi,
    },
    userPool: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      dependencyId: ({ lives, config }) =>
        pipe([
          get("JwtConfiguration.Issuer", ""),
          callProp("split", "/"),
          last,
          switchCase([
            isEmpty,
            () => undefined,
            (Id) =>
              pipe([
                lives.getByType({
                  type: "UserPool",
                  group: "CognitoIdentityServiceProvider",
                  providerName: config.providerName,
                }),
                find(eq(get("live.Id"), Id)),
              ])(),
          ]),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getAuthorizer-property
  getById: {
    pickId,
    method: "getAuthorizer",
    ignoreErrorCodes,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#listAuthorizers-property

  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Api", group: "ApiGatewayV2" },
          pickKey: pipe([pick(["ApiId"])]),
          method: "getAuthorizers",
          getParam: "Items",
          config,
          decorate: ({ parent: { ApiId, Name: ApiName, Tags } }) =>
            pipe([defaultsDeep({ ApiId, ApiName /*, Tags*/ })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createAuthorizer-property
  create: {
    method: "createAuthorizer",
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ ApiId: payload.ApiId })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateAuthorizer-property
  update: {
    method: "updateAuthorizer",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteAuthorizer-property
  destroy: {
    method: "deleteAuthorizer",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { api, userPool },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => properties,
      defaultsDeep({
        Name: name,
        ApiId: getField(api, "ApiId"),
      }),
      when(
        () => userPool,
        defaultsDeep({
          JwtConfiguration: {
            Issuer: `https://cognito-idp.${
              config.region
            }.amazonaws.com/${getField(userPool, "Id")}`,
          },
        })
      ),
    ])(),
});
