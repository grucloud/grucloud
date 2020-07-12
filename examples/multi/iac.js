const AwsStack = require("../aws/ec2-vpc/iac");
const AzureStack = require("../azure/iac");
const GoogleStack = require("../google/iac");

const createStack = async ({ config }) => {
  const awsStack = await AwsStack({
    config: { ...config.aws, stage: config.stage },
  });
  const azureStack = await AzureStack({
    config: { ...config.azure, stage: config.stage },
  });
  const googleStack = await GoogleStack({
    config: { ...config.google, stage: config.stage },
  });

  return {
    providers: [
      ...awsStack.providers,
      ...azureStack.providers,
      ...googleStack.providers,
    ],
  };
};
module.exports = createStack;
