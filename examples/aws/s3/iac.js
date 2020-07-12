const { AwsProvider } = require("@grucloud/core");

const createStack = async ({ config }) => {
  // Create a AWS provider
  const provider = await AwsProvider({ name: "aws", config });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const s3Bucket = await provider.makeS3Bucket({
    name: "grucloud-s3bucket",
    properties: () => ({
      ACL: "private",
    }),
  });

  return { providers: [provider] };
};

module.exports = createStack;
