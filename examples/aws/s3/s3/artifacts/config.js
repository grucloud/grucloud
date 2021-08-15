module.exports = ({ stage }) => ({
  projectName: "@grucloud/example-aws-s3",
  s3: {
    Bucket: {
      grucloudAcceleration: {
        name: "grucloud-acceleration",
        properties: {
          AccelerateConfiguration: {
            Status: "Enabled",
          },
        },
      },
      grucloudCors: {
        name: "grucloud-cors",
        properties: {
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
        },
      },
      grucloudEncryption: {
        name: "grucloud-encryption",
        properties: {
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
        },
      },
      grucloudLifecycleconfiguration: {
        name: "grucloud-lifecycleconfiguration",
        properties: {
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
        },
      },
      grucloudLogDestination: {
        name: "grucloud-log-destination",
      },
      grucloudPolicy: {
        name: "grucloud-policy",
        properties: {
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
        },
      },
      grucloudRequestPayment: {
        name: "grucloud-request-payment",
        properties: {
          RequestPaymentConfiguration: {
            Payer: "Requester",
          },
        },
      },
      grucloudTag: {
        name: "grucloud-tag",
        properties: {
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
        },
      },
      grucloudTestBasic: {
        name: "grucloud-test-basic",
      },
      grucloudVersioning: {
        name: "grucloud-versioning",
        properties: {
          VersioningConfiguration: {
            Status: "Enabled",
            MFADelete: "Disabled",
          },
        },
      },
      grucloudWebsite: {
        name: "grucloud-website",
        properties: {
          ACL: "public-read",
          WebsiteConfiguration: {
            IndexDocument: {
              Suffix: "index.html",
            },
            ErrorDocument: {
              Key: "error.html",
            },
          },
        },
      },
    },
    Object: {
      fileTest: {
        name: "file-test",
        properties: {
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
        },
      },
    },
  },
});
