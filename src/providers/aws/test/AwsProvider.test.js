const assert = require("assert");
const AwsProvider = require("../AwsProvider");
const config = require("../config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("AwsProvider", async function () {
  let provider;
  let server;
  let keyPair;
  let vpc;
  let sg;

  const keyPairName = "kp";
  const serverName = "web-server";

  before(async () => {
    provider = await AwsProvider({ name: "aws", config });
    const { success } = await provider.destroyAll();
    assert(success);
    keyPair = provider.makeKeyPair({
      name: keyPairName,
    });
    vpc = provider.makeVpc({
      name: "vpc",
      properties: {
        CidrBlock: "10.0.0.1/16",
      },
    });
    sg = provider.makeSecurityGroup({
      name: "securityGroup",
      dependencies: { vpc },
      properties: {
        //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
        create: {
          Description: "Security Group Description",
        },
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
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

    server = provider.makeInstance({
      name: serverName,
      properties: {},
      dependencies: { keyPair, securityGroups: { sg } },
    });
  });
  after(async () => {
    //await provider.destroyAll();
  });
  it("server resolveConfig", async function () {
    assert.equal(server.name, serverName);

    const config = await server.resolveConfig();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    assert.equal(config.KeyName, keyPair.name);
    // TODO tags
  });
  it("config", async function () {
    const config = await server.resolveConfig();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 3);
  });
  it("listLives all", async function () {
    const lives = await provider.listLives({ all: true });
    assert(lives);
  });
  it("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
