const createResources = ({ provider }) => {
  const bucketPrefix = "grucloud";
  const bucketName = `${bucketPrefix}-test-basic`;
  const bucketLogDestination = `${bucketPrefix}-log-destination`;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const bucketBasic = provider.S3.makeBucket({
    name: bucketName,
    properties: () => ({}),
  });

  const logDestination = provider.S3.makeBucket({
    name: bucketLogDestination,
    properties: () => ({
      ACL: "log-delivery-write",
    }),
  });

  /*
  provider.S3.makeBucket({
    name: `${bucketName}-acl-grantread-log-delivery`,
    properties: () => ({
      GrantRead: "uri=http://acs.amazonaws.com/groups/s3/LogDelivery",
    }),
  });
*/
  const s3Buckets = {
    objects: {
      fileTest: provider.S3.makeObject({
        name: `file-test`,
        dependencies: () => ({ bucket: bucketName }),
        properties: () => ({
          ACL: "public-read",
          ContentType: "text/plain",
          Tags: [
            {
              Key: "Key1",
              Value: "Value1",
            },
            {
              Key: "Key2",
              Value: "Value2",
            },
          ],
          source: "./fixtures/testFile.txt",
        }),
      }),
    },
    buckets: {
      basic: bucketBasic,
      // Accelerate
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putBucketAccelerateConfiguration-property
      acceleration: provider.S3.makeBucket({
        name: `${bucketPrefix}-acceleration`,
        properties: () => ({
          AccelerateConfiguration: {
            Status: "Enabled",
          },
        }),
      }),
      // CORS
      CORS: provider.S3.makeBucket({
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
      encryption: provider.S3.makeBucket({
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
      lifecycleConfiguation: provider.S3.makeBucket({
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
        logged: provider.S3.makeBucket({
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
        notificationConfiguration: provider.S3.makeBucket({
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

      policy: provider.S3.makeBucket({
        name: `${bucketPrefix}-policy`,
        properties: () => ({
          Policy: {
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
          },
        }),
      }),
      //TODO policy Status
      /*
        replicationConfiguration: provider.S3.makeBucket({
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
      requestPayment: provider.S3.makeBucket({
        name: `${bucketPrefix}-request-payment`,
        properties: () => ({
          RequestPaymentConfiguration: { Payer: "Requester" },
        }),
      }),
      tag: provider.S3.makeBucket({
        name: `${bucketPrefix}-tag`,
        properties: () => ({
          Tags: [
            {
              Key: "Key1",
              Value: "Value1",
            },
            {
              Key: "Key2",
              Value: "Value2",
            },
          ],
        }),
      }),
      // Versioning
      versioning: provider.S3.makeBucket({
        name: `${bucketPrefix}-versioning`,
        properties: () => ({
          VersioningConfiguration: {
            MFADelete: "Disabled",
            Status: "Enabled",
          },
        }),
      }),
      // Website
      website: provider.S3.makeBucket({
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
