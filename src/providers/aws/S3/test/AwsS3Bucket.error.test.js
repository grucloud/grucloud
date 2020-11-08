const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const cliCommands = require("../../../../cli/cliCommands");

const bucketPrefix = "grucloud-s3bucket-test-error";

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

    try {
      await cliCommands.planApply({
        infra: { provider },
        commandOptions: { force: true },
      });
      assert(false, "should not be here");
    } catch ({ error }) {
      const plan = error.results[0].resultQuery.resultCreate.plans[0];
      assert.equal(plan.error.code, "Forbidden");
      assert.equal(plan.resource.name, "bucket");
    }
  });

  it("s3Bucket acl error", async function () {
    const provider = AwsProvider({
      name: "aws",
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

    const { error, resultCreate } = await provider.planQueryAndApply();
    assert(error, "should have failed");
    assert.equal(resultCreate.results[0].error.code, "MalformedACLError");
  });

  it("notification-configuration error", async function () {
    const provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

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

    const plan = await provider.planQuery();
    const { error, resultCreate } = await provider.planApply({ plan });
    /*
    assert.equal(resultCreate.results[0].error.code, "InvalidArgument");
    assert.equal(
      resultCreate.results[0].error.message,
      "Unable to validate the following destination configurations"
    );*/
    assert(error, "should have failed");
  });
  it("replication-configuration error", async function () {
    const provider = AwsProvider({
      name: "aws",
      config: config.aws,
    });

    await provider.start();

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

    const plan = await provider.planQuery();
    const { error, resultCreate } = await provider.planApply({ plan });
    /*
    assert.equal(resultCreate.results[0].error.code, "InvalidArgument");
    assert.equal(
      resultCreate.results[0].error.message,
      "Unable to validate the following destination configurations"
    );
    */
    assert(error, "should have failed");
  });
});
