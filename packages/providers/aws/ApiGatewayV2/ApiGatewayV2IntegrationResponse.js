const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append } = require("rubico/x");

const { getByNameCore, omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { ignoreErrorCodes } = require("./ApiGatewayV2Common");

const pickId = pipe([
  tap(({ ApiId, IntegrationId, IntegrationResponseId }) => {
    assert(ApiId);
    assert(IntegrationId);
    assert(IntegrationResponseId);
  }),
  pick(["ApiId", "IntegrationId", "IntegrationResponseId"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.ApiId);
      assert(live.IntegrationId);
    }),
    defaultsDeep({ ApiId: live.ApiId, IntegrationId: live.IntegrationId }),
    omitIfEmpty(["ResponseParameters", "ResponseTemplates"]),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2IntegrationResponse = ({}) => ({
  type: "IntegrationResponse",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName:
    ({ dependenciesSpec: { integration } }) =>
    ({ IntegrationResponseKey }) =>
      pipe([
        tap(() => {
          assert(integration);
          assert(IntegrationResponseKey);
        }),
        () => `${integration}::${IntegrationResponseKey}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ IntegrationResponseKey, IntegrationId }) =>
      pipe([
        tap(() => {
          assert(IntegrationId);
          assert(IntegrationResponseKey);
        }),
        () => IntegrationId,
        lives.getById({
          type: "Integration",
          group: "ApiGatewayV2",
          providerName: config.providerName,
        }),
        get("name", IntegrationId),
        append(`::${IntegrationResponseKey}`),
      ])(),
  findId: () =>
    pipe([
      get("IntegrationResponseId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  ignoreErrorCodes,
  propertiesDefault: {},
  omitProperties: ["ApiId", "IntegrationId", "IntegrationResponseId"],
  dependencies: {
    integration: {
      type: "Integration",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: () =>
        pipe([
          tap((params) => {
            assert(params);
          }),
          get("IntegrationId"),
          tap((IntegrationId) => {
            assert(IntegrationId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getIntegrationResponse-property
  getById: {
    method: "getIntegrationResponse",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getIntegrationResponses-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Integration", group: "ApiGatewayV2" },
          pickKey: pipe([
            pick(["ApiId", "IntegrationId"]),
            tap(({ ApiId, IntegrationId }) => {
              assert(ApiId);
              assert(IntegrationId);
            }),
          ]),
          method: "getIntegrationResponses",
          getParam: "Items",
          config,
          decorate:
            ({ parent }) =>
            (live) =>
              pipe([() => live, decorate({ endpoint, live: parent })])(),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createIntegrationResponse-property
  create: {
    method: "createIntegrationResponse",
    pickCreated: ({ payload }) => pipe([defaultsDeep(payload)]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateIntegrationResponse-property
  update: {
    method: "updateIntegrationResponse",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteIntegrationResponse-property
  destroy: {
    method: "deleteIntegrationResponse",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { integration },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(integration);
      }),
      () => otherProps,
      defaultsDeep({
        ApiId: getField(integration, "ApiId"),
        IntegrationId: getField(integration, "IntegrationId"),
      }),
    ])(),
});
