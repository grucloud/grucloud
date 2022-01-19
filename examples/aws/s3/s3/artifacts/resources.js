// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

const createResources = ({ provider }) => {
  provider.S3.makeBucket({
    name: "grucloud-acceleration",
    properties: ({}) => ({
      AccelerateConfiguration: {
        Status: "Enabled",
      },
    }),
  });

  provider.S3.makeBucket({
    name: "grucloud-cors",
    properties: ({}) => ({
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ["Authorization"],
            AllowedMethods: ["GET"],
            AllowedOrigins: ["*"],
            ExposeHeaders: [],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    }),
  });

  provider.S3.makeBucket({
    name: "grucloud-encryption",
    properties: ({}) => ({
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
            BucketKeyEnabled: false,
          },
        ],
      },
    }),
  });

  provider.S3.makeBucket({
    name: "grucloud-lifecycleconfiguration",
    properties: ({}) => ({
      LifecycleConfiguration: {
        Rules: [
          {
            Expiration: {
              Days: 3650,
            },
            ID: "TestOnly",
            Filter: {
              Prefix: "documents/",
            },
            Status: "Enabled",
            Transitions: [
              {
                Days: 365,
                StorageClass: "GLACIER",
              },
            ],
            NoncurrentVersionTransitions: [],
          },
        ],
      },
    }),
  });

  provider.S3.makeBucket({
    name: "grucloud-log-destination",
  });

  provider.S3.makeBucket({
    name: "grucloud-policy",
    properties: ({}) => ({
      Policy: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "IPAllow",
            Effect: "Deny",
            Principal: "*",
            Action: "s3:*",
            Resource: "arn:aws:s3:::grucloud-policy/*",
            Condition: {
              IpAddress: {
                "aws:SourceIp": "8.8.8.8/32",
              },
            },
          },
        ],
      },
    }),
  });

  provider.S3.makeBucket({
    name: "grucloud-request-payment",
    properties: ({}) => ({
      RequestPaymentConfiguration: {
        Payer: "Requester",
      },
    }),
  });

  provider.S3.makeBucket({
    name: "grucloud-tag",
    properties: ({}) => ({
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
  });

  provider.S3.makeBucket({
    name: "grucloud-test-basic",
  });

  provider.S3.makeBucket({
    name: "grucloud-versioning",
    properties: ({}) => ({
      VersioningConfiguration: {
        Status: "Enabled",
        MFADelete: "Disabled",
      },
    }),
  });

  provider.S3.makeBucket({
    name: "grucloud-website",
    properties: ({}) => ({
      ACL: "public-read",
      WebsiteConfiguration: {
        IndexDocument: {
          Suffix: "index.html",
        },
        ErrorDocument: {
          Key: "error.html",
        },
      },
    }),
  });

  provider.S3.makeObject({
    name: "file-test",
    properties: ({}) => ({
      ContentType: "text/plain",
      source: "s3/grucloud-test-basic/file-test.txt",
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
    dependencies: ({ resources }) => ({
      bucket: resources.S3.Bucket["grucloud-test-basic"],
    }),
  });
};

exports.createResources = createResources;
