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

    await provider.start();

    dnsManagedZoneEmpty = await provider.makeDnsManagedZone({
      name: "dns-managed-zone-empty",
      properties: () => ({ dnsName: `empty-${domain}` }),
    });

    dnsManagedZone = await provider.makeDnsManagedZone({
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
  });
  after(async () => {});
  it("dns managed zone config", async function () {
    const config = await dnsManagedZoneEmpty.resolveConfig();
    assert(config);
    assert.equal(config.description, provider.config.managedByDescription);
    assert(Array.isArray(config.recordSet));
  });

  it("dns managed zone apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    const dnsManagedZoneLive = await dnsManagedZone.getLive();
    assert.equal(dnsManagedZoneLive.recordSet.length, 2 + 1);

    await testPlanDestroy({ provider, types });
  });
});
