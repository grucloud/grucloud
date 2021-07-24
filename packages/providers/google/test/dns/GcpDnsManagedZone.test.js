const assert = require("assert");
const { GoogleProvider } = require("../../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");

describe("GcpDnsManagedZone", async function () {
  const types = ["DnsManagedZone"];
  const domain = "gcp.grucloud.com.";
  let config;
  let provider;
  let dnsManagedZoneEmpty;
  let dnsManagedZone;

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

    dnsManagedZoneEmpty = provider.dns.makeManagedZone({
      name: "dns-managed-zone-empty",
      properties: () => ({ dnsName: `empty-${domain}` }),
    });

    dnsManagedZone = provider.dns.makeManagedZone({
      name: "dns-managed-zone-with-recordset",
      properties: () => ({
        dnsName: domain,
        recordSet: [
          {
            name: `${domain}`,
            rrdatas: ["1.2.3.4"],
            ttl: 86400,
            type: "A",
          },
        ],
      }),
    });

    await provider.start();
  });
  after(async () => {});

  it("dns managed zone apply and destroy", async function () {
    await testPlanDeploy({ provider, types });
    await testPlanDestroy({ provider, types });
  });
});
