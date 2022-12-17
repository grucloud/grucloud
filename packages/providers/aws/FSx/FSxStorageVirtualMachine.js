const assert = require("assert");
const { pipe, tap, get, pick, eq, map, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./FSxCommon");

const buildArn = () =>
  pipe([
    get("ResourceARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ StorageVirtualMachineId }) => {
    assert(StorageVirtualMachineId);
  }),
  pick(["StorageVirtualMachineId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findId = () =>
  pipe([
    get("StorageVirtualMachineId"),
    tap((id) => {
      assert(id);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html
exports.FSxStorageVirtualMachine = () => ({
  type: "StorageVirtualMachine",
  package: "fsx",
  client: "FSx",
  propertiesDefault: {},
  omitProperties: [
    "StorageVirtualMachineId",
    "OwnerId",
    "CreationTime",
    "Endpoints",
    "FileSystemId",
    "ResourceARN",
    "Lifecycle",
    "UUID",
  ],
  inferName:
    ({ dependenciesSpec: { fileSystem } }) =>
    ({ Name }) =>
      pipe([
        tap((params) => {
          assert(fileSystem);
          assert(Name);
        }),
        () => `${fileSystem}::${Name}`,
      ])(),
  findName:
    ({ lives, config }) =>
    ({ FileSystemId, Name }) =>
      pipe([
        () => FileSystemId,
        lives.getById({
          type: "FileSystem",
          group: "FSx",
          providerName: config.providerName,
        }),
        get("name"),
        tap((params) => {
          assert(true);
        }),
        (fileSystemName) => `${fileSystemName}::${Name}`,
      ])(),

  findId,
  dependencies: {
    fileSystem: {
      type: "FileSystem",
      group: "FSx",
      parent: true,
      dependencyId: ({ lives, config }) => get("FileSystemId"),
    },
    // TODO Directory Service
  },
  ignoreErrorCodes: ["StorageVirtualMachineNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeStorageVirtualMachines-property
  getById: {
    method: "describeStorageVirtualMachines",
    getField: "StorageVirtualMachines",
    pickId: pipe([
      tap(({ StorageVirtualMachineId }) => {
        assert(StorageVirtualMachineId);
      }),
      ({ StorageVirtualMachineId }) => ({
        StorageVirtualMachineIds: [StorageVirtualMachineId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeStorageVirtualMachines-property
  getList: {
    method: "describeStorageVirtualMachines",
    getParam: "StorageVirtualMachines",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#createStorageVirtualMachine-property
  create: {
    method: "createStorageVirtualMachine",
    pickCreated: ({ payload }) => pipe([get("StorageVirtualMachine")]),
    isInstanceUp: pipe([eq(get("Lifecycle"), "CREATED")]),
    isInstanceError: pipe([eq(get("Lifecycle"), "FAILED")]),
    getErrorMessage: get("LifecycleTransitionReason.Message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#updateStorageVirtualMachine-property
  update: {
    method: "updateStorageVirtualMachine",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#deleteStorageVirtualMachine-property
  destroy: {
    method: "deleteStorageVirtualMachine",
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
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
    ])(),
});
