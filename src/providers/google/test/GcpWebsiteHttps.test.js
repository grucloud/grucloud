const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe("GcpWebSiteHttps", async function () {
  const types = [
    "SslCertificate",
    "GlobalForwardingRule",
    "HttpsTargetProxy",
    "UrlMap",
    "BackendBucket",
    "Bucket",
  ];
  const bucketName = "test-gcp-grucloud";
  const domain = "test.gcp.grucloud.com";
  const certificateName = "ssl-certificate-test";

  let config;
  let provider;
  let myBucket;
  let sslCertificate;
  let backendBucket;
  let urlMap;
  let httpsTargetProxy;
  let globalForwardingRule;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }

    provider = await GoogleProvider({
      name: "google",
      config: config.google,
    });

    myBucket = await provider.makeBucket({
      name: bucketName,
      properties: () => ({}),
    });

    sslCertificate = await provider.makeSslCertificate({
      name: certificateName,
      properties: () => ({
        managed: {
          domains: [domain],
        },
      }),
    });

    backendBucket = await provider.makeBackendBucket({
      name: "backend-bucket",
      properties: () => ({
        bucketName,
      }),
    });

    urlMap = await provider.makeUrlMap({
      name: "url-map",
      dependencies: { service: backendBucket },
      properties: () => ({}),
    });

    httpsTargetProxy = await provider.makeHttpsTargetProxy({
      name: "https-target-proxy",
      dependencies: { sslCertificate, urlMap },
      properties: () => ({}),
    });

    globalForwardingRule = await provider.makeGlobalForwardingRule({
      name: "global-forwarding-rule",
      dependencies: { httpsTargetProxy },
      properties: () => ({}),
    });

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("ssl certificate config", async function () {
    const config = await sslCertificate.resolveConfig();
    assert(config);
    assert.equal(config.name, certificateName);
    assert.equal(config.description, provider.config().managedByDescription);
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.resultDestroy.plans.length, 0);
    assert.equal(plan.resultCreate.plans.length, types.length);
  });
  it("website https apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    // SSL Certificate
    const sslCertificateLive = await sslCertificate.getLive();
    assert(sslCertificateLive);
    assert.equal(
      sslCertificateLive.description,
      provider.config().managedByDescription
    );
    assert(sslCertificateLive.managed.status);
    assert(sslCertificateLive.managed.domains[0], domain);
    assert(sslCertificateLive.type, "MANAGED");

    await testPlanDestroy({ provider, types });
  });
});
