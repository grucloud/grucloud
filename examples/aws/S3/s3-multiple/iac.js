const { pipe, map } = require("rubico");

const { AwsProvider } = require("@grucloud/provider-aws");

const createResources = async ({ provider }) => {
  const maxBuckets = 2;
  const resources = await pipe([
    () => maxBuckets,
    (maxBuckets) =>
      Array(maxBuckets)
        .fill("")
        .map((value, index) => `grucloud-bucket-${index}`),

    map((bucket) =>
      provider.S3.makeBucket({
        name: bucket,
        properties: () => ({}),
      })
    ),
  ])();

  return resources;
};

exports.createResources = createResources;

exports.createStack = async ({ createProvider }) => {
  const provider = await createProvider(AwsProvider, {
    createResources,
    config: require("./config"),
  });
  return { provider };
};
