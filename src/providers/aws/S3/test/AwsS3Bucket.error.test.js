const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const cliCommands = require("../../../../cli/cliCommands");
const { tos } = require("../../../../tos");
const chance = require("chance")();

const types = ["S3Bucket"];
const bucketPrefix = `grucloud-${chance.guid().slice(0, 8)}`;

describe("AwsS3BucketErrors", async function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("s3Bucket already exist", async function () {
    const provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

    await provider.makeS3Bucket({
      name: "bucket",
      properties: () => ({}),
    });

    const result = await provider.planQueryAndApply({});
    assert(result.error);
    const plan = result.resultCreate.results[0];
    assert.equal(plan.error.code, "Forbidden");
    assert.equal(plan.item.resource.name, "bucket");
  });

  it("s3Bucket acl error", async function () {
    const provider = AwsProvider({
      config: config.aws,
    });
    await provider.start();
    await provider.makeS3Bucket({
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

    const region = provider.config().region;
    await provider.makeS3Bucket({
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

    const s3BucketReplicationDestination = await provider.makeS3Bucket({
      name: "replication-configuration-destination",
      properties: () => ({}),
    });

    await provider.makeS3Bucket({
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
    const resultDestroy = await provider.destroyAll({
      options: {
        types,
        all: true,
      },
    });
    assert(!resultDestroy.error, "should not have failed");

    const { error, resultCreate } = await provider.planQueryAndApply();
    assert(error, "should have failed");
    assert.equal(
      resultCreate.results[0].error.code,
      "MalformedACLError",
      `not MalformedACLError in ${tos(resultCreate)}`
    );
    assert.equal(
      resultCreate.results[1].error.code,
      "InvalidArgument",
      `not ''InvalidArgument'' in ${tos(resultCreate)}`
    );
    assert.equal(
      resultCreate.results[3].error.code,
      "InvalidRequest",
      `not ''InvalidRequest'' in ${tos(resultCreate)}`
    );
  });
});
