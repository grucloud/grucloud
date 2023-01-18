const assert = require("assert");
const { pipe, map, tap, omit, assign, get, eq } = require("rubico");
const { defaultsDeep, prepend, last, find, when } = require("rubico/x");

const { compareAws, replaceAccountAndRegion } = require("../AwsCommon");
const { EFSFileSystem } = require("./EFSFileSystem");
const { EFSAccessPoint } = require("./EFSAccessPoint");
const { EFSMountTarget } = require("./EFSMountTarget");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
const GROUP = "EFS";

const compareEFS = compareAws({});

const dependencyIdFileSystem =
  ({ lives, config }) =>
  (live) =>
    pipe([
      lives.getByType({
        type: "FileSystem",
        group: "EFS",
        providerName: config.providerName,
      }),
      find(eq(get("live.FileSystemId"), live.FileSystemId)),
      get("id"),
    ])();

module.exports = pipe([
  () => [
    {
      type: "FileSystem",
      Client: EFSFileSystem,
      omitProperties: [
        "FileSystemArn",
        "CreationTime",
        "CreationToken",
        "FileSystemId",
        "LifeCycleState",
        "NumberOfMountTargets",
        "OwnerId",
        "SizeInBytes",
        "Name",
        "KmsKeyId",
        "AvailabilityZoneId",
      ],
      propertiesDefault: {
        Encrypted: true,
        PerformanceMode: "generalPurpose",
        ThroughputMode: "bursting",
      },
      compare: compareEFS({
        filterAll: () => pipe([omit([])]),
      }),
      dependencies: {
        kmsKey: {
          type: "Key",
          group: "KMS",
          excludeDefaultDependencies: true,
          dependencyId: ({ lives, config }) => get("KmsKeyId"),
        },
      },
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          when(
            get("AvailabilityZoneName"),
            assign({
              AvailabilityZoneName: pipe([
                get("AvailabilityZoneName"),
                replaceAccountAndRegion({ providerConfig, lives }),
              ]),
            })
          ),
        ]),
    },
    {
      type: "AccessPoint",
      Client: EFSAccessPoint,
      dependencies: {
        fileSystem: {
          type: "FileSystem",
          group: "EFS",
          dependencyId: dependencyIdFileSystem,
        },
      },
      omitProperties: [
        "ClientToken",
        "AccessPointId",
        "AccessPointArn",
        "FileSystemId",
        "OwnerId",
        "LifeCycleState",
        "Name",
      ],
      compare: compareEFS({
        filterAll: () => pipe([omit([])]),
      }),
    },
    {
      type: "MountTarget",
      Client: EFSMountTarget,
      inferName:
        ({ dependenciesSpec: { fileSystem } }) =>
        ({ AvailabilityZoneName }) =>
          pipe([
            tap(() => {
              assert(fileSystem);
              assert(AvailabilityZoneName);
            }),
            () => AvailabilityZoneName,
            last,
            prepend("::"),
            prepend(fileSystem),
            prepend("mount-target::"),
          ])(),
      dependencies: {
        fileSystem: {
          type: "FileSystem",
          group: "EFS",
          parent: true,
          dependencyId: dependencyIdFileSystem,
        },
        subnet: {
          type: "Subnet",
          group: "EC2",
          dependencyId: ({ lives, config }) => get("SubnetId"),
        },
        securityGroups: {
          type: "SecurityGroup",
          group: "EC2",
          list: true,
          dependencyIds: ({ lives, config }) => get("SecurityGroups"),
        },
      },
      omitProperties: [
        "ClientToken",
        "AccessPointId",
        "AccessPointArn",
        "FileSystemId",
        "OwnerId",
        "MountTargetId",
        "AvailabilityZoneId",
        "LifeCycleState",
        "NetworkInterfaceId",
        "SubnetId",
        "VpcId",
        "SecurityGroups",
        "IpAddress",
      ],
      compare: compareEFS({
        filterAll: () => pipe([omit([])]),
      }),
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          assign({
            AvailabilityZoneName: pipe([
              get("AvailabilityZoneName"),
              replaceAccountAndRegion({ providerConfig, lives }),
            ]),
          }),
        ]),
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      compare: compareEFS({}),
    })
  ),
]);
