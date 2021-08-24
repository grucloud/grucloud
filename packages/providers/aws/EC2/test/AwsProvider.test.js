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

describe.skip("AwsProvider", async function () {
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
  let image;
  const keyPairName = "kp";
  const subnetName = "subnet";
  const securityGroupName = "securityGroup";
  const serverName = "web-server";

  const formatName = (name) => `${name}-provider-test`;
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

    keyPair = provider.ec2.makeKeyPair({
      name: keyPairName,
    });

    vpc = provider.ec2.makeVpc({
      name: formatName("vpc"),
      properties: () => ({
        CidrBlock: "10.1.0.1/16",
      }),
    });

    ig = provider.ec2.makeInternetGateway({
      name: formatName("ig"),
      dependencies: { vpc },
    });

    subnet = provider.ec2.makeSubnet({
      name: formatName(subnetName),
      dependencies: { vpc },
      properties: () => ({
        CidrBlock: "10.1.0.1/24",
      }),
    });

    routeTable = provider.ec2.makeRouteTable({
      name: formatName("rt"),
      dependencies: { vpc, subnets: [subnet] },
    });

    routeIg = provider.ec2.makeRoute({
      name: formatName("routeIg"),
      dependencies: { routeTable, ig },
    });

    sg = provider.ec2.makeSecurityGroup({
      name: formatName(securityGroupName),
      dependencies: { vpc },
      properties: () => ({
        //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
        Description: "Security Group Description",
        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
      }),
    });
    const sgRuleIngressSsh = provider.ec2.makeSecurityGroupRuleIngress({
      name: "sg-rule-ingress-ssh",
      dependencies: {
        securityGroup: sg,
      },
      properties: () => ({
        IpPermission: {
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
      }),
    });
    eip = provider.ec2.makeElasticIpAddress({
      name: formatName("myip"),
      properties: () => ({}),
    });

    image = provider.ec2.useImage({
      name: "Amazon Linux 2",
      properties: () => ({
        Filters: [
          {
            Name: "architecture",
            Values: ["x86_64"],
          },
          {
            Name: "owner-alias",
            Values: ["amazon"],
          },
          {
            Name: "description",
            Values: ["Amazon Linux 2 AMI *"],
          },
        ],
      }),
    });

    server = provider.ec2.makeInstance({
      name: formatName(serverName),
      properties: () => ({}),
      dependencies: { image, keyPair, subnet, securityGroups: [sg], eip },
    });
  });
  after(async () => {});
  it("aws info", async function () {
    const info = provider.info();
    assert(info.stage);
    assert(info.config.region);
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
  it("aws apply plan", async function () {
    await testPlanDeploy({ provider });
    await testPlanDestroy({ provider });
  });
});
