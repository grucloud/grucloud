const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { dependencyIdApi, ignoreErrorCodes } = require("./ApiGatewayV2Common");

const pickId = pick(["ApiId", "RouteId"]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2Route = () => ({
  type: "Route",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName:
    ({ dependenciesSpec: { api } }) =>
    ({ RouteKey }) =>
      pipe([
        tap((params) => {
          assert(RouteKey);
          assert(api);
        }),
        () => `route::${api}::${RouteKey}`,
      ])(),
  findName: () =>
    pipe([({ ApiName, RouteKey }) => `route::${ApiName}::${RouteKey}`]),
  findId: () =>
    pipe([
      get("RouteId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  propertiesDefault: {
    ApiKeyRequired: false,
    AuthorizationScopes: [],
    AuthorizationType: "NONE",
    RequestModels: {},
  },
  omitProperties: ["RouteId", "ApiName", "ApiId", "Target", "AuthorizerId"],
  dependencies: {
    api: {
      type: "Api",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: dependencyIdApi,
    },
    integration: {
      type: "Integration",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("Target", ""),
          callProp("replace", "integrations/", ""),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    authorizer: {
      type: "Authorizer",
      group: "ApiGatewayV2",
      dependencyId: ({ lives, config }) => get("AuthorizerId"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getRoute-property
  getById: {
    pickId,
    method: "getRoute",
    decorate: ({ live: { ApiId } }) =>
      pipe([
        defaultsDeep({
          ApiId,
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#listRoutes-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Api", group: "ApiGatewayV2" },
          pickKey: pipe([pick(["ApiId"])]),
          method: "getRoutes",
          getParam: "Items",
          config,
          decorate: ({ parent: { ApiId, Name: ApiName } }) =>
            pipe([
              tap((params) => {
                assert(ApiId);
                assert(ApiName);
              }),
              defaultsDeep({ ApiId, ApiName }),
            ]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createRoute-property
  create: {
    method: "createRoute",
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ ApiId: payload.ApiId })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateRoute-property
  update: {
    method: "updateRoute",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteRoute-property
  destroy: {
    method: "deleteRoute",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { api, integration, authorizer },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
        assert(integration, "missing 'integration' dependency");
      }),
      () => properties,
      defaultsDeep({
        ApiId: getField(api, "ApiId"),
        Target: `integrations/${getField(integration, "IntegrationId")}`,
      }),
      when(
        () => authorizer,
        defaultsDeep({ AuthorizerId: getField(authorizer, "AuthorizerId") })
      ),
    ])(),
});
