const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTagsS3 } = require("../../AwsTagCheck");

describe("AwsS3Bucket", async function () {
  let config;
  let provider;
  const bucketName = "grucloud-s3bucket-test";

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/aws/s3" });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config,
    });

    const { success } = await provider.destroyAll();
    assert(success, "destroyAll failed");
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("s3Bucket apply and destroy", async function () {
    const s3Bucket = await provider.makeS3Bucket({
      name: `${bucketName}-basic`,
      properties: () => ({}),
    });
    const config = await s3Bucket.resolveConfig();
    const live = await s3Bucket.getLive();

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
      name: `${bucketName}-logging`,
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

    await testPlanDeploy({ provider });

    const s3BucketLive = await s3Bucket.getLive();
    assert(s3BucketLive);
    CheckTagsS3({
      config: provider.config(),
      tags: s3BucketLive.TagSet,
      name: s3Bucket.name,
    });

    await testPlanDestroy({ provider, full: false });
  });
});
