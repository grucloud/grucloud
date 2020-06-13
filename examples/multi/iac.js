const GoogleProvider = require("@grucloud/core").GoogleProvider;
const AwsProvider = require("@grucloud/core").AwsProvider;

const createStackGoogle = async ({ config }) => {
  const provider = await GoogleProvider({
    name: "google",
    config,
  });
  provider.makeAddress({ name: "ip-webserver" });
  provider.makeInstance({
    name: "web-server",
  });

  return provider;
};

const createStackAws = async ({ config }) => {
  const provider = await AwsProvider({ name: "aws", config });
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

const createStack = async ({ config }) => {
  return {
    providers: [
      await createStackGoogle({ config: config.google }),
      await createStackAws({ config: config.aws }),
    ],
  };
};
module.exports = createStack;
