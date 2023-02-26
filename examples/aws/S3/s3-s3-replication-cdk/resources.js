// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Role",
    group: "IAM",
    properties: ({ config }) => ({
      RoleName:
        "S3S3ReplicationCdkStack-S3ReplicationRole1D0B9EBD-19GAAR1BF3UGM",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Service: "s3.amazonaws.com",
            },
            Action: "sts:AssumeRole",
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: [
                  "s3:GetObjectLegalHold",
                  "s3:GetObjectRetention",
                  "s3:GetObjectVersionAcl",
                  "s3:GetObjectVersionForReplication",
                  "s3:GetObjectVersionTagging",
                  "s3:GetReplicationConfiguration",
                  "s3:ListBucket",
                ],
                Resource: [
                  `arn:aws:s3:::my-destination-bucket-1-${
                    config.region
                  }-${config.accountId()}/*`,
                  `arn:aws:s3:::my-destination-bucket-1-${
                    config.region
                  }-${config.accountId()}`,
                  `arn:aws:s3:::my-destination-bucket-2-${
                    config.region
                  }-${config.accountId()}/*`,
                  `arn:aws:s3:::my-destination-bucket-2-${
                    config.region
                  }-${config.accountId()}`,
                  `arn:aws:s3:::my-source-bucket-${
                    config.region
                  }-${config.accountId()}/*`,
                  `arn:aws:s3:::my-source-bucket-${
                    config.region
                  }-${config.accountId()}`,
                ],
                Effect: "Allow",
              },
              {
                Action: [
                  "s3:ObjectOwnerOverrideToBucketOwner",
                  "s3:ReplicateDelete",
                  "s3:ReplicateObject",
                  "s3:ReplicateTags",
                ],
                Resource: [
                  `arn:aws:s3:::my-destination-bucket-1-${
                    config.region
                  }-${config.accountId()}/*`,
                  `arn:aws:s3:::my-destination-bucket-2-${
                    config.region
                  }-${config.accountId()}/*`,
                  `arn:aws:s3:::my-source-bucket-${
                    config.region
                  }-${config.accountId()}/*`,
                ],
                Effect: "Allow",
              },
            ],
          },
          PolicyName: "S3Permissions",
        },
      ],
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `my-destination-bucket-1-${config.region}-${config.accountId()}`,
      VersioningConfiguration: {
        Status: "Enabled",
      },
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `my-destination-bucket-2-${config.region}-${config.accountId()}`,
      VersioningConfiguration: {
        Status: "Enabled",
      },
    }),
  },
  {
    type: "Bucket",
    group: "S3",
    properties: ({ config }) => ({
      Name: `my-source-bucket-${config.region}-${config.accountId()}`,
      ReplicationConfiguration: {
        Role: `arn:aws:iam::${config.accountId()}:role/S3S3ReplicationCdkStack-S3ReplicationRole1D0B9EBD-19GAAR1BF3UGM`,
        Rules: [
          {
            ID: "401a1127-294f-4b90-b071-63b50f03eead",
            Priority: 2,
            Filter: {
              Prefix: "data/",
            },
            Status: "Enabled",
            Destination: {
              Bucket:
                "arn:aws:s3:::my-destination-bucket-2-us-east-1-840541460064",
            },
            DeleteMarkerReplication: {
              Status: "Enabled",
            },
          },
          {
            ID: "e82b3b9e-53d8-43b7-828e-c2c57e6d7eed",
            Priority: 1,
            Filter: {
              Prefix: "images/",
            },
            Status: "Enabled",
            Destination: {
              Bucket:
                "arn:aws:s3:::my-destination-bucket-1-us-east-1-840541460064",
            },
            DeleteMarkerReplication: {
              Status: "Enabled",
            },
          },
        ],
      },
      VersioningConfiguration: {
        Status: "Enabled",
      },
    }),
  },
];