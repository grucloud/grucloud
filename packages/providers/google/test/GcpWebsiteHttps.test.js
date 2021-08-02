const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");

const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("GcpWebSiteHttps", async function () {
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
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }

    provider = GoogleProvider({
      name: "google",
      config: () => ({
        projectId: "grucloud-test",
      }),
    });

    myBucket = provider.storage.makeBucket({
      name: bucketName,
      properties: () => ({}),
    });

    sslCertificate = provider.compute.makeSslCertificate({
      name: certificateName,
      properties: () => ({
        managed: {
          domains: [domain],
        },
      }),
    });

    backendBucket = provider.compute.makeBackendBucket({
      name: "backend-bucket",
      dependencies: { bucket: myBucket },
      properties: () => ({
        bucketName,
      }),
    });

    urlMap = provider.compute.makeUrlMap({
      name: "url-map",
      dependencies: { service: backendBucket },
      properties: () => ({}),
    });

    httpsTargetProxy = provider.compute.makeHttpsTargetProxy({
      name: "https-target-proxy",
      dependencies: { sslCertificate, urlMap },
      properties: () => ({}),
    });

    globalForwardingRule = provider.compute.makeGlobalForwardingRule({
      name: "global-forwarding-rule",
      dependencies: { httpsTargetProxy },
      properties: () => ({}),
    });

    await provider.start();
  });
  after(async () => {});
  it.skip("website https apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    await testPlanDestroy({ provider, types });
  });
});
