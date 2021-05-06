require("@grucloud/core"); // TODO still need this?
const { AwsProvider } = require("@grucloud/provider-aws");
const config = () => ({ region: process.env.AWSRegion });
exports.createStack = async () => {
  const provider = AwsProvider({ config });
  return {
    provider,
  };
};
