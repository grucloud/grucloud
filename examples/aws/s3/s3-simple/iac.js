const path = require("path");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const namespace = "My namespace"; // Optional

const createResources = async ({ provider }) => {
  const bucketPrefix = "grucloud-simple";

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const s3Bucket = provider.S3.makeBucket({
    name: `${bucketPrefix}-bucket`,
    namespace,
    properties: () => ({}),
  });

  const s3Object = provider.S3.makeObject({
    name: `${bucketPrefix}-file-test`,
    namespace,
    dependencies: { bucket: s3Bucket },
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
  const provider = createProvider(AwsProvider, {
    createResources,
    config: require("./config"),
  });
  return { provider, hooks: [hook] };
};
