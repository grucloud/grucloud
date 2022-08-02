const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { Cli } = require("@grucloud/core/cli/cliCommands");

const chance = require("chance")();

const types = ["Bucket"];
const bucketPrefix = `grucloud-${chance.guid().slice(0, 8)}`;

describe("AwsS3BucketErrors", async function () {
  let config;
  before(async function () {});
  after(async () => {});

  //TODO
  it.skip("s3Bucket already exist", async function () {
    const provider = await AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    const cli = await Cli({
      createStack: () => ({
        provider,
      }),
      config,
    });

    provider.S3.makeBucket({
      name: "bucket",
      properties: () => ({}),
    });
    try {
      await cli.planApply({
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch (exception) {
      assert(exception.error);
      const result =
        exception.error.resultDeploy.results[0].resultCreate.results[0];
      assert.equal(result.error.code, "BucketAlreadyExists");
      assert.equal(result.item.resource.name, "bucket");
    }
  });

  it("s3Bucket acl error", async function () {
    const provider = await AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    const cli = await Cli({
      createStack: () => ({
        provider,
      }),
      config,
    });
    provider.S3.makeBucket({
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
    provider.S3.makeBucket({
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

    const s3BucketReplicationDestination = provider.S3.makeBucket({
      name: "replication-configuration-destination",
      properties: () => ({}),
    });

    provider.S3.makeBucket({
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
      const result = await cli.planDestroy({
        commandOptions: { force: true, types },
      });
      assert(!result.error);
    }

    try {
      await cli.planApply({
        commandOptions: { force: true },
      });
      assert("should not be here");
    } catch (exception) {
      assert(exception.error);
    }
  });
});
