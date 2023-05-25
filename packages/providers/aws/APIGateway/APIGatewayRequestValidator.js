const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, append, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./APIGatewayCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html

const toRequestValidatorId = ({ id, ...other }) => ({
  requestValidatorId: id,
  ...other,
});

const decorate = ({ endpoint, live }) =>
  pipe([
    tap((params) => {
      assert(live.restApiId);
    }),
    defaultsDeep({ restApiId: live.restApiId }),
    toRequestValidatorId,
  ]);

const pickId = pipe([
  pick(["restApiId", "requestValidatorId"]),
  tap(({ restApiId, requestValidatorId }) => {
    assert(restApiId);
    assert(requestValidatorId);
  }),
]);

exports.APIGatewayRequestValidator = ({ compare }) => ({
  type: "RequestValidator",
  package: "api-gateway",
  client: "APIGateway",
  inferName:
    ({ dependenciesSpec: { restApi } }) =>
    ({ name }) =>
      pipe([
        tap(() => {
          assert(name);
          assert(restApi);
        }),
        () => `${restApi}::${name}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.restApiId);
          assert(live.name);
        }),
        () => live,
        get("restApiId"),
        lives.getById({
          type: "RestApi",
          group: "APIGateway",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${live.name}`),
      ])(),
  findId: ({ config }) => pipe([get("requestValidatorId")]),
  omitProperties: ["restApiId", "requestValidatorId"],
  propertiesDefault: {},
  dependencies: {
    restApi: {
      type: "RestApi",
      group: "APIGateway",
      parent: true,
      dependencyId: ({ lives, config }) => get("restApiId"),
    },
  },
  getByName: getByNameCore,
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "RestApi", group: "APIGateway" },
          pickKey: pipe([({ id }) => ({ restApiId: id })]),
          method: "getRequestValidators",
          getParam: "items",
          config,
          decorate: ({ parent }) =>
            decorate({ endpoint, live: { restApiId: parent.id } }),
        }),
    ])(),
  ignoreErrorCodes,
  getById: {
    method: "getRequestValidator",
    pickId,
    decorate,
  },
  create: {
    method: "createRequestValidator",
    pickCreated: ({ payload }) =>
      pipe([toRequestValidatorId, defaultsDeep(payload)]),
  },
  destroy: {
    pickId,
    method: "deleteRequestValidator",
    ignoreErrorMessages: ["Cannot delete Request Validator"],
  },
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { restApi },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        restApiId: getField(restApi, "id"),
      }),
    ])(),
});
