// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/aws/fsx/lustre",
    }),
  },
  { type: "Vpc", group: "EC2", name: "vpc-default", isDefault: true },
  {
    type: "Subnet",
    group: "EC2",
    name: "subnet-default-a",
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
      FromPort: 988,
      IpProtocol: "tcp",
      IpRanges: [
        {
          CidrIp: "0.0.0.0/0",
        },
      ],
      ToPort: 988,
    }),
    dependencies: ({}) => ({
      securityGroup: "sg::vpc-default::default",
    }),
  },
  {
    type: "FileSystem",
    group: "FSx",
    name: "my-lustre-fs",
    properties: ({}) => ({
      FileSystemType: "LUSTRE",
      FileSystemTypeVersion: "2.12",
      LustreConfiguration: {
        AutomaticBackupRetentionDays: 7,
        CopyTagsToBackups: false,
        DailyAutomaticBackupStartTime: "08:30",
        DataCompressionType: "NONE",
        DeploymentType: "PERSISTENT_2",
        LogConfiguration: {
          Level: "DISABLED",
        },
        PerUnitStorageThroughput: 125,
        WeeklyMaintenanceStartTime: "4:06:00",
      },
      StorageCapacity: 1200,
      StorageType: "SSD",
    }),
    dependencies: ({}) => ({
      securityGroups: ["sg::vpc-default::default"],
      subnets: ["vpc-default::subnet-default-a"],
    }),
  },
];
