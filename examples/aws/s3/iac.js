const { AwsProvider } = require("@grucloud/core");
const path = require("path");
const createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });
  const bucketPrefix = "grucloud";

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const bucketName = `${bucketPrefix}-test-basic`;
  const bucket = await provider.makeS3Bucket({
    name: bucketName,
    properties: () => ({}),
  });

  // S3 object
  await provider.makeS3Object({
    name: `file-test`,
    dependencies: { bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      Tagging: "key1=value1&key2=value2",
      source: path.join(__dirname, "./fixtures/testFile.txt"),
    }),
  });

  // Accelerate
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAccelerateConfiguration-property
  await provider.makeS3Bucket({
    name: `${bucketPrefix}-acceleration`,
    properties: () => ({
      AccelerateConfiguration: {
        Status: "Enabled",
      },
    }),
  });

  await provider.makeS3Bucket({
    name: `${bucketName}-acl-grantread-log-delivery`,
    properties: () => ({
      GrantRead: "uri=http://acs.amazonaws.com/groups/s3/LogDelivery",
    }),
  });

  await provider.makeS3Bucket({
    name: `${bucketName}-lifecycleconfiguration`,
    properties: () => ({
      LifecycleConfiguration: {
        Rules: [
          {
            Expiration: {
              Days: 3650,
            },
            Filter: {
              Prefix: "documents/",
            },
            ID: "TestOnly",
            Status: "Enabled",
            Transitions: [
              {
                Days: 365,
                StorageClass: "GLACIER",
              },
            ],
          },
        ],
      },
    }),
  });

  //Tag
  await provider.makeS3Bucket({
    name: `${bucketPrefix}-tag`,
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
    name: `${bucketPrefix}-versioning`,
    properties: () => ({
      VersioningConfiguration: {
        MFADelete: "Disabled",
        Status: "Enabled",
      },
    }),
  });

  // Website
  await provider.makeS3Bucket({
    name: `${bucketPrefix}-website`,
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
    name: `${bucketPrefix}-cors`,
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
  const bucketLogDestination = `${bucketPrefix}-log-destination`;
  await provider.makeS3Bucket({
    name: bucketLogDestination,
    properties: () => ({
      ACL: "log-delivery-write",
    }),
  });

  await provider.makeS3Bucket({
    name: `${bucketPrefix}-logged`,
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
