const assert = require("assert");
const { pipe, tap, get, eq, not, filter, pick } = require("rubico");
const { isEmpty, callProp, defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.RouteId");
const findName = pipe([
  get("live"),
  ({ ApiName, RouteKey }) => `route::${ApiName}::${RouteKey}`,
]);

const pickId = pick(["ApiId", "RouteId"]);

exports.Route = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Api",
      group: "ApiGatewayV2",
      ids: [live.ApiId],
    },
    {
      type: "Integration",
      group: "ApiGatewayV2",
      ids: pipe([
        () => live,
        get("Target", ""),
        callProp("replace", "integrations/", ""),
        (target) => [target],
        filter(not(isEmpty)),
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
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getRoutes-property
  const getList = client.getListWithParent({
    parent: { type: "Api", group: "ApiGatewayV2" },
    pickKey: pipe([pick(["ApiId"])]),
    method: "getRoutes",
    getParam: "Items",
    config,
    decorate: ({ parent: { ApiId, Name: ApiName, Tags } }) =>
      pipe([defaultsDeep({ ApiId, ApiName, Tags })]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createRoute-property
  const create = client.create({
    method: "createRoute",
    pickCreated:
      ({ payload }) =>
      (result) =>
        pipe([() => result, defaultsDeep({ ApiId: payload.ApiId })])(),
    pickId,
    getById,
    config,
  });

  //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateRoute-property
  const update = client.update({
    pickId,
    method: "updateRoute",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteRoute-property
  const destroy = client.destroy({
    pickId,
    method: "deleteRoute",
    getById,
    ignoreError: eq(get("code"), "NotFoundException"),
    config,
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
    shouldRetryOnException,
    findDependencies,
  };
};
