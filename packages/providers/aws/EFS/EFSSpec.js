const assert = require("assert");
const { pipe, map, tap, omit, assign, get } = require("rubico");
const { defaultsDeep, prepend, last } = require("rubico/x");

const { compareAws, replaceAccountAndRegion } = require("../AwsCommon");
const { EFSFileSystem } = require("./EFSFileSystem");
const { EFSAccessPoint } = require("./EFSAccessPoint");
const { EFSMountTarget } = require("./EFSMountTarget");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html
const GROUP = "EFS";

const compareEFS = compareAws({});

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
      ],
      compare: compareEFS({
        filterAll: () => pipe([omit([])]),
      }),
      filterLive: ({ providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "AccessPoint",
      Client: EFSAccessPoint,
      dependencies: { fileSystem: { type: "FileSystem", group: "EFS" } },
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
      filterLive: ({ providerConfig }) =>
        pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "MountTarget",
      Client: EFSMountTarget,
      inferName: ({
        properties: { AvailabilityZoneName },
        dependenciesSpec: { fileSystem },
      }) =>
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
        fileSystem: { type: "FileSystem", group: "EFS", parent: true },
        subnet: { type: "Subnet", group: "EC2" },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
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
