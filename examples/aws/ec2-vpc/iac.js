const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider, resources: { keyPair } }) => {
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
  const rt = await provider.makeRouteTables({
    name: "rt",
    dependencies: { vpc, subnet },
    properties: () => ({}),
  });

  const sg = await provider.makeSecurityGroup({
    name: "securityGroup",
    dependencies: { vpc, subnet },
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

  //TODO remove ig and rt, make it automatic
  const eip = await provider.makeElasticIpAddress({
    name: "myip",
    dependencies: { ig, rt },
    properties: () => ({}),
  });

  // Allocate a server
  const server = await provider.makeEC2({
    name: "web-server",
    dependencies: {
      keyPair,
      subnet,
      securityGroups: { sg },
      eip,
    },
    properties: () => ({
      VolumeSize: 50,
      InstanceType: "t2.micro",
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
    }),
  });
  return { vpc, ig, subnet, rt, sg, eip, server };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name, config });

  const keyPair = await provider.useKeyPair({
    name: "kp",
  });
  const resources = await createResources({ provider, resources: { keyPair } });
  provider.register({
    resources,
  });
  return { providers: [provider], resources };
};
