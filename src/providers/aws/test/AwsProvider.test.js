const assert = require("assert");
const AwsProvider = require("../AwsProvider");
const { ConfigLoader } = require("ConfigLoader");
const { testPlanDeploy, testPlanDestroy } = require("test/E2ETestUtils");
const { notAvailable } = require("../../ProviderCommon");
const { CheckTags } = require("./AwsTagCheck");

describe("AwsProvider", async function () {
  let config;
  let provider;
  let ig;
  let rt;
  let server;
  let keyPair;
  let vpc;
  let subnet;
  let sg;
  let eip;
  const keyPairName = "kp";
  const subnetName = "subnet";
  const securityGroupName = "securityGroup";
  const serverName = "web-server";

  before(async function () {
    try {
      config = ConfigLoader({ baseDir: __dirname });
    } catch (error) {
      this.skip();
    }
    provider = await AwsProvider({
      name: "aws",
      config,
    });
    const { success, results } = await provider.destroyAll();
    assert(results);
    assert(success);
    keyPair = await provider.useKeyPair({
      name: keyPairName,
    });

    vpc = await provider.makeVpc({
      name: "vpc",
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });
    ig = await provider.makeInternetGateway({
      name: "ig",
      dependencies: { vpc },
    });
    subnet = await provider.makeSubnet({
      name: subnetName,
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "10.1.0.1/24",
      }),
    });
    rt = await provider.makeRouteTables({
      name: "rt",
      dependencies: { vpc, subnet },
      properties: () => ({}),
    });
    sg = await provider.makeSecurityGroup({
      name: securityGroupName,
      dependencies: { vpc },
      properties: () => ({
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
      }),
    });

    eip = await provider.makeElasticIpAddress({
      name: "myip",
      properties: () => ({}),
    });

    server = await provider.makeEC2({
      name: serverName,
      properties: () => ({}),
      dependencies: { keyPair, subnet, securityGroups: { sg }, eip },
    });
  });
  after(async () => {
    //await provider?.destroyAll();
  });
  it("aws server resolveConfig", async function () {
    assert.equal(server.name, serverName);

    const config = await server.resolveConfig();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    assert.equal(config.KeyName, keyPair.name);
    assert.equal(
      config.NetworkInterfaces[0].SubnetId,
      notAvailable(subnetName, "SubnetId")
    );
    assert.equal(
      config.NetworkInterfaces[0].Groups[0],
      notAvailable(securityGroupName, "GroupId")
    );
  });
  it("server resolveDependencies", async function () {
    const dependencies = await server.resolveDependencies();
    assert(dependencies.subnet);
    assert.equal(dependencies.subnet.resource.name, subnetName);
    assert(!dependencies.subnet.live);

    assert(dependencies.securityGroups.sg);
    assert(dependencies.keyPair);
  });
  it("config", async function () {
    const config = await server.resolveConfig();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
  });
  it("plan", async function () {
    const plan = await provider.planQuery();
    assert.equal(plan.destroy.length, 0);
    assert.equal(plan.newOrUpdate.length, 7);
  });
  it("listLives all", async function () {
    const lives = await provider.listLives({ all: true });
    assert(lives);
  });
  it("aws apply plan", async function () {
    await testPlanDeploy({ provider });

    const serverLive = await server.getLive();
    const serverInstance = serverLive.Instances[0];

    CheckTags({
      config: provider.config(),
      tags: serverInstance.Tags,
      name: server.name,
    });

    //Check dependencies
    const sgLive = await sg.getLive();
    const igLive = await ig.getLive();
    const rtLive = await rt.getLive();
    const subnetLive = await subnet.getLive();
    const vpcLive = await vpc.getLive();
    const eipLive = await eip.getLive();

    assert.equal(igLive.Attachments[0].VpcId, vpcLive.VpcId);
    assert.equal(rtLive.VpcId, vpcLive.VpcId);
    assert.equal(rtLive.Associations[0].SubnetId, subnetLive.SubnetId);

    assert.equal(serverInstance.VpcId, vpcLive.VpcId);
    assert.equal(serverInstance.PublicIpAddress, eipLive.PublicIp);

    assert.equal(serverInstance.SecurityGroups[0].GroupId, sgLive.GroupId);
    assert.equal(subnetLive.VpcId, vpcLive.VpcId);
    assert.equal(sgLive.VpcId, vpcLive.VpcId);

    await testPlanDestroy({ provider });
  });
});
