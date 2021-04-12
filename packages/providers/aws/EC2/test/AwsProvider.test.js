const assert = require("assert");
const { pipe, filter, tap } = require("rubico");
const { pluck, size, flatten } = require("rubico/x");

const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const {
  testPlanDeploy,
  testPlanDestroy,
} = require("@grucloud/core/E2ETestUtils");
const { CheckAwsTags } = require("../../AwsTagCheck");

describe("AwsProvider", async function () {
  let config;
  let provider;
  let ig;
  let routeTable;
  let routeIg;
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
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({
      name: "aws",
      config: () => ({ projectName: "gru-test" }),
    });

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

    routeTable = await provider.makeRouteTable({
      name: "rt",
      dependencies: { vpc, subnets: [subnet] },
    });

    routeIg = await provider.makeRoute({
      name: "routeIg",
      dependencies: { routeTable, ig },
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
      dependencies: { keyPair, subnet, securityGroups: [sg], eip },
    });
  });
  after(async () => {});
  it("aws server resolveConfig", async function () {
    assert.equal(server.name, serverName);
    const config = await server.resolveConfig({ deep: false });
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
    assert.equal(config.InstanceType, "t2.micro");
    assert.equal(config.MaxCount, 1);
    assert.equal(config.MinCount, 1);
    //assert.equal(config.KeyName, keyPair.name);
  });
  it("aws info", async function () {
    const info = await provider.info();
    assert(info.accountId);
    assert(info.region);
  });
  it.skip("server resolveDependencies", async function () {
    const dependencies = await server.resolveDependencies({
      dependenciesMustBeUp: false,
    });
    assert(dependencies.subnet);
    assert.equal(dependencies.subnet.resource.name, subnetName);
    //assert(dependencies.subnet.live);

    assert(dependencies.securityGroups);
    assert(dependencies.keyPair);
  });
  it.skip("config", async function () {
    const config = await server.resolveConfig();
    assert.equal(config.ImageId, "ami-0917237b4e71c5759");
  });

  it.skip("aws apply plan", async function () {
    await testPlanDeploy({ provider, full: true });

    const serverLive = await server.getLive();

    assert(
      CheckAwsTags({
        config: provider.config,
        tags: serverLive.Tags,
        name: server.name,
      })
    );

    //Check dependencies
    const sgLive = await sg.getLive();
    const igLive = await ig.getLive();
    const rtLive = await routeTable.getLive();
    const subnetLive = await subnet.getLive();
    const vpcLive = await vpc.getLive();
    const eipLive = await eip.getLive();

    assert.equal(igLive.Attachments[0].VpcId, vpcLive.VpcId);
    assert.equal(rtLive.VpcId, vpcLive.VpcId);
    assert.equal(rtLive.Associations[0].SubnetId, subnetLive.SubnetId);

    assert.equal(serverLive.VpcId, vpcLive.VpcId);
    assert.equal(serverLive.PublicIpAddress, eipLive.PublicIp);

    assert.equal(serverLive.SecurityGroups[0].GroupId, sgLive.GroupId);
    assert.equal(subnetLive.VpcId, vpcLive.VpcId);
    assert.equal(sgLive.VpcId, vpcLive.VpcId);

    await testPlanDestroy({ provider, full: true });
  });
});
