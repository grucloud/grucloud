const assert = require("assert");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { createStack } = require("../../../../../examples/aws/s3/iac");
describe.skip("AwsS3Bucket Example", async function () {
  let config;
  const types = ["Bucket"];
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/aws/s3" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});
  it("run s3 example", async function () {
    const {
      provider,
      resources: { buckets },
    } = await createStack({ config });

    await testPlanDeploy({ provider, types });

    // Basic
    const basic = await buckets.basic.getLive();
    assert(basic.LocationConstraint);

    // Acceleration
    const bucketAcceleration = await buckets.acceleration.getLive();
    assert.equal(bucketAcceleration.AccelerateConfiguration.Status, "Enabled");

    // CORS
    const CORS = await buckets.CORS.getLive();
    assert.equal(
      CORS.CORSConfiguration.CORSRules[0].AllowedHeaders,
      "Authorization"
    );

    //Encryption
    const encryption = await buckets.encryption.getLive();
    assert.equal(
      encryption.ServerSideEncryptionConfiguration.Rules[0]
        .ApplyServerSideEncryptionByDefault.SSEAlgorithm,
      "AES256"
    );

    // LifecycleConfiguation
    const lifecycle = await buckets.lifecycleConfiguation.getLive();
    assert.equal(
      lifecycle.LifecycleConfiguration.Rules[0].Expiration.Days,
      3650
    );

    // logDestinations
    const logDestination = await buckets.logDestination.getLive();
    assert.equal(logDestination.ACL.Grants[0].Permission, "FULL_CONTROL");

    // Logged
    /*
    const logged = await buckets.logged.getLive();
    assert.qual(
      logged.BucketLoggingStatus.LoggingEnabled.TargetBucket,
      logDestination.name
    );
*/
    /*
    const notification = await buckets.notificationConfiguration.getLive();
    assert.equal(
      notification.TopicConfigurations[0].Events,
      "s3:ObjectCreated:*"
    );*/

    /*
    const replication = await buckets.replicationConfiguration.getLive();
    //TODO 
    assert.equal(replication.Role, "");
*/

    // Policy
    const policy = await buckets.policy.getLive();
    assert(policy.Policy);

    // RequestPayment

    const requestPayment = await buckets.requestPayment.getLive();
    assert.equal(requestPayment.RequestPaymentConfiguration.Payer, "Requester");

    // Tag
    const tag = await buckets.tag.getLive();
    assert.equal(tag.Tagging.TagSet[0].Key, "Key2");

    // Versioning
    const versioning = await buckets.versioning.getLive();
    assert.equal(versioning.VersioningConfiguration.Status, "Enabled");

    // Website
    const website = await buckets.website.getLive();
    assert.equal(website.WebsiteConfiguration.ErrorDocument.Key, "error.html");

    // Destroy
    await testPlanDestroy({ provider, full: false, types });
  });
});
