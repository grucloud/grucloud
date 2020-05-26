const GoogleProvider = require("@grucloud/core").GoogleProvider;
const AwsProvider = require("@grucloud/core").AwsProvider;

const config = require("./config");

const createStackGoogle = async ({ options }) => {
  const provider = await GoogleProvider({
    name: "google",
    config: config.google,
  });
  provider.makeAddress({ name: "ip-webserver" });
  provider.makeInstance({
    name: "web-server",
  });

  return provider;
};

const createStackAws = async ({ options }) => {
  const provider = await AwsProvider({ name: "aws", config: config.aws });
  const keyPair = provider.makeKeyPair({
    name: "kp",
  });
  provider.makeInstance({
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
  return provider;
};

const createStack = async ({ options }) => {
  return {
    providers: [
      await createStackGoogle({ options }),
      await createStackAws({ options }),
    ],
  };
};
module.exports = createStack;
