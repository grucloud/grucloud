const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("../../../test/E2ETestUtils");

describe.skip("GcpWebSiteHttps", async function () {
  const types = [
    "SslCertificate",
    "GlobalForwardingRule",
    "HttpsTargetProxy",
    "UrlMap",
    "BackendBucket",
    "Bucket",
  ];
  const bucketName = "test.gcp.grucloud.com";
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

    provider = GoogleProvider({
      name: "google",
      config: () => ({
        projectId: () => "grucloud-e2e",
        projectName: () => "grucloud-e2e",
      }),
    });

    await provider.start();

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
      dependencies: { bucket: myBucket },
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
  });
  after(async () => {});
  it("ssl certificate config", async function () {
    const config = await sslCertificate.resolveConfig();
    assert(config);
    assert.equal(config.name, certificateName);
    assert.equal(config.description, provider.config.managedByDescription);
  });
  it("website https apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    // SSL Certificate
    const sslCertificateLive = await sslCertificate.getLive();
    assert(sslCertificateLive);
    assert.equal(
      sslCertificateLive.description,
      provider.config.managedByDescription
    );
    assert(sslCertificateLive.managed.status);
    assert(sslCertificateLive.managed.domains[0], domain);
    assert(sslCertificateLive.type, "MANAGED");

    await testPlanDestroy({ provider, types });
  });
});
