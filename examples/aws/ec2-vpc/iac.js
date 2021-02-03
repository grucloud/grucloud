const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider, resources: { keyPair } }) => {
  const Device = "/dev/sdf";
  const DeviceMounted = "/dev/xvdf";
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
  const rt = await provider.makeRouteTables({
    name: "rt",
    dependencies: { vpc, subnet, ig },
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
      },
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

  const UserData = `#!/bin/bash
echo "Mounting ${DeviceMounted}"
while ! ls ${DeviceMounted} > /dev/null
do 
  sleep 1
done
if [ \`file -s ${DeviceMounted} | cut -d ' ' -f 2\` = 'data' ]
then
  echo "Formatting ${DeviceMounted}"
  mkfs.xfs ${DeviceMounted}
fi
mkdir -p ${mountPoint}
mount ${DeviceMounted} ${mountPoint}
echo ${DeviceMounted} ${mountPoint} defaults,nofail 0 2 >> /etc/fstab
`;

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
      UserData,
      InstanceType: "t2.micro",
      ImageId: "ami-00f6a0c18edb19300", // Ubuntu 20.04
    }),
  });
  return { vpc, ig, subnet, rt, sg, eip, server };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  // Create a AWS provider
  const provider = AwsProvider({ name, config });

  const keyPair = await provider.useKeyPair({
    name: "kp",
  });
  const resources = await createResources({ provider, resources: { keyPair } });
  return { provider, resources };
};
