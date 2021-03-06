const path = require("path");
const { AwsProvider } = require("@grucloud/provider-aws");
const hook = require("./hook");

const namespace = "My namespace"; // Optional

const createResources = async ({ provider }) => {
  const bucketPrefix = "grucloud-simple";

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property
  const s3Bucket = provider.s3.makeBucket({
    name: `${bucketPrefix}-bucket`,
    namespace,
    properties: () => ({}),
  });

  const s3Object = provider.s3.makeObject({
    name: `${bucketPrefix}-file-test`,
    namespace,
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

exports.createStack = async () => {
  const provider = AwsProvider({ config: require("./config") });
  const resources = await createResources({ provider });
  return { provider, resources, hooks: [hook] };
};
