const assert = require("assert");
const { pipe, tap, get, fork } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { replaceWithName } = require("@grucloud/core/Common");

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html
exports.DirectoryServiceSharedDirectory = () => ({
  type: "SharedDirectory",
  package: "directory-service",
  client: "DirectoryService",
  propertiesDefault: {
    ShareTarget: {
      Type: "ACCOUNT",
    },
  },
  omitProperties: [
    "OwnerAccountId",
    "OwnerDirectoryId",
    "ShareTarget",
    "ShareStatus",
    "CreatedDateTime",
    "LastUpdatedDateTime",
    "SharedDirectoryId",
    "SharedAccountId",
  ],
  inferName:
    ({ dependenciesSpec: { account, directory } }) =>
    ({}) =>
      pipe([
        tap((params) => {
          assert(account);
          assert(directory);
        }),
        () => `${directory}::${account}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        () => live,
        fork({
          account: pipe([
            get("SharedAccountId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Account",
              group: "Organisations",
              providerName: config.providerName,
            }),
            get("name", live.SharedAccountId),
          ]),
          directory: pipe([
            get("OwnerDirectoryId"),
            tap((id) => {
              assert(id);
            }),
            lives.getById({
              type: "Directory",
              group: "DirectoryService",
              providerName: config.providerName,
            }),
            get("name", live.OwnerDirectoryId),
          ]),
        }),
        ({ account, directory }) => `${directory}::${account}`,
      ])(),
  findId:
    () =>
    ({ OwnerDirectoryId, SharedAccountId }) =>
      pipe([
        tap(() => {
          assert(SharedAccountId);
          assert(OwnerDirectoryId);
        }),
        () => `${OwnerDirectoryId}::${SharedAccountId}`,
      ])(),
  ignoreErrorCodes: ["EntityDoesNotExistException"],
  dependencies: {
    account: {
      type: "Account",
      group: "Organisations",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("SharedAccountId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
    directory: {
      type: "Directory",
      group: "DirectoryService",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("OwnerDirectoryId"),
          tap((id) => {
            assert(id);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#describeSharedDirectories-property
  getById: {
    method: "describeSharedDirectories",
    getField: "SharedDirectories",
    pickId: pipe([
      tap((params) => {
        assert(true);
      }),
      tap(({ OwnerDirectoryId, SharedDirectoryId }) => {
        assert(SharedDirectoryId);
        assert(OwnerDirectoryId);
      }),
      ({ OwnerDirectoryId, SharedDirectoryId }) => ({
        OwnerDirectoryId: OwnerDirectoryId,
        SharedDirectoryIds: [SharedDirectoryId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#describeSharedDirectories-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Directory", group: "DirectoryService" },
          pickKey: pipe([
            ({ DirectoryId }) => ({ OwnerDirectoryId: DirectoryId }),
          ]),
          method: "describeSharedDirectories",
          getParam: "SharedDirectories",
          config,
          decorate,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#shareDirectory-property
  create: {
    filterPayload: pipe([
      ({ OwnerDirectoryId, SharedAccountId, ...other }) => ({
        ...other,
        DirectoryId: OwnerDirectoryId,
        ShareTarget: { Id: SharedAccountId, Type: "ACCOUNT" },
      }),
    ]),
    method: "shareDirectory",
    pickCreated: ({ payload }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        defaultsDeep(payload),
      ]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectoryService.html#deleteSharedDirectory-property
  destroy: {
    method: "unshareDirectory",
    pickId: ({ OwnerDirectoryId, SharedAccountId }) =>
      pipe([
        tap((params) => {
          assert(OwnerDirectoryId);
          assert(SharedAccountId);
        }),
        () => ({
          DirectoryId: OwnerDirectoryId,
          UnshareTarget: { Id: SharedAccountId, Type: "ACCOUNT" },
        }),
      ])(),
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { account, directory },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(account);
        assert(directory);
      }),
      () => otherProps,
      defaultsDeep({
        OwnerDirectoryId: getField(directory, "DirectoryId"),
        SharedAccountId: getField(account, "Id"),
      }),
    ])(),
});
