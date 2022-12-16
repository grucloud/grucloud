const assert = require("assert");
const { pipe, tap, get, pick, assign, map } = require("rubico");
const { defaultsDeep, when, identity, find, isIn } = require("rubico/x");

const { replaceWithName, omitIfEmpty } = require("@grucloud/core/Common");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { updateResourceArray } = require("@grucloud/core/updateResourceArray");

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

const decorate = ({ endpoint, config, live }) =>
  pipe([
    assign({
      Tags: pipe([endpoint().listTagsForResource, get("Tags")]),
      ServerId: () => live.ServerId,
    }),
    omitIfEmpty(["SshPublicKeys"]),
  ]);

const importSshPublicKey = ({ endpoint, live }) =>
  pipe([
    pick(["SshPublicKeyBody"]),
    defaultsDeep({
      UserName: live.UserName,
      ServerId: live.ServerId,
    }),
    endpoint().importSshPublicKey,
  ]);

const deleteSshPublicKey = ({ endpoint, live }) =>
  pipe([
    pick(["SshPublicKeyId"]),
    defaultsDeep({
      UserName: live.UserName,
      ServerId: live.ServerId,
    }),
    endpoint().deleteSshPublicKey,
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html
exports.TransferUser = () => ({
  type: "User",
  package: "transfer",
  client: "Transfer",
  propertiesDefault: {},
  omitProperties: [
    "Arn",
    "Role",
    "SshPublicKeyCount",
    "SshPublicKeys[].DateImported",
    "SshPublicKeys[].SshPublicKeyId",
    "ServerId",
  ],
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
      get("UserName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  dependencies: {
    efsFileSystem: {
      type: "FileSystem",
      group: "EFS",
      dependencyId:
        ({ lives, config }) =>
        ({ HomeDirectory }) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              type: "FileSystem",
              group: "EFS",
            }),
            find(pipe([get("live.FileSystemId"), isIn(HomeDirectory)])),
            get("id"),
          ])(),
    },
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
    s3Bucket: {
      type: "Bucket",
      group: "S3",
      dependencyId:
        ({ lives, config }) =>
        ({ HomeDirectory }) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              type: "Bucket",
              group: "S3",
            }),
            find(pipe([get("live.Name"), isIn(HomeDirectory)])),
            get("id"),
          ])(),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        HomeDirectory: pipe([
          get("HomeDirectory"),
          replaceWithName({
            groupType: "EFS::FileSystem",
            path: "live.FileSystemId",
            pathLive: "live.FileSystemId",
            providerConfig,
            lives,
            withSuffix: true,
          }),
        ]),
      }),
    ]),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#describeUser-property
  getById: {
    method: "describeUser",
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
            pipe([defaultsDeep({ ServerId: parent.ServerId }), getById({})]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#createUser-property
  create: {
    method: "createUser",
    pickCreated: ({ payload }) => pipe([identity]),
    postCreate:
      ({ endpoint, payload, created }) =>
      (live) =>
        pipe([
          () => payload,
          get("SshPublicKeys"),
          map(
            pipe([
              pick(["SshPublicKeyBody"]),
              defaultsDeep({
                UserName: payload.UserName,
                ServerId: payload.ServerId,
              }),
              endpoint().importSshPublicKey,
            ])
          ),
        ])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#updateUser-property
  // update: {
  //   method: "updateUser",
  //   filterParams: ({ pickId, payload, diff, live }) =>
  //     pipe([() => payload, defaultsDeep(pickId(live))])(),
  // },
  update:
    ({ endpoint, getById }) =>
    async ({ payload, live, diff }) =>
      pipe([
        () => ({ payload, live, diff }),
        updateResourceArray({
          endpoint,
          arrayPath: "SshPublicKeys",
          onAdd: importSshPublicKey,
          onRemove: deleteSshPublicKey,
        }),
        // TODO updateUser
      ])(),
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
