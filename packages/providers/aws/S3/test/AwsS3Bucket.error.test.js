const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const cliCommands = require("@grucloud/core/cli/cliCommands");
const chance = require("chance")();

const types = ["S3Bucket"];
const bucketPrefix = `grucloud-${chance.guid().slice(0, 8)}`;

describe("AwsS3BucketErrors", async function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("s3Bucket already exist", async function () {
    const provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    await provider.s3.makeS3Bucket({
      name: "bucket",
      properties: () => ({}),
    });
    try {
      await cliCommands.planApply({
        infra: { provider },
        commandOptions: { force: true },
      });
      assert("should not be here");
    } catch (exception) {
      assert(exception.error);
      const result =
        exception.error.resultDeploy.results[0].resultCreate.results[0];
      assert.equal(result.error.code, "BucketAlreadyExists");
      assert.equal(result.item.resource.name, "bucket");
    }
  });

  it("s3Bucket acl error", async function () {
    const provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    await provider.s3.makeS3Bucket({
      name: `${bucketPrefix}-acl-accesscontrolpolicy`,
      properties: () => ({
        AccessControlPolicy: {
          Grants: [
            {
              Grantee: {
                Type: "Group",
                ID: "uri=http://acs.amazonaws.com/groups/s3/LogDelivery",
              },
              Permission: "FULL_CONTROL",
            },
          ],
        },
      }),
    });

    const region = provider.config.region;
    await provider.s3.makeS3Bucket({
      name: `${bucketPrefix}-notification-configuration-invalid-topic`,
      properties: () => ({
        NotificationConfiguration: {
          TopicConfigurations: [
            {
              Events: ["s3:ObjectCreated:*"],
              TopicArn: `arn:aws:sns:${region}:123456789012:s3-notification-topic`,
            },
          ],
        },
      }),
    });

    const s3BucketReplicationDestination = await provider.s3.makeS3Bucket({
      name: "replication-configuration-destination",
      properties: () => ({}),
    });

    await provider.s3.makeS3Bucket({
      name: `${bucketPrefix}-replication-configuration-invalid-iam`,
      dependencies: { bucket: s3BucketReplicationDestination },

      properties: () => ({
        ReplicationConfiguration: {
          Role: `arn:aws:iam::1234567890:role/examplerole`,
          Rules: [
            {
              Destination: {
                Bucket: `arn:aws:s3:::${s3BucketReplicationDestination.name}`,
              },
              Prefix: "",
              Status: "Enabled",
            },
          ],
        },
      }),
    });

    {
      const result = await cliCommands.planDestroy({
        infra: { provider },
        commandOptions: { force: true, types },
      });
      assert(!result.error);
    }

    try {
      await cliCommands.planApply({
        infra: { provider },
        commandOptions: { force: true },
      });
      assert("should not be here");
    } catch (exception) {
      assert(exception.error);
    }
  });
});
