const AwsStackEC2Vpc = require("../aws/ec2-vpc/iac");
const AwsStackS3 = require("../aws/s3/iac");
const { AwsProvider } = require("@grucloud/core");

const AzureStack = require("../azure/iac");
const GoogleStack = require("../google/iac");

exports.createStack = async ({ config }) => {
  const awsProvider = await AwsProvider({
    config: { ...config.aws, stage: config.stage },
  });

  const azureStack = await AzureStack.createStack({
    config: { ...config.azure, stage: config.stage },
  });
  const googleStack = await GoogleStack.createStack({
    config: { ...config.google, stage: config.stage },
  });

  return {
    providers: [awsProvider, ...azureStack.providers, ...googleStack.providers],
    resources: {
      ec2Vpc: await AwsStackEC2Vpc.createResources({
        provider: awsProvider,
      }),
      s3: await AwsStackS3.createResources({
        provider: awsProvider,
      }),
      azure: azureStack.resources,
      google: googleStack.resources,
    },
  };
};
