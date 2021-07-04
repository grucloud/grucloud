const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const hooks = [require("./hook")];

const createResources = async ({ provider, resources: { keyPair } }) => {
  const { config } = provider;

  const Device = "/dev/sdf";
  const deviceMounted = "/dev/xvdf";
  const mountPoint = "/data";

  assert(config.region);
  assert(config.availabilityZoneSuffix);
  const AvailabilityZone = `${config.region}${config.availabilityZoneSuffix}`;

  const vpc = provider.ec2.makeVpc({
    name: "vpc-ec2-example",
    properties: () => ({
      CidrBlock: "10.1.0.0/16",
    }),
  });
  const ig = provider.ec2.makeInternetGateway({
    name: "ig",
    dependencies: { vpc },
  });

  const subnet = provider.ec2.makeSubnet({
    name: "subnet",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.0.1/24",
      AvailabilityZone,
    }),
  });
  const routeTable = provider.ec2.makeRouteTable({
    name: "route-table",
    dependencies: { vpc, subnets: [subnet] },
    properties: () => ({}),
  });

  const routeIg = provider.ec2.makeRoute({
    name: "route-ig",
    dependencies: { routeTable, ig },
  });

  const sg = provider.ec2.makeSecurityGroup({
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

  const sgRuleIngressSsh = provider.ec2.makeSecurityGroupRuleIngress({
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

  const sgRuleIngressIcmp = provider.ec2.makeSecurityGroupRuleIngress({
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

  const eip = provider.ec2.makeElasticIpAddress({
    name: "myip",
    properties: () => ({}),
  });

  const volume = provider.ec2.makeVolume({
    name: "volume",
    properties: () => ({
      Size: 5,
      VolumeType: "standard",
      Device,
      AvailabilityZone,
    }),
  });

  const image = provider.ec2.useImage({
    name: "Amazon Linux 2",
    properties: () => ({
      Filters: [
        {
          Name: "architecture",
          Values: ["x86_64"],
        },
        {
          Name: "description",
          Values: ["Amazon Linux 2 AMI *"],
        },
      ],
    }),
  });

  // Allocate a server
  const server = provider.ec2.makeInstance({
    name: "web-server",
    dependencies: {
      keyPair,
      subnet,
      securityGroups: [sg],
      eip,
      volumes: [volume],
      image,
    },
    properties: () => ({
      UserData: volume.spec.setupEbsVolume({ deviceMounted, mountPoint }),
      InstanceType: "t2.micro",
      Placement: { AvailabilityZone },
    }),
  });
  return { vpc, ig, subnet, routeTable, routeIg, sg, eip, server };
};

exports.createResources = createResources;

exports.createStack = async () => {
  // Create a AWS provider
  const provider = AwsProvider({ config: require("./config") });

  const keyPair = provider.ec2.useKeyPair({
    name: "kp",
  });

  const resources = await createResources({ provider, resources: { keyPair } });

  return { provider, resources, hooks };
};
