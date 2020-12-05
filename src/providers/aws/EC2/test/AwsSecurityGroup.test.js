const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsSecurityGroup", async function () {
  let config;
  let provider;
  let vpc;
  let sg;
  const types = ["SecurityGroup"];
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      config: config.aws,
    });

    await provider.start();

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });
    sg = await provider.makeSecurityGroup({
      name: "sg",
      dependencies: { vpc },
      properties: () => ({
        create: {
          Description: "Security Group Description",
        },
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
      }),
    });
  });
  after(async () => {});
  it("empty ingress", async function () {
    const provider = AwsProvider({
      config: config.aws,
    });
    await provider.start();
    const vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "11.1.0.1/16",
      }),
    });
    await provider.makeSecurityGroup({
      name: "sg",
      dependencies: { vpc },
      properties: () => ({
        create: {
          Description: "Security Group Description",
        },
      }),
    });
    const { error, resultCreate } = await provider.planQueryAndApply();
    assert(error, "should have failed");
    assert(resultCreate.results[1].error.code, "InvalidParameterValue");
  });
  it("sg name", async function () {
    assert.equal(sg.name, "sg");
  });
  it("sg resolveConfig", async function () {
    const config = await sg.resolveConfig();
    assert.equal(config.ingress.IpPermissions[0].FromPort, 22);
  });
  it.skip("sg apply and destroy", async function () {
    await testPlanDeploy({ provider, types });

    const sgLive = await sg.getLive();
    const vpcLive = await vpc.getLive();
    assert.equal(sgLive.VpcId, vpcLive.VpcId);

    assert(
      CheckAwsTags({
        config: provider.config(),
        tags: sgLive.Tags,
        name: sg.name,
      })
    );

    await testPlanDestroy({ provider, full: false, types });
  });
});
