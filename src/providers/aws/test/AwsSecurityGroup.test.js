const assert = require("assert");
const { ConfigLoader } = require("ConfigLoader");
const AwsProvider = require("../AwsProvider");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { CheckTags } = require("./AwsTagCheck");

describe("AwsSecurityGroup", async function () {
  let provider;
  let vpc;
  let sg;

  before(async function () {
    try {
      provider = await AwsProvider({
        name: "aws",
        config: ConfigLoader({ baseDir: __dirname }),
      });
      vpc = provider.makeVpc({
        name: "vpc",
        properties: {
          CidrBlock: "10.1.0.1/16",
        },
      });
      sg = provider.makeSecurityGroup({
        name: "sg",
        dependencies: { vpc },
        properties: {
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
        },
      });
      await provider.destroyAll();
    } catch (error) {
      assert(error.code, 422);
      this.skip();
    }
  });
  after(async () => {
    await provider?.destroyAll();
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
  });
  it("sg listLives", async function () {
    const [sgs] = await provider.listLives({ types: ["SecurityGroup"] });
    assert(sgs);
    const sgDefault = sgs.resources.find((sg) => sg.name === "default");
    assert(sgDefault);
  });
  it("sg apply and destroy", async function () {
    await testPlanDeploy({ provider });

    const sgLive = await sg.getLive();
    const vpcLive = await vpc.getLive();
    assert.equal(sgLive.VpcId, vpcLive.VpcId);

    CheckTags({ config: provider.config, tags: sgLive.Tags, name: sg.name });

    await testPlanDestroy({ provider });
  });
});
