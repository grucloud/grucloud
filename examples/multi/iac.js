const assert = require("assert");
const { AwsProvider } = require("@grucloud/provider-aws");
const { GoogleProvider } = require("@grucloud/provider-google");
const { AzureProvider } = require("@grucloud/provider-azure");

const AwsStackEC2Vpc = require("../aws/ec2/ec2-vpc/resources");
const AzureStack = require("../azure/vm/resources");
const GoogleStackVm = require("../google/vm/resources");

const createAws = async ({ createProvider }) => {
  const provider = createProvider(AwsProvider, {
    createResources: [AwsStackEC2Vpc.createResources],
    configs: [require("./configAws")],
  });

  return { provider };
};

const createGoogle = async ({ createProvider }) => {
  const provider = await createProvider(GoogleProvider, {
    createResources: [GoogleStackVm.createResources],
    config: require("./configGcp"),
  });

  return { provider };
};

const createAzure = async ({ createProvider }) => {
  const provider = await createProvider(AzureProvider, {
    createResources: AzureStack.createResources,
    config: require("./configAzure"),
  });
  return { provider };
};

exports.createStack = async ({ createProvider }) => {
  return {
    stacks: [
      await createAws({ createProvider }),
      await createAzure({ createProvider }),
      await createGoogle({ createProvider }),
    ],
  };
};
