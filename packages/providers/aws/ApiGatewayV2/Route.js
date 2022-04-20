const assert = require("assert");
const { pipe, tap, get, eq, not, filter, pick } = require("rubico");
const { callProp, defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createApiGatewayV2,
  findDependenciesApi,
  ignoreErrorCodes,
} = require("./ApiGatewayCommon");

const findId = get("live.RouteId");
const findName = pipe([
  get("live"),
  ({ ApiName, RouteKey }) => `route::${ApiName}::${RouteKey}`,
]);

const pickId = pick(["ApiId", "RouteId"]);

exports.Route = ({ spec, config }) => {
  const apiGateway = createApiGatewayV2(config);
  const client = AwsClient({ spec, config })(apiGateway);

  const findDependencies = ({ live, lives }) => [
    findDependenciesApi({ live, config }),
    {
      type: "Integration",
      group: "ApiGatewayV2",
      ids: pipe([
        () => live,
        get("Target", ""),
        callProp("replace", "integrations/", ""),
        (target) => [target],
      ])(),
    },
    {
      type: "Authorizer",
      group: "ApiGatewayV2",
      ids: [live.AuthorizerId],
    },
  ];

  const getById = client.getById({
    pickId,
    method: "getRoute",
    ignoreErrorCodes,
    decorate: ({ live: { ApiId } }) =>
      pipe([
        defaultsDeep({
          ApiId,
        }),
      ]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getRoutes-property
  const getList = client.getListWithParent({
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
  });

  // Get Route by name
  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createRoute-property
  const create = client.create({
    method: "createRoute",
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ ApiId: payload.ApiId })]),
    getById,
  });

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateRoute-property
  const update = client.update({
    pickId,
    method: "updateRoute",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteRoute-property
  const destroy = client.destroy({
    pickId,
    method: "deleteRoute",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
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
    ])();

  return {
    spec,
    findName,
    findId,
    create,
    update,
    destroy,
    getById,
    getByName,
    getList,
    configDefault,
    findDependencies,
  };
};
