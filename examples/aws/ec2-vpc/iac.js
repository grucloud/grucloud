const { AwsProvider } = require("@grucloud/provider-aws");
const hooks = require("./hooks");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const Device = "/dev/sdf";
  const deviceMounted = "/dev/xvdf";
  const mountPoint = "/data";

  const vpc = await provider.makeVpc({
    name: "vpc",
    properties: () => ({
      CidrBlock: "10.1.0.0/16",
    }),
  });
  const ig = await provider.makeInternetGateway({
    name: "ig",
    dependencies: { vpc },
  });

  const subnet = await provider.makeSubnet({
    name: "subnet",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.0.1/24",
    }),
  });
  const routeTable = await provider.makeRouteTable({
    name: "route-table",
    dependencies: { vpc, subnets: [subnet] },
    properties: () => ({}),
  });

  const routeIg = await provider.makeRoute({
    name: "route-ig",
    dependencies: { routeTable, ig },
  });

  const sg = await provider.makeSecurityGroup({
    name: "security-group",
    dependencies: { vpc },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      create: {
        Description: "Security Group Description",
      },
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    }),
  });

  const sgRuleIngressSsh = await provider.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-ssh",
    dependencies: {
      securityGroup: sg,
    },
    properties: () => ({
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
    }),
  });
  const sgRuleIngressIcmp = await provider.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-icmp",
    dependencies: {
      securityGroup: sg,
    },
    properties: () => ({
      IpPermissions: [
        {
          FromPort: -1,
          IpProtocol: "icmp",
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
          ToPort: -1,
        },
      ],
    }),
  });
  const eip = await provider.makeElasticIpAddress({
    name: "myip",
    properties: () => ({}),
  });

  const volume = await provider.makeVolume({
    name: "volume",
    properties: () => ({
      Size: 5,
      VolumeType: "standard",
      Device,
    }),
  });

  // Allocate a server
  const server = await provider.makeEC2({
    name: "web-server",
    dependencies: {
      keyPair,
      subnet,
      securityGroups: [sg],
      eip,
      volumes: [volume],
    },
    properties: () => ({
      UserData: volume.spec.setupEbsVolume({ deviceMounted, mountPoint }),
      InstanceType: "t2.micro",
      ImageId: "ami-00f6a0c18edb19300", // Ubuntu 20.04
    }),
  });
  return { vpc, ig, subnet, routeTable, routeIg, sg, eip, server };
};

exports.createResources = createResources;

exports.createStack = async () => {
  // Create a AWS provider
  const provider = AwsProvider({ config: require("./config") });

  const keyPair = await provider.useKeyPair({
    name: "kp",
  });

  const resources = await createResources({ provider, resources: { keyPair } });

  return { provider, resources, hooks };
};
