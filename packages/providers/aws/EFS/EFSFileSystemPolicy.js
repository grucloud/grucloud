const assert = require("assert");
const { pipe, tap, get, pick, assign } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const {
  assignPolicyAccountAndRegion,
  sortStatements,
} = require("../IAM/AwsIamCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const { ignoreErrorCodes } = require("./EFSCommon");

const pickId = pipe([
  tap(({ FileSystemId }) => {
    assert(FileSystemId);
  }),
  pick(["FileSystemId"]),
]);

const decorate = ({ endpoint, live }) =>
  pipe([assign({ Policy: pipe([get("Policy"), JSON.parse, sortStatements]) })]);

const filterPayload = pipe([
  assign({ Policy: pipe([get("Policy"), JSON.stringify]) }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
exports.EFSFileSystemPolicy = () => ({
  type: "FileSystemPolicy",
  package: "efs",
  client: "EFS",
  propertiesDefault: {},
  omitProperties: ["FileSystemId"],
  inferName:
    ({ dependenciesSpec: { fileSystem } }) =>
    ({}) =>
      pipe([
        tap((name) => {
          assert(fileSystem);
        }),
        () => `${fileSystem}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ FileSystemId }) =>
      pipe([
        () => FileSystemId,
        lives.getById({
          type: "FileSystem",
          group: "EFS",
          providerName: config.providerName,
        }),
        get("name", FileSystemId),
      ])(),

  findId: () =>
    pipe([
      get("FileSystemId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      assign({
        Policy: pipe([
          get("Policy"),
          assignPolicyAccountAndRegion({ providerConfig, lives }),
        ]),
      }),
    ]),
  ignoreErrorCodes,
  dependencies: {
    fileSystem: {
      type: "FileSystem",
      group: "EFS",
      parent: true,
      dependencyId: ({ lives, config }) =>
        pipe([
          get("FileSystemId"),
          tap((FileSystemId) => {
            assert(FileSystemId);
          }),
        ]),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#describeFileSystemPolicy-property
  getById: {
    method: "describeFileSystemPolicy",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#describeFileSystemPolicy-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "FileSystem", group: "EFS" },
          pickKey: pipe([
            pick(["FileSystemId"]),
            tap(({ FileSystemId }) => {
              assert(FileSystemId);
            }),
          ]),
          method: "describeFileSystemPolicy",
          config,
          decorate: ({ parent }) =>
            pipe([decorate({ endpoint, config, live: parent })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#putFileSystemPolicy-property
  create: {
    filterPayload,
    method: "putFileSystemPolicy",
    pickCreated: ({ payload }) => pipe([() => payload]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#putFileSystemPolicy-property
  update: {
    method: "putFileSystemPolicy",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, filterPayload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#deleteFileSystemPolicy-property
  destroy: {
    method: "deleteFileSystemPolicy",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: { fileSystem },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(fileSystem);
      }),
      () => otherProps,
      defaultsDeep({
        FileSystemId: getField(fileSystem, "FileSystemId"),
      }),
    ])(),
});
