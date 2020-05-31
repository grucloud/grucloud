const assert = require("assert");
const config = require("../config");
const AwsProvider = require("../AwsProvider");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("AwsSecurityGroup", async function () {
  let provider;
  let sg;

  before(async () => {
    provider = await AwsProvider({ name: "aws", config });

    sg = provider.makeSecurityGroup({
      name: "sg",
      properties: {
        ingress: {
          IpPermissions: [
            {
              FromPort: 22,
              IpProtocol: "tcp",
              IpRanges: [
                {
                  CidrIp: "0.0.0.0/0",
                },
              ],
              Ipv6Ranges: [
                {
                  CidrIpv6: "::/0",
                },
              ],
              ToPort: 22,
            },
          ],
        },
      },
    });
    await provider.destroyAll();
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("sg name", async function () {
    assert.equal(sg.name, "sg");
  });
  it("sg resolveConfig", async function () {
    const config = await sg.resolveConfig();
    assert.equal(config.ingress.IpPermissions[0].FromPort, 22);
  });
  it("sg targets", async function () {
    const live = await sg.getLive();
    //assert(live);
    //assert.equal(live.KeyName, vpc.name);
  });
  it("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
