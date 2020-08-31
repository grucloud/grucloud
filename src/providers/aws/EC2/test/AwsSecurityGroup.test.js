const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const { AwsProvider } = require("../../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTagsEC2 } = require("../../AwsTagCheck");

describe("AwsSecurityGroup", async function () {
  let config;
  let provider;
  let vpc;
  let sg;

  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/aws/ec2-vpc" });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config,
    });
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

    const { error } = await provider.destroyAll();
    assert(!error);
  });
  after(async () => {
    await provider?.destroyAll();
  });
  it("empty ingress", async function () {
    const provider = await AwsProvider({
      name: "aws",
      config,
    });
    const vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
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
    assert(resultCreate.results[1].error.code, "MissingParameter");
  });
  it("sg name", async function () {
    assert.equal(sg.name, "sg");
  });
  it("sg resolveConfig", async function () {
    const config = await sg.resolveConfig();
    assert.equal(config.ingress.IpPermissions[0].FromPort, 22);
  });
  it.skip("sg targets", async function () {
    const live = await sg.getLive();
  });
  it("sg listLives", async function () {
    const {
      results: [sgs],
    } = await provider.listLives({ types: ["SecurityGroup"] });
    assert(sgs);
    const sgDefault = sgs.resources.find((sg) => sg.name === "default");
    assert(sgDefault);
  });
  it.skip("sg apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const sgLive = await sg.getLive();
    const vpcLive = await vpc.getLive();
    assert.equal(sgLive.VpcId, vpcLive.VpcId);

    CheckTagsEC2({
      config: provider.config(),
      tags: sgLive.Tags,
      name: sg.name,
    });

    await testPlanDestroy({ provider, full: false });
  });
});
