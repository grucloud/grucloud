const assert = require("assert");
const { pipe, tap, get, pick, assign, fork } = require("rubico");
const { defaultsDeep, when, isIn, find, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ ExternalId, ServerId }) => {
    assert(ExternalId);
    assert(ServerId);
  }),
  pick(["ExternalId", "ServerId"]),
]);

const decorate = ({ endpoint, config, live }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
      assert(live.ServerId);
    }),
    defaultsDeep({ ServerId: live.ServerId }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html
exports.TransferAccess = () => ({
  type: "Access",
  package: "transfer",
  client: "Transfer",
  propertiesDefault: {},
  omitProperties: ["Role", "ServerId"],
  inferName: ({ dependenciesSpec: { server, s3Bucket, efsFileSystem } }) =>
    pipe([
      tap((params) => {
        assert(server);
        assert(s3Bucket || efsFileSystem);
      }),
      () => `${server}::${s3Bucket || efsFileSystem}`,
    ]),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          server: pipe([
            get("ServerId"),
            lives.getById({
              type: "Server",
              group: "Transfer",
              providerName: config.providerName,
            }),
            get("name"),
          ]),
          s3Bucket: pipe([
            lives.getByType({
              type: "Bucket",
              group: "S3",
              providerName: config.providerName,
            }),
            find(pipe([get("live.Name"), isIn(live.HomeDirectory)])),
            get("name"),
          ]),
          efsFileSystem: pipe([
            lives.getByType({
              type: "FileSystem",
              group: "EFS",
              providerName: config.providerName,
            }),
            find(pipe([get("live.FileSystemId"), isIn(live.HomeDirectory)])),
            get("name"),
          ]),
        }),
        tap(({ server, s3Bucket, efsFileSystem }) => {
          assert(server);
          assert(s3Bucket || efsFileSystem);
        }),
        ({ server, s3Bucket, efsFileSystem }) =>
          `${server}::${s3Bucket || efsFileSystem}`,
      ])(),
  findId: () =>
    pipe([({ ServerId, ExternalId }) => `${ServerId}::${ExternalId}`]),
  dependencies: {
    efsFileSystem: {
      type: "FileSystem",
      group: "EFS",
      dependencyId:
        ({ lives, config }) =>
        ({ HomeDirectory }) =>
          pipe([
            lives.getByType({
              type: "FileSystem",
              group: "EFS",
              providerName: config.providerName,
            }),
            find(pipe([get("live.FileSystemId"), isIn(HomeDirectory)])),
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
              type: "Bucket",
              group: "S3",
              providerName: config.providerName,
            }),
            find(pipe([get("live.Name"), isIn(HomeDirectory)])),
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#describeAccess-property
  getById: {
    method: "describeAccess",
    getField: "Access",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#listAccesses-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Server", group: "Transfer" },
          pickKey: pipe([pick(["ServerId"])]),
          method: "listAccesses",
          getParam: "Accesses",
          config,
          decorate: ({ parent }) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              decorate({ endpoint, config, live: parent }),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#createAccess-property
  create: {
    method: "createAccess",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#updateAccess-property
  update: {
    method: "updateAccess",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Transfer.html#deleteAccess-property
  destroy: {
    method: "deleteAccess",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { server, iamRole },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(server);
      }),
      () => otherProps,
      defaultsDeep({ ServerId: getField(server, "ServerId") }),
      when(() => iamRole, assign({ Role: () => getField(iamRole, "Arn") })),
    ])(),
});
