const assert = require("assert");
const { pipe, tap, get, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = () => pipe([get("id")]);

const pickId = pipe([
  tap(({ usagePlanId, keyId }) => {
    assert(usagePlanId);
    assert(keyId);
  }),
  ({ usagePlanId, keyId }) => ({ usagePlanId: usagePlanId, keyId: keyId }),
]);

const decorate = () =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    ({ value, ...other }) => ({ keyId: value, ...other }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.UsagePlanKey = ({}) => ({
  type: "UsagePlanKey",
  package: "api-gateway",
  client: "APIGateway",
  findName: () => pipe([get("name")]),
  findId,
  getByName: getByNameCore,
  omitProperties: ["id", "keyId", "usagePlanId"],
  inferName: () => pipe([get("name")]),
  propertiesDefault: { keyType: "API_KEY" },
  dependencies: {
    usagePlan: {
      type: "UsagePlan",
      group: "APIGateway",
      parent: true,
      dependencyId: ({ lives, config }) => get("usagePlanId"),
    },
    apiKey: {
      type: "ApiKey",
      group: "APIGateway",
      dependencyId: ({ lives, config }) => get("keyId"),
    },
  },
  ignoreErrorCodes: ["NotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getUsagePlanKey-property
  getById: {
    method: "getUsagePlanKey",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createUsagePlanKey-property
  create: {
    method: "createUsagePlanKey",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateUsagePlanKey-property
  update: {
    method: "updateUsagePlanKey",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep({ usagePlanId: live.usagePlanId })])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteUsagePlanKey-property
  destroy: {
    method: "deleteUsagePlanKey",
    pickId,
  },
  getList: ({ client, config }) =>
    pipe([
      client.getListWithParent({
        parent: { type: "UsagePlan", group: "APIGateway" },
        config,
        pickKey: pipe([({ id }) => ({ usagePlanId: id })]),
        method: "getUsagePlanKeys",
        getParam: "items",
        decorate:
          ({ lives, parent: { id } }) =>
          (live) =>
            pipe([
              () => live,
              defaultsDeep({
                usagePlanId: id,
              }),
              ({ id, type, value, ...other }) => ({
                keyId: id,
                keyType: type,
                id: value,
                ...other,
              }),
            ])(),
      }),
    ]),
  configDefault: ({
    properties,
    dependencies: { usagePlan, apiKey },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(usagePlan);
        assert(apiKey);
      }),
      () => properties,
      defaultsDeep({
        usagePlanId: getField(usagePlan, "id"),
        keyId: getField(apiKey, "id"),
      }),
    ])(),
});
