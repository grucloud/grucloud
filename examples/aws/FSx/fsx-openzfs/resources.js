// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-b",
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
    type: "SecurityGroupRuleIngress",
    group: "EC2",
    properties: ({}) => ({
      FromPort: 2049,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 2049,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-default::default",
    }),
  },
  {
    type: "FileSystem",
    group: "FSx",
    name: "my-openzfs",
    properties: ({}) => ({
      FileSystemType: "OPENZFS",
      OpenZFSConfiguration: {
        AutomaticBackupRetentionDays: 7,
        CopyTagsToBackups: false,
        CopyTagsToVolumes: false,
        DailyAutomaticBackupStartTime: "03:00",
        DeploymentType: "SINGLE_AZ_2",
        DiskIopsConfiguration: {
          Mode: "AUTOMATIC",
        },
        ThroughputCapacity: 160,
        WeeklyMaintenanceStartTime: "6:05:30",
      },
      StorageCapacity: 64,
      StorageType: "SSD",
    }),
    dependencies: ({}) => ({
      subnets: ["vpc-default::subnet-default-b"],
    }),
  },
];
