const path = require("path");
const { AwsProvider } = require("@grucloud/provider-aws");

const namespace = "My namespace"; // Optional

const createResources = ({ provider }) => {
  const bucketPrefix = "grucloud-simple";
  const s3BucketName = `${bucketPrefix}-bucket`;
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const s3Bucket = provider.S3.makeBucket({
    namespace,
    properties: () => ({
      Name: s3BucketName,
    }),
  });

  const s3Object = provider.S3.makeObject({
    name: `${bucketPrefix}-file-test.txt`,
    namespace,
    dependencies: () => ({ bucket: s3BucketName }),
    properties: () => ({
      ACL: "public-read",
      ContentType: "text/plain",
      ServerSideEncryption: "AES256",
      Tags: [
        {
          Key: "Key1",
          Value: "Value1",
        },
        {
          Key: "Key2",
          Value: "Value2",
        },
      ],
      // should not use process.cwd()
      source: path.join(process.cwd(), "package.json"),
    }),
  });

  return {
    s3Bucket,
    s3Object,
  };
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  return {
    provider: await createProvider(AwsProvider, {
      createResources,
      config: require("./config"),
    }),
  };
};
