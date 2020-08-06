const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider }) => {
  const bucketPrefix = "grucloud-simple";

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const encryption = await provider.makeS3Bucket({
    name: `${bucketPrefix}-encryption`,
    properties: () => ({
      ServerSideEncryptionConfiguration: {
        Rules: [
          {
            ApplyServerSideEncryptionByDefault: {
              SSEAlgorithm: "AES256",
            },
          },
        ],
      },
    }),
  });

  return {
    buckets: {
      encryption,
    },
  };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = await AwsProvider({ name, config });
  const resources = await createResources({ provider });
  provider.register({ resources });
  return { providers: [provider], resources };
};
