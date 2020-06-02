const AwsProvider = require("@grucloud/core").AwsProvider;

const config = require("./config");

const createStack = async ({ options }) => {
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
      CidrBlock: "10.1.1.1/16",
    },
  });
  /*
  const server = provider.makeInstance({
    name: "web-server",
    dependencies: { keyPair },
    propertiesDefault: {
      VolumeSize: 50,
      InstanceType: "t2.micro",
      MaxCount: 1,
      MinCount: 1,
      ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
    },
  });
*/
  return { providers: [provider] };
};

module.exports = createStack;
