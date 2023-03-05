const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { ignoreErrorCodes } = require("./ApiGatewayV2Common");

const pickId = pipe([
  tap(({ ApiId, RouteId, RouteResponseId }) => {
    assert(ApiId);
    assert(RouteId);
    assert(RouteResponseId);
  }),
  pick(["ApiId", "RouteId", "RouteResponseId"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.ApiId);
      assert(live.RouteId);
    }),
    defaultsDeep({ ApiId: live.ApiId, RouteId: live.RouteId }),
    omitIfEmpty(["ResponseModels"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2RouteResponse = ({}) => ({
  type: "RouteResponse",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName:
    ({ dependenciesSpec: { route } }) =>
    ({ RouteResponseKey }) =>
      pipe([
        tap(() => {
          assert(route);
          assert(RouteResponseKey);
        }),
        () => `${route}::${RouteResponseKey}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ RouteResponseKey, RouteId }) =>
      pipe([
        tap(() => {
          assert(RouteId);
          assert(RouteResponseKey);
        }),
        () => RouteId,
        lives.getById({
          type: "Route",
          group: "ApiGatewayV2",
          providerName: config.providerName,
        }),
        get("name", RouteId),
        append(`::${RouteResponseKey}`),
      ])(),
  findId: () =>
    pipe([
      get("RouteResponseId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  propertiesDefault: {},
  omitProperties: ["ApiId", "RouteId", "RouteResponseId"],
  dependencies: {
    route: {
      type: "Route",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: () =>
        pipe([
          tap((RouteId) => {
            assert(RouteId);
          }),
          get("RouteId"),
          tap((RouteId) => {
            assert(RouteId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getRouteResponse-property
  getById: {
    method: "getRouteResponse",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getRouteResponses-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Route", group: "ApiGatewayV2" },
          pickKey: pipe([
            pick(["ApiId", "RouteId"]),
            tap(({ ApiId, RouteId }) => {
              assert(ApiId);
              assert(RouteId);
            }),
          ]),
          method: "getRouteResponses",
          getParam: "Items",
          config,
          decorate:
            ({ parent }) =>
            (live) =>
              pipe([() => live, decorate({ endpoint, live: parent })])(),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createRouteResponse-property
  create: {
    method: "createRouteResponse",
    pickCreated: ({ payload }) => pipe([defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateRouteResponse-property
  update: {
    method: "updateRouteResponse",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteRouteResponse-property
  destroy: {
    method: "deleteRouteResponse",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { route },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(route);
      }),
      () => otherProps,
      defaultsDeep({
        ApiId: getField(route, "ApiId"),
        RouteId: getField(route, "RouteId"),
      }),
    ])(),
});
