const { AwsProvider } = require("@grucloud/core");
const path = require("path");
const hooks = require("./hooks");

const createResources = async ({ provider }) => {
  const bucketPrefix = "grucloud";
  const bucketName = `${bucketPrefix}-test-basic`;
  const bucketLogDestination = `${bucketPrefix}-log-destination`;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const bucketBasic = await provider.makeS3Bucket({
    name: bucketName,
    properties: () => ({}),
  });

  const logDestination = await provider.makeS3Bucket({
    name: bucketLogDestination,
    properties: () => ({
      ACL: "log-delivery-write",
    }),
  });

  /*
  await provider.makeS3Bucket({
    name: `${bucketName}-acl-grantread-log-delivery`,
    properties: () => ({
      GrantRead: "uri=http://acs.amazonaws.com/groups/s3/LogDelivery",
    }),
  });
*/
  return {
    objects: {
      fileTest: await provider.makeS3Object({
        name: `file-test`,
        dependencies: { bucket: bucketBasic },
        properties: () => ({
          ACL: "public-read",
          ContentType: "text/plain",
          Tagging: "key1=value1&key2=value2",
          source: path.join(__dirname, "./fixtures/testFile.txt"),
        }),
      }),
    },
    buckets: {
      basic: bucketBasic,
      // Accelerate
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAccelerateConfiguration-property
      acceleration: await provider.makeS3Bucket({
        name: `${bucketPrefix}-acceleration`,
        properties: () => ({
          AccelerateConfiguration: {
            Status: "Enabled",
          },
        }),
      }),
      // CORS
      CORS: await provider.makeS3Bucket({
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
      }),
      // Encryption
      encryption: await provider.makeS3Bucket({
        name: `${bucketPrefix}-encryption`,
        properties: () => ({
          ServerSideEncryptionConfiguration: {
            Rules: [
              {
                ApplyServerSideEncryptionByDefault: {
                  SSEAlgorithm: "AES256",
                },
              },
            ],
          },
        }),
      }),
      // LifecycleConfiguation
      lifecycleConfiguation: await provider.makeS3Bucket({
        name: `${bucketPrefix}-lifecycleconfiguration`,
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
      }),
      logDestination,

      /*
        logged: await provider.makeS3Bucket({
          name: `${bucketPrefix}-logged`,
          dependencies: { bucket: logDestination },
          properties: () => ({
            BucketLoggingStatus: {
              LoggingEnabled: {
                TargetBucket: logDestination.name,
                TargetGrants: [
                  {
                    Grantee: {
                      Type: "Group",
                      URI: "http://acs.amazonaws.com/groups/global/AllUsers",
                    },
                    Permission: "WRITE",
                  },
                  {
                    Grantee: {
                      Type: "Group",
                      URI: "http://acs.amazonaws.com/groups/global/AllUsers",
                    },
                    Permission: "READ_ACP",
                  },
                ],
                TargetPrefix: "MyBucketLogs/",
              },
            },
          }),
        }),*/
      /*
        notificationConfiguration: await provider.makeS3Bucket({
          name: `${bucketPrefix}-notification-configuration`,
          properties: () => ({
            NotificationConfiguration: {
              TopicConfigurations: [
                {
                  Events: ["s3:ObjectCreated:*"],
                  TopicArn:
                    "arn:aws:sns:us-west-2:123456789012:s3-notification-topic",
                },
              ],
            },
          }),
        }),*/

      policy: await provider.makeS3Bucket({
        name: `${bucketPrefix}-policy`,
        properties: () => ({
          Policy: JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "IPAllow",
                Effect: "Deny",
                Principal: "*",
                Action: "s3:*",
                Resource: `arn:aws:s3:::${bucketPrefix}-policy/*`,
                Condition: {
                  IpAddress: { "aws:SourceIp": "8.8.8.8/32" },
                },
              },
            ],
          }),
        }),
      }),
      //TODO policy Status
      /*
        replicationConfiguration: await provider.makeS3Bucket({
          name: `${bucketPrefix}-replication-configuration`,
          properties: () => ({
            ReplicationConfiguration: {
              Role: "arn:aws:iam::123456789012:role/examplerole",
              Rules: [
                {
                  Destination: {
                    Bucket: "arn:aws:s3:::destinationbucket",
                    StorageClass: "STANDARD",
                  },
                  Prefix: "",
                  Status: "Enabled",
                },
              ],
            },
          }),
        }),*/
      requestPayment: await provider.makeS3Bucket({
        name: `${bucketPrefix}-request-payment`,
        properties: () => ({
          RequestPaymentConfiguration: { Payer: "Requester" },
        }),
      }),
      tag: await provider.makeS3Bucket({
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
      }),
      // Versioning
      versioning: await provider.makeS3Bucket({
        name: `${bucketPrefix}-versioning`,
        properties: () => ({
          VersioningConfiguration: {
            MFADelete: "Disabled",
            Status: "Enabled",
          },
        }),
      }),
      // Website
      website: await provider.makeS3Bucket({
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
      }),
    },
  };
};

exports.createResources = createResources;

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });
  const resources = await createResources({ provider });
  return { provider, resources, hooks };
};
