const { AwsProvider } = require("@grucloud/core");

const createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });
  // Allocate public Ip address
  //TODO
  // const ip = provider.makeAddress({ name: "ip-webserver" });
  // Allocate a server
  const keyPair = provider.makeKeyPair({
    name: "kp",
  });
  const vpc = provider.makeVpc({
    name: "vpc",
    properties: {
      CidrBlock: "10.1.0.0/16",
    },
  });
  const subnet = provider.makeSubnet({
    name: "subnet",
    dependencies: { vpc },
    properties: {
      CidrBlock: "10.1.0.1/24",
    },
  });
  const sg = provider.makeSecurityGroup({
    name: "securityGroup",
    dependencies: { vpc, subnet },
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

  const server = provider.makeEC2({
    name: "web-server",
    dependencies: { keyPair, subnet, securityGroups: { sg } },
    propertiesDefault: {
      VolumeSize: 50,
      InstanceType: "t2.micro",
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
    },
  });

  return { providers: [provider] };
};

module.exports = createStack;
