const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const {
  Tagger,
  //assignTags,
} = require("./IotCommon");

const buildArn = () =>
  pipe([
    get("authorizerArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ authorizerName }) => {
    assert(authorizerName);
  }),
  pick(["authorizerName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Iot.html
exports.IotAuthorizer = () => ({
  type: "Authorizer",
  package: "iot",
  client: "IoT",
  propertiesDefault: {},
  omitProperties: ["authorizerFunctionArn", "authorizerArn"],
  inferName: () =>
    pipe([
      get("authorizerName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("authorizerName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("authorizerArn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  // TODO dependencies
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Iot.html#describeAuthorizer-property
  getById: {
    method: "describeAuthorizer",
    getField: "authorizerDescription",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Iot.html#listAuthorizers-property
  getList: {
    method: "listAuthorizers",
    getParam: "authorizers",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Iot.html#createAuthorizer-property
  create: {
    method: "createAuthorizer",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Iot.html#updateAuthorizer-property
  update: {
    method: "updateAuthorizer",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Iot.html#deleteAuthorizer-property
  destroy: {
    method: "deleteAuthorizer",
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
        tags: buildTags({ name, config, namespace, UserTags: tags }),
      }),
    ])(),
});
