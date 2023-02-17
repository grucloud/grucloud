const assert = require("assert");
const { pipe, tap, get, pick, assign, not, and } = require("rubico");
const { defaultsDeep, when, callProp, first, includes } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const {
  assignPolicyAccountAndRegion,
  sortStatements,
} = require("../IAM/AwsIamCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const {
  ignoreErrorCodes,
  filterPayloadRestApiPolicy,
} = require("./APIGatewayCommon");

const assignPolicy = () =>
  pipe([
    when(
      get("policy"),
      pipe([
        assign({
          policy: pipe([
            get("policy"),
            callProp("replaceAll", "\\", ""),
            JSON.parse,
            sortStatements,
          ]),
        }),
      ])
    ),
  ]);

const decorate = ({ endpoint, live }) =>
  pipe([
    // TODO normalize policy
    assignPolicy(),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.APIGatewayRestApiPolicy = () => ({
  type: "RestApiPolicy",
  package: "api-gateway",
  client: "APIGateway",
  propertiesDefault: {},
  omitProperties: ["id"],
  inferName:
    ({ dependenciesSpec: { restApi } }) =>
    ({}) =>
      pipe([
        tap((name) => {
          assert(restApi);
        }),
        () => `${restApi}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ id }) =>
      pipe([
        tap(() => {
          assert(id);
        }),
        () => id,
        lives.getById({
          type: "RestApi",
          group: "APIGateway",
          providerName: config.providerName,
        }),
        get("name", id),
      ])(),
  findId: () =>
    pipe([
      get("id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        policy: pipe([
          get("policy"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    restApi: {
      type: "RestApi",
      group: "APIGateway",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("id"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    //...buildDependenciesPolicy({ policyKey: "policy" }),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getRestApi-property
  getById: {
    method: "getRestApi",
    pickId: pipe([
      tap(({ id }) => {
        assert(id);
      }),
      ({ id }) => ({ restApiId: id }),
    ]),
    decorate,
  },
  getList: {
    filterResource: pipe([get("policy")]),
    method: "getRestApis",
    getParam: "items",
    decorate: ({ endpoint }) =>
      pipe([pick(["id", "policy"]), decorate({ endpoint })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateRestApi-property
  create: {
    filterPayload: filterPayloadRestApiPolicy,
    method: "updateRestApi",
    pickCreated: ({ payload }) => pipe([() => payload]),
    isInstanceUp: () => true,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateRestApi-property
  update: {
    method: "updateRestApi",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayloadRestApiPolicy])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateRestApi-property
  destroy: {
    method: "updateRestApi",
    pickId: pipe([
      ({ id }) => ({
        restApiId: id,
        patchOperations: [{ op: "replace", path: "/policy", value: "" }],
      }),
    ]),
    isInstanceDown: () => true,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { restApi },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(restApi);
      }),
      () => otherProps,
      defaultsDeep({
        id: getField(restApi, "id"),
      }),
    ])(),
});
