// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "/aws/kinesisfirehose/delivery-stream-s3",
    }),
  },
  {
    type: "LogGroup",
    group: "CloudWatchLogs",
    properties: ({}) => ({
      logGroupName: "elasticache/redis",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private1-${config.region}a`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTable",
    group: "EC2",
    name: ({ config }) => `rtb-private2-${config.region}b`,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private1-${config.region}a`,
      subnet: `vpc::subnet-private1-${config.region}a`,
    }),
  },
  {
    type: "RouteTableAssociation",
    group: "EC2",
    dependencies: ({ config }) => ({
      routeTable: `vpc::rtb-private2-${config.region}b`,
      subnet: `vpc::subnet-private2-${config.region}b`,
    }),
  },
  {
    type: "SecurityGroup",
    group: "EC2",
    name: "sg::vpc::default",
    isDefault: true,
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private1-${config.region}a`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}a`,
      NewBits: 4,
      NetworkNumber: 8,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Subnet",
    group: "EC2",
    name: ({ config }) => `subnet-private2-${config.region}b`,
    properties: ({ config }) => ({
      AvailabilityZone: `${config.region}b`,
      NewBits: 4,
      NetworkNumber: 9,
    }),
    dependencies: ({}) => ({
      vpc: "vpc",
    }),
  },
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "10.0.0.0/16",
      DnsHostnames: true,
    }),
  },
  {
    type: "CacheParameterGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      CacheParameterGroupFamily: "redis7",
      CacheParameterGroupName: "my-parameter-group",
      Description: "My Parameter Group",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
  {
    type: "CacheSubnetGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      CacheSubnetGroupDescription: " ",
      CacheSubnetGroupName: "my-subnet-group",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `vpc::subnet-private1-${config.region}a`,
        `vpc::subnet-private2-${config.region}b`,
      ],
    }),
  },
  {
    type: "ReplicationGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      AtRestEncryptionEnabled: true,
      AutoMinorVersionUpgrade: true,
      CacheNodeType: "cache.t3.micro",
      CacheParameterGroupName: "my-parameter-group",
      CacheSubnetGroupName: "my-subnet-group",
      ClusterEnabled: false,
      LogDeliveryConfigurations: [
        {
          DestinationDetails: {
            KinesisFirehoseDetails: {
              DeliveryStream: "delivery-stream-s3",
            },
          },
          DestinationType: "kinesis-firehose",
          LogFormat: "json",
          LogType: "slow-log",
        },
      ],
      ReplicationGroupDescription: "my description",
      ReplicationGroupId: "my-redis-cluster",
      SnapshotWindow: "05:00-06:00",
      NumCacheClusters: 3,
    }),
    dependencies: ({}) => ({
      firehoseDeliveryStreams: ["delivery-stream-s3"],
      parameterGroup: "my-parameter-group",
      securityGroups: ["sg::vpc::default"],
      snsTopic: "topic-elasticache-redis.fifo",
      subnetGroup: "my-subnet-group",
    }),
  },
  {
    type: "User",
    group: "ElastiCache",
    properties: ({}) => ({
      AccessString: "on ~* +@all",
      AuthenticationMode: {
        Type: "password",
      },
      Engine: "redis",
      UserId: "myuser",
      UserName: "myuser",
      Passwords: JSON.parse(process.env.MYUSER_ELASTICACHE_USER_PASSWORDS),
    }),
  },
  {
    type: "UserGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      Engine: "redis",
      UserGroupId: "mygroup",
      UserIds: ["default", "myuser"],
    }),
    dependencies: ({}) => ({
      users: ["myuser"],
    }),
  },
  {
    type: "DeliveryStream",
    group: "Firehose",
    properties: ({ config, getId }) => ({
      DeliveryStreamName: "delivery-stream-s3",
      DeliveryStreamType: "DirectPut",
      ExtendedS3DestinationConfiguration: {
        BucketARN: `arn:aws:s3:::gc-firehose-destination-${config.accountId()}`,
        BufferingHints: {
          IntervalInSeconds: 300,
          SizeInMBs: 5,
        },
        CloudWatchLoggingOptions: {
          Enabled: true,
          LogGroupName: "/aws/kinesisfirehose/delivery-stream-s3",
          LogStreamName: "DestinationDelivery",
        },
        CompressionFormat: "UNCOMPRESSED",
        DataFormatConversionConfiguration: {
          Enabled: false,
        },
        EncryptionConfiguration: {
          NoEncryptionConfig: "NoEncryption",
        },
        ErrorOutputPrefix: "",
        Prefix: "",
        RoleARN: `${getId({
          type: "Role",
          group: "IAM",
          name: `KinesisFirehoseServiceRole-delivery-stre-${config.region}-1667077117902`,
        })}`,
        S3BackupMode: "Disabled",
      },
      Tags: [
        {
          Key: "LogDeliveryEnabled",
          Value: "true",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      s3BucketDestination: `gc-firehose-destination-${config.accountId()}`,
      roles: [
        `KinesisFirehoseServiceRole-delivery-stre-${config.region}-1667077117902`,
      ],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({ config }) => ({
      PolicyName: `KinesisFirehoseServicePolicy-delivery-stream-s3-${config.region}`,
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "glue:GetTable",
              "glue:GetTableVersion",
              "glue:GetTableVersions",
            ],
            Resource: [
              `arn:aws:glue:${config.region}:${config.accountId()}:catalog`,
              `arn:aws:glue:${
                config.region
              }:${config.accountId()}:database/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
              `arn:aws:glue:${
                config.region
              }:${config.accountId()}:table/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "s3:AbortMultipartUpload",
              "s3:GetBucketLocation",
              "s3:GetObject",
              "s3:ListBucket",
              "s3:ListBucketMultipartUploads",
              "s3:PutObject",
            ],
            Resource: [
              `arn:aws:s3:::gc-firehose-destination-${config.accountId()}`,
              `arn:aws:s3:::gc-firehose-destination-${config.accountId()}/*`,
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "lambda:InvokeFunction",
              "lambda:GetFunctionConfiguration",
            ],
            Resource: `arn:aws:lambda:${
              config.region
            }:${config.accountId()}:function:%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
          },
          {
            Effect: "Allow",
            Action: ["kms:GenerateDataKey", "kms:Decrypt"],
            Resource: [
              `arn:aws:kms:${
                config.region
              }:${config.accountId()}:key/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
            Condition: {
              StringEquals: {
                "kms:ViaService": `s3.${config.region}.amazonaws.com`,
              },
              StringLike: {
                "kms:EncryptionContext:aws:s3:arn": [
                  "arn:aws:s3:::%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%/*",
                  "arn:aws:s3:::%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%",
                ],
              },
            },
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: ["logs:PutLogEvents"],
            Resource: [
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:/aws/kinesisfirehose/delivery-stream-s3:log-stream:*`,
              `arn:aws:logs:${
                config.region
              }:${config.accountId()}:log-group:%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%:log-stream:*`,
            ],
          },
          {
            Sid: "",
            Effect: "Allow",
            Action: [
              "kinesis:DescribeStream",
              "kinesis:GetShardIterator",
              "kinesis:GetRecords",
              "kinesis:ListShards",
            ],
            Resource: `arn:aws:kinesis:${
              config.region
            }:${config.accountId()}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
          },
          {
            Effect: "Allow",
            Action: ["kms:Decrypt"],
            Resource: [
              `arn:aws:kms:${
                config.region
              }:${config.accountId()}:key/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
            ],
            Condition: {
              StringEquals: {
                "kms:ViaService": `kinesis.${config.region}.amazonaws.com`,
              },
              StringLike: {
                "kms:EncryptionContext:aws:kinesis:arn": `arn:aws:kinesis:${
                  config.region
                }:${config.accountId()}:stream/%FIREHOSE_POLICY_TEMPLATE_PLACEHOLDER%`,
              },
            },
          },
        ],
      },
      Path: "/service-role/",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: `KinesisFirehoseServiceRole-delivery-stre-${config.region}-1667077117902`,
      Path: "/service-role/",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "firehose.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
    }),
    dependencies: ({ config }) => ({
      policies: [
        `KinesisFirehoseServicePolicy-delivery-stream-s3-${config.region}`,
      ],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `gc-firehose-destination-${config.accountId()}`,
    }),
  },
  {
    type: "Topic",
    group: "SNS",
    name: "topic-elasticache-redis.fifo",
    properties: ({}) => ({
      Attributes: {
        ContentBasedDeduplication: "false",
        FifoTopic: "true",
      },
    }),
  },
];
