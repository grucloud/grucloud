const assert = require("assert");
const { pipe, tap, get, eq, pick, map } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  pick(["id"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html
exports.OpenSearchServerlessSecurityConfig = ({ compare }) => ({
  type: "SecurityConfig",
  package: "opensearchserverless",
  client: "OpenSearchServerless",
  propertiesDefault: {},
  omitProperties: ["id", "createdDate", "lastModifiedDate"],
  inferName: () => pipe([get("name")]),
  findName: () => pipe([get("name")]),
  findId: () =>
    pipe([
      get("id"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#getSecurityConfig-property
  getById: {
    method: "getSecurityConfig",
    getField: "securityConfigDetail",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#listSecurityConfigs-property
  getList: {
    enhanceParams: () => () => ({ type: "saml" }),
    method: "listSecurityConfigs",
    getParam: "securityConfigSummaries",
    decorate,
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#createSecurityConfig-property
  create: {
    method: "createSecurityConfig",
    pickCreated: ({ payload }) => pipe([get("securityConfigDetail")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#updateSecurityConfig-property
  update: {
    method: "updateSecurityConfig",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearchServerless.html#deleteSecurityConfig-property
  destroy: {
    method: "deleteSecurityConfig",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { tag, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      () => otherProps,
    ])(),
});
