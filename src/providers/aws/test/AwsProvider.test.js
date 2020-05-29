const assert = require("assert");
const AwsProvider = require("../AwsProvider");
const config = require("../config");
const { testProviderLifeCycle } = require("test/E2ETestUtils");

describe("AwsProvider", async function () {
  let provider;
  let server;
  let keyPair;
  let sg;
  const keyPairName = "kp";
  const serverName = "web-server";
  before(async () => {
    provider = await AwsProvider({ name: "aws", config });
    await provider.destroyAll();
    keyPair = provider.makeKeyPair({
      name: keyPairName,
    }); /*
    sg = provider.makeSecurityGroup({
      name: "securityGroup",
      properties: {
        ingress: [
          {
            protocol: "tcp",
            fromPort: 22,
            toPort: 22,
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
      },
    });
    */
    server = provider.makeInstance({
      name: serverName,
      properties: {},
      dependencies: { keyPair /*, securityGroups: [sg]*/ },
    });
  });
  after(async () => {
    await provider.destroyAll();
  });
  it("keyPair name", async function () {
    assert.equal(keyPair.name, keyPairName);
  });
  it("config static server", async function () {
    assert.equal(server.name, serverName);

    const config = server.configStatic();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    assert.equal(config.KeyName, keyPair.name);
    // TODO tags
  });
  it("config", async function () {
    const config = await server.config();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
  });
  it("plan", async function () {
    const plan = await provider.plan();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 1);
  });
  it("listLives all", async function () {
    const lives = await provider.listLives({ all: true });
    assert(lives);
  });
  it("deploy plan", async function () {
    await testProviderLifeCycle({ provider });
  });
});
