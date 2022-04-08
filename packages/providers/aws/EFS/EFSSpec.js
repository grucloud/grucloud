const assert = require("assert");
const { pipe, map, tap, omit, assign, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

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
      propertiesDefault: {},
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
      propertiesDefault: {},
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
      dependencies: {
        fileSystem: { type: "FileSystem", group: "EFS", parent: true },
        subnet: { type: "Subnet", group: "EC2" },
        securityGroups: { type: "SecurityGroup", group: "EC2", list: true },
      },
      propertiesDefault: {},
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
      filterLive: ({ providerConfig }) =>
        pipe([
          assign({
            AvailabilityZoneName: pipe([
              get("AvailabilityZoneName"),
              replaceAccountAndRegion({ providerConfig }),
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
