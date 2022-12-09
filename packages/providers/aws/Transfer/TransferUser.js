const assert = require("assert");
const {
  pipe,
  tap,
  get,
  pick,
  eq,
  assign,
  map,
  and,
  or,
  not,
  filter,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  first,
  pluck,
  callProp,
  when,
  isEmpty,
  unless,
  identity,
} = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./TransferCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ UserName, ServerId }) => {
    assert(UserName);
    assert(ServerId);
  }),
  pick(["UserName", "ServerId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html
exports.TransferUser = () => ({
  type: "User",
  package: "transfer",
  client: "Transfer",
  propertiesDefault: {},
  omitProperties: ["Arn", "Role", "SshPublicKeyCount"],
  inferName: () =>
    pipe([
      get("UserName"),
      tap((UserName) => {
        assert(UserName);
      }),
    ]),
  findName: () =>
    pipe([
      get("UserName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Arn"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    iamRole: {
      type: "Role",
      group: "IAM",
      dependencyId: ({ lives, config }) => pipe([get("Role")]),
    },
    server: {
      type: "Server",
      group: "Transfer",
      parent: true,
      dependencyId: ({ lives, config }) => pipe([get("ServerId")]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#getUser-property
  getById: {
    method: "getUser",
    getField: "User",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#listUsers-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Server", group: "Transfer" },
          pickKey: pipe([pick(["ServerId"])]),
          method: "listUsers",
          getParam: "Users",
          config,
          decorate: ({ parent }) =>
            pipe([defaultsDeep({ ServerId: parent.ServerId })]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#createUser-property
  create: {
    method: "createUser",
    pickCreated: ({ payload }) => pipe([get("User")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#updateUser-property
  update: {
    method: "updateUser",
    filterParams: ({ pickId, payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#deleteUser-property
  destroy: {
    method: "deleteUser",
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
    properties: { Tags, ...otherProps },
    dependencies: { server, iamRole },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(server);
      }),
      () => otherProps,
      defaultsDeep({
        ServerId: getField(server, "ServerId"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => iamRole,
        defaultsDeep({
          Role: getField(iamRole, "Arn"),
        })
      ),
    ])(),
});
