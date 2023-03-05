const assert = require("assert");
const { pipe, tap, get, pick, eq, assign, and } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { ignoreErrorCodes } = require("./ApiGatewayV2Common");

const findId = () =>
  pipe([
    get("ApiMappingId"),
    tap((ApiMappingId) => {
      assert(ApiMappingId);
    }),
  ]);

const pickId = pick(["ApiMappingId", "DomainName"]);

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
    defaultsDeep({ ApiName: live.ApiName }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2ApiMapping = ({}) => ({
  type: "ApiMapping",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  propertiesDefault: {},
  inferName:
    ({ dependenciesSpec: { domainName, stage } }) =>
    ({}) =>
      pipe([
        tap(() => {
          assert(domainName);
          assert(stage);
        }),
        () => `apimapping::${domainName}::${stage}`,
      ])(),
  findName: () =>
    pipe([
      tap(({ DomainName, ApiName, Stage }) => {
        assert(DomainName);
        assert(ApiName);
        assert(Stage);
      }),
      ({ DomainName, ApiName, Stage }) =>
        `apimapping::${DomainName}::${ApiName}::${Stage}`,
    ]),
  findId,
  ignoreErrorCodes,
  omitProperties: ["ApiMappingId", "ApiName"],
  filterLive: () => pipe([pick(["ApiMappingKey"])]),
  dependencies: {
    domainName: {
      type: "DomainName",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: ({ lives, config }) => get("DomainName"),
    },
    stage: {
      type: "Stage",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              type: "Stage",
              group: "ApiGatewayV2",
            }),
            find(
              and([
                eq(get("live.StageName"), live.Stage),
                eq(get("live.ApiId"), live.ApiId),
              ])
            ),
            get("id"),
          ])(),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApiMapping-property
  getById: {
    pickId,
    method: "getApiMapping",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#listApiMappings-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "DomainName", group: "ApiGatewayV2" },
          pickKey: pipe([
            pick(["DomainName"]),
            tap(({ DomainName }) => {
              assert(DomainName);
            }),
          ]),
          method: "getApiMappings",
          getParam: "Items",
          config,
          decorate:
            ({ lives, parent: { DomainName, Tags } }) =>
            (live) =>
              pipe([
                () => live,
                defaultsDeep({ DomainName }),
                assign({
                  ApiName: pipe([
                    get("ApiId"),
                    tap((ApiId) => {
                      assert(ApiId);
                    }),
                    lives.getById({
                      providerName: config.providerName,
                      type: "Api",
                      group: "ApiGatewayV2",
                    }),
                    get("name"),
                  ]),
                }),
              ])(),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApiMapping-property
  create: {
    method: "createApiMapping",
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ DomainName: payload.DomainName })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateApiMapping-property
  update: {
    method: "updateApiMapping",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteApiMapping-property
  destroy: {
    method: "deleteApiMapping",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { stage, domainName },
  }) =>
    pipe([
      tap(() => {
        assert(domainName, "missing 'domainName' dependency");
        assert(stage, "missing 'stage' dependency");
      }),
      () => properties,
      defaultsDeep({
        ApiId: getField(stage, "ApiId"),
        DomainName: getField(domainName, "DomainName"),
        Stage: getField(stage, "StageName"),
      }),
    ])(),
});
