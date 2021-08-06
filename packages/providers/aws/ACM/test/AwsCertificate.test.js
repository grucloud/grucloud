const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe.skip("AwsCertificate", async function () {
  let config;
  let provider;
  let certificate;
  const types = ["Certificate"];
  const domainName = "aws.grucloud.com";

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });

    certificate = provider.acm.makeCertificate({
      name: domainName,
    });

    await provider.start();
  });
  after(async () => {});
  it("certificate apply plan", async function () {
    await testPlanDeploy({
      provider,
      types,
      planResult: { create: 1, destroy: 0 },
    });

    const certificateLive = await certificate.getLive();
    assert(certificateLive);
    assert.equal(certificateLive.DomainName, domainName);
    assert.equal(certificateLive.Type, "AMAZON_ISSUED");
    const DomainValidationOptions = certificateLive.DomainValidationOptions[0];
    assert.equal(DomainValidationOptions.DomainName, domainName);
    assert.equal(DomainValidationOptions.ResourceRecord.Type, "CNAME");
    assert(DomainValidationOptions.ResourceRecord.Name);
    assert(DomainValidationOptions.ResourceRecord.Value);

    await testPlanDestroy({ provider, types });
  });
});
