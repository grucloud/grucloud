// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName: "sam-app-PipeRole-1AM1EBAGJ996A",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "pipes.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Statement: [
              {
                Action: [
                  "kinesis:DescribeStream",
                  "kinesis:DescribeStreamSummary",
                  "kinesis:GetRecords",
                  "kinesis:GetShardIterator",
                  "kinesis:ListStreams",
                  "kinesis:ListShards",
                ],
                Effect: "Allow",
                Resource: `arn:aws:kinesis:${
                  config.region
                }:${config.accountId()}:stream/sam-app-source`,
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "sam-app-source-policy",
        },
        {
          PolicyDocument: {
            Statement: [
              {
                Action: ["kinesis:PutRecord", "kinesis:PutRecords"],
                Effect: "Allow",
                Resource: [
                  `arn:aws:kinesis:${
                    config.region
                  }:${config.accountId()}:stream/sam-app-new-customers-target`,
                  `arn:aws:kinesis:${
                    config.region
                  }:${config.accountId()}:stream/sam-app-existing-customers-target`,
                ],
              },
            ],
            Version: "2012-10-17",
          },
          PolicyName: "sam-app-target-policy",
        },
      ],
    }),
  },
  {
    type: "Stream",
    group: "Kinesis",
    properties: ({}) => ({
      StreamName: "sam-app-existing-customers-target",
      ShardCount: 1,
    }),
  },
  {
    type: "Stream",
    group: "Kinesis",
    properties: ({}) => ({
      StreamName: "sam-app-new-customers-target",
      ShardCount: 1,
    }),
  },
  {
    type: "Stream",
    group: "Kinesis",
    properties: ({}) => ({
      StreamName: "sam-app-source",
      ShardCount: 1,
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({}) => ({
      Name: "sam-app-existing-customer",
      SourceParameters: {
        FilterCriteria: {
          Filters: [
            {
              Pattern: {
                data: {
                  type: ["EXISTING_CUSTOMER"],
                },
              },
            },
          ],
        },
        KinesisStreamParameters: {
          BatchSize: 1,
          StartingPosition: "LATEST",
        },
      },
      TargetParameters: {
        KinesisStreamParameters: {
          PartitionKey: "1",
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-PipeRole-1AM1EBAGJ996A",
      sourceKinesisStream: "sam-app-source",
      targetKinesisStream: "sam-app-existing-customers-target",
    }),
  },
  {
    type: "Pipe",
    group: "Pipes",
    properties: ({}) => ({
      Name: "sam-app-new-customer",
      SourceParameters: {
        FilterCriteria: {
          Filters: [
            {
              Pattern: {
                data: {
                  type: ["NEW_CUSTOMER"],
                },
              },
            },
          ],
        },
        KinesisStreamParameters: {
          BatchSize: 1,
          StartingPosition: "LATEST",
        },
      },
      TargetParameters: {
        KinesisStreamParameters: {
          PartitionKey: "1",
        },
      },
    }),
    dependencies: ({}) => ({
      iamRole: "sam-app-PipeRole-1AM1EBAGJ996A",
      sourceKinesisStream: "sam-app-source",
      targetKinesisStream: "sam-app-new-customers-target",
    }),
  },
];
