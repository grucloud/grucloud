const { AwsProvider } = require("@grucloud/core");

const createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });
  const bucketName = "grucloud-s3bucket";

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property

  await provider.makeS3Bucket({
    name: `${bucketName}-basic`,
    properties: () => ({}),
  });

  //Tag
  await provider.makeS3Bucket({
    name: `${bucketName}-tag`,
    properties: () => ({
      Tagging: {
        TagSet: [
          {
            Key: "Key1",
            Value: "Value1",
          },
          {
            Key: "Key2",
            Value: "Value2",
          },
        ],
      },
    }),
  });

  // Versioning
  await provider.makeS3Bucket({
    name: `${bucketName}-versioning`,
    properties: () => ({
      VersioningConfiguration: {
        MFADelete: "Disabled",
        Status: "Enabled",
      },
    }),
  });

  // Website
  await provider.makeS3Bucket({
    name: `${bucketName}-website`,
    properties: () => ({
      ACL: "public-read",
      WebsiteConfiguration: {
        ErrorDocument: {
          Key: "error.html",
        },
        IndexDocument: {
          Suffix: "index.html",
        },
      },
    }),
  });

  // CORS
  await provider.makeS3Bucket({
    name: `${bucketName}-cors`,
    properties: () => ({
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["Authorization"],
            AllowedMethods: ["GET"],
            AllowedOrigins: ["*"],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    }),
  });

  // Logging
  const bucketLogDestination = `${bucketName}-log-destination`;
  await provider.makeS3Bucket({
    name: bucketLogDestination,
    properties: () => ({
      ACL: "log-delivery-write",
    }),
  });

  await provider.makeS3Bucket({
    name: `${bucketName}-logged`,
    properties: () => ({
      BucketLoggingStatus: {
        LoggingEnabled: {
          TargetBucket: bucketLogDestination,
          TargetGrants: [
            {
              Grantee: {
                Type: "Group",
                URI: "http://acs.amazonaws.com/groups/global/AllUsers",
              },
              Permission: "READ",
            },
          ],
          TargetPrefix: "MyBucketLogs/",
        },
      },
    }),
  });
  return { providers: [provider] };
};

module.exports = createStack;
