const path = require("path");
const { AwsProvider } = require("@grucloud/core");

const createResources = async ({ provider }) => {
  const bucketPrefix = "grucloud-simple";

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const s3Bucket = await provider.makeS3Bucket({
    name: `${bucketPrefix}-bucket`,
    properties: () => ({}),
  });

  const s3Object = await provider.makeS3Object({
    name: `${bucketPrefix}-file-test`,
    dependencies: { bucket: s3Bucket },
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      ServerSideEncryption: "AES256",
      Tagging: "key1=value1&key2=value2",
      source: path.join(process.cwd(), "package.json"),
    }),
  });

  return {
    s3Bucket,
    s3Object,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ name = "aws", config }) => {
  const provider = await AwsProvider({ name, config });
  const resources = await createResources({ provider });
  return { provider, resources };
};
