const assert = require("assert");
const { pipe, tap, get, map, assign } = require("rubico");
const { defaultsDeep, unless, isEmpty, callProp } = require("rubico/x");

const { Tagger } = require("./ApiGatewayCommon");
const { buildTagsObject, getByNameCore } = require("@grucloud/core/Common");

const { replaceWithName } = require("@grucloud/core/Common");

const buildArn =
  ({ config }) =>
  ({ id }) =>
    `arn:aws:apigateway:${config.region}::/usageplans/${id}`;

const pickId = pipe([({ id }) => ({ usagePlanId: id })]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.UsagePlan = ({ compare }) => ({
  type: "UsagePlan",
  package: "api-gateway",
  client: "APIGateway",
  inferName: () => get("name"),
  findName: () => pipe([get("name")]),
  findId: () => pipe([get("id")]),
  omitProperties: ["id"],
  propertiesDefault: {},
  compare: compare({
    filterAll: () =>
      pipe([
        assign({
          apiStages: pipe([
            get("apiStages"),
            callProp("sort", (a, b) => a.apiId.localeCompare(b.apiId)),
          ]),
        }),
      ]),
  }),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        apiStages: pipe([
          get("apiStages"),
          map(
            assign({
              apiId: pipe([
                get("apiId"),
                replaceWithName({
                  groupType: "APIGateway::RestApi",
                  path: "id",
                  pathLive: "live.id",
                  providerConfig,
                  lives,
                }),
              ]),
            })
          ),
        ]),
      }),
    ]),
  dependencies: {
    stages: {
      type: "Stage",
      group: "APIGateway",
      list: true,
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("apiStages"),
          map(({ apiId, stage }) =>
            pipe([
              () =>
                `arn:aws:apigateway:${config.region}::/restapis/${apiId}/stages/${stage}`,
              lives.getById({
                type: "Stage",
                group: "APIGateway",
                providerName: config.providerName,
              }),
              get("id"),
            ])()
          ),
        ]),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getUsagePlan-property
  getById: {
    method: "getUsagePlan",
    pickId,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getUsagePlans-property
  getList: {
    method: "getUsagePlans",
    getParam: "items",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createUsagePlan-property
  create: {
    method: "createUsagePlan",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(params);
        }),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateUsagePlan-property
  update: {
    method: "updateUsagePlan",
    // TODO build patchOperations
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ usagePlanId: live.id })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteUsagePlan-property
  destroy: {
    preDestroy: ({ endpoint }) =>
      tap((live) =>
        pipe([
          () => live,
          get("apiStages"),
          map(({ apiId, stage }) => ({
            op: "remove",
            path: "/apiStages",
            value: `${apiId}:${stage}`,
          })),
          unless(
            isEmpty,
            pipe([
              (patchOperations) => ({
                usagePlanId: live.id,
                patchOperations,
              }),
              endpoint().updateUsagePlan,
            ])
          ),
        ])()
      ),
    method: "deleteUsagePlan",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        tags: buildTagsObject({ name, config, namespace, userTags: tags }),
      }),
    ])(),
});
