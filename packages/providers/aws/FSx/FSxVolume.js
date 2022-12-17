const assert = require("assert");
const { pipe, tap, get, pick, eq, map, omit } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTags } = require("../AwsCommon");

const { Tagger } = require("./FSxCommon");

const managedByOther = () => pipe([eq(get("Name"), "fsx_root")]);

const buildArn = () =>
  pipe([
    get("ResourceARN"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const pickId = pipe([
  tap(({ VolumeId }) => {
    assert(VolumeId);
  }),
  pick(["VolumeId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

const findId = () =>
  pipe([
    get("VolumeId"),
    tap((id) => {
      assert(id);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html
exports.FSxVolume = () => ({
  type: "Volume",
  package: "fsx",
  client: "FSx",
  managedByOther,
  cannotBeDeleted: managedByOther,
  propertiesDefault: {},
  omitProperties: [
    "VolumeId",
    "CreationTime",
    "Lifecycle",
    "AdministrativeActions",
    "LifecycleTransitionReason",
    "OntapConfiguration.StorageVirtualMachineId",
    "OntapConfiguration.UUID",
    "ResourceARN",
    "FileSystemId",
  ],
  inferName: () => get("Name"),
  findName: () => get("Name"),
  findId,
  dependencies: {
    fileSystem: {
      type: "FileSystem",
      group: "FSx",
      parent: true,
      dependencyId: ({ lives, config }) => get("FileSystemId"),
    },
    storageVirtualMachine: {
      type: "StorageVirtualMachine",
      group: "FSx",
      dependencyId: ({ lives, config }) =>
        get("OntapConfiguration.StorageVirtualMachineId"),
    },
  },
  ignoreErrorCodes: ["VolumeNotFound"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeVolumes-property
  getById: {
    method: "describeVolumes",
    getField: "Volumes",
    pickId: pipe([
      tap(({ VolumeId }) => {
        assert(VolumeId);
      }),
      ({ VolumeId }) => ({
        VolumeIds: [VolumeId],
      }),
    ]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#describeVolumes-property
  getList: {
    method: "describeVolumes",
    getParam: "Volumes",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#createVolume-property
  create: {
    method: "createVolume",
    pickCreated: ({ payload }) => pipe([get("Volume")]),
    isInstanceUp: pipe([eq(get("Lifecycle"), "CREATED")]),
    isInstanceError: pipe([eq(get("Lifecycle"), "FAILED")]),
    getErrorMessage: get("LifecycleTransitionReason.Message", "error"),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#updateVolume-property
  update: {
    method: "updateVolume",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/FSx.html#deleteVolume-property
  destroy: {
    shouldRetryOnExceptionMessages: [
      "Cannot delete volume while there is a backup in progress",
    ],
    method: "deleteVolume",
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
    dependencies: { fileSystem, storageVirtualMachine },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(fileSystem);
      }),
      () => otherProps,
      defaultsDeep({
        FileSystemId: getField(fileSystem, "FileSystemId"),
        Tags: buildTags({ name, config, namespace, UserTags: Tags }),
      }),
      when(
        () => storageVirtualMachine,
        defaultsDeep({
          OntapConfiguration: {
            StorageVirtualMachineId: getField(
              storageVirtualMachine,
              "StorageVirtualMachineId"
            ),
          },
        })
      ),
    ])(),
});
