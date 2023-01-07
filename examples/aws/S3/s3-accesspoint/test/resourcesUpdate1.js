// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "AccessPoint",
    group: "S3Control",
    properties: ({ config }) => ({
      Bucket: "gc-buclet-accesspoint-test",
      Name: "my-accesspoint",
      NetworkOrigin: "Internet",
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        IgnorePublicAcls: true,
        BlockPublicPolicy: true,
        RestrictPublicBuckets: true,
      },
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: ["s3:GetObject", "s3:PutObject"],
            Resource: `arn:aws:s3:${
              config.region
            }:${config.accountId()}:accesspoint/my-accesspoint/object/Jane/*`,
          },
          {
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::${config.accountId()}:root`,
            },
            Action: ["s3:GetObject", "s3:PutObject"],
            Resource: `arn:aws:s3:${
              config.region
            }:${config.accountId()}:accesspoint/my-accesspoint/object/Tarzan/*`,
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      s3Bucket: "gc-buclet-accesspoint-test",
    }),
  },
];
