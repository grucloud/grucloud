const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, callProp, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTags } = require("../AwsCommon");

const { Tagger, assignTags } = require("./KeyspacesCommon");

const cannotBeDeleted = () =>
  pipe([get("keyspaceName"), callProp("startsWith", "system")]);

const buildArn = () =>
  pipe([
    get("resourceArn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ keyspaceName }) => {
    assert(keyspaceName);
  }),
  pick(["keyspaceName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    //
    assignTags({ buildArn: buildArn(config), endpoint }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html
exports.KeyspacesKeyspace = () => ({
  type: "Keyspace",
  package: "keyspaces",
  client: "Keyspaces",
  propertiesDefault: {},
  omitProperties: ["resourceArn"],
  inferName: () =>
    pipe([
      get("keyspaceName"),
      tap((Name) => {
        assert(Name);
      }),
    ]),
  findName: () =>
    pipe([
      get("keyspaceName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("keyspaceName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  cannotBeDeleted,
  managedByOther: cannotBeDeleted,
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#getKeyspace-property
  getById: {
    method: "getKeyspace",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#listKeyspaces-property
  getList: {
    method: "listKeyspaces",
    getParam: "keyspaces",
    decorate: ({ getById }) => pipe([getById]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#createKeyspace-property
  create: {
    method: "createKeyspace",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Keyspaces.html#deleteKeyspace-property
  destroy: {
    method: "deleteKeyspace",
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
        tags: buildTags({
          name,
          config,
          namespace,
          UserTags: tags,
          key: "key",
          value: "value",
        }),
      }),
    ])(),
});
