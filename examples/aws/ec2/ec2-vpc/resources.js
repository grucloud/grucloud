const assert = require("assert");

const createResources = ({ provider }) => {
  const { config } = provider;

  const Device = "/dev/sdf";
  const deviceMounted = "/dev/xvdf";
  const mountPoint = "/data";

  assert(config.region);
  assert(config.availabilityZoneSuffix);
  const AvailabilityZone = `${config.region}${config.availabilityZoneSuffix}`;

  const keyPair = provider.EC2.makeKeyPair({
    name: "kp-ec2-vpc",
  });

  const vpc = provider.EC2.makeVpc({
    name: "vpc-ec2-example",
    properties: () => ({
      CidrBlock: "10.1.0.0/16",
    }),
  });
  const ig = provider.EC2.makeInternetGateway({
    name: "ig",
    dependencies: { vpc },
  });

  const subnet = provider.EC2.makeSubnet({
    name: "subnet",
    dependencies: { vpc },
    properties: () => ({
      CidrBlock: "10.1.0.0/24",
      AvailabilityZone,
    }),
  });
  const routeTable = provider.EC2.makeRouteTable({
    name: "route-table",
    dependencies: { vpc, subnets: [subnet] },
    properties: () => ({}),
  });

  const routeIg = provider.EC2.makeRoute({
    name: "route-ig",
    dependencies: { routeTable, ig },
  });

  const sg = provider.EC2.makeSecurityGroup({
    name: "security-group",
    dependencies: { vpc },
    properties: () => ({
      //https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#createSecurityGroup-property
      Description: "Security Group Description",
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property
    }),
  });

  const sgRuleIngressSsh = provider.EC2.makeSecurityGroupRuleIngress({
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

  const sgRuleIngressIcmp = provider.EC2.makeSecurityGroupRuleIngress({
    name: "sg-rule-ingress-icmp",
    dependencies: {
      securityGroup: sg,
    },
    properties: () => ({
      IpPermission: {
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
    }),
  });

  const eip = provider.EC2.makeElasticIpAddress({
    name: "myip",
    properties: () => ({}),
  });

  const volume = provider.EC2.makeVolume({
    name: "volume",
    properties: () => ({
      Size: 5,
      VolumeType: "standard",
      Device,
      AvailabilityZone,
    }),
  });

  const image = provider.EC2.useImage({
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

  // Allocate a server
  const server = provider.EC2.makeInstance({
    name: "web-server-ec2-vpc",
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
