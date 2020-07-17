const AwsStackEC2Vpc = require("../aws/ec2-vpc/iac");
const AwsStackS3 = require("../aws/s3/iac");

const AzureStack = require("../azure/iac");
const GoogleStack = require("../google/iac");

const createStack = async ({ config }) => {
  const awsStackEc2Vpc = await AwsStackEC2Vpc({
    name: "aws-ec2vpc",
    config: { ...config.aws, stage: config.stage },
  });
  const awsStackS3 = await AwsStackS3({
    name: "aws-s3",
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
      ...awsStackEc2Vpc.providers,
      ...awsStackS3.providers,
      ...azureStack.providers,
      ...googleStack.providers,
    ],
  };
};
module.exports = createStack;
