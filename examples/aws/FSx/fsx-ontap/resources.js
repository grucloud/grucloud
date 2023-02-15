// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-d",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::vpc-default::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc-default",
    }),
  },
  {
    type: "FileSystem",
    group: "FSx",
    name: "my-ontap-fs",
    properties: ({}) => ({
      FileSystemType: "ONTAP",
      OntapConfiguration: {
        AutomaticBackupRetentionDays: 7,
        DailyAutomaticBackupStartTime: "09:30",
        DeploymentType: "SINGLE_AZ_1",
        DiskIopsConfiguration: {
          Mode: "AUTOMATIC",
        },
        ThroughputCapacity: 128,
        WeeklyMaintenanceStartTime: "7:03:00",
      },
      StorageCapacity: 1024,
      StorageType: "SSD",
    }),
    dependencies: ({}) => ({
      subnets: ["vpc-default::subnet-default-d"],
      securityGroups: ["sg::vpc-default::default"],
    }),
  },
  {
    type: "StorageVirtualMachine",
    group: "FSx",
    properties: ({}) => ({
      Name: "fsx",
      Subtype: "DEFAULT",
    }),
    dependencies: ({}) => ({
      fileSystem: "my-ontap-fs",
    }),
  },
  {
    type: "Volume",
    group: "FSx",
    properties: ({}) => ({
      Name: "vol1",
      OntapConfiguration: {
        CopyTagsToBackups: false,
        FlexCacheEndpointType: "NONE",
        JunctionPath: "/vol1",
        OntapVolumeType: "RW",
        SizeInMegabytes: 1048576,
        SnapshotPolicy: "default",
        StorageEfficiencyEnabled: false,
        StorageVirtualMachineRoot: false,
        TieringPolicy: {
          CoolingPeriod: 31,
          Name: "AUTO",
        },
      },
      VolumeType: "ONTAP",
    }),
    dependencies: ({}) => ({
      fileSystem: "my-ontap-fs",
      storageVirtualMachine: "my-ontap-fs::fsx",
    }),
  },
];