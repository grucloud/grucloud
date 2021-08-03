const path = require("path");

const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = async ({ createProvider }) => {
  const provider = createProvider(GoogleProvider, {
    config: require("./config"),
  });

  const myBucket = provider.storage.makeBucket({
    name: `grucloud-test`,
    properties: () => ({}),
  });

  const file = provider.storage.makeObject({
    name: `myfile`,
    dependencies: { bucket: myBucket },
    properties: () => ({
      path: "/",
      contentType: "text/json",
      source: path.join(process.cwd(), "package.json"),
    }),
  });
  return {
    provider,
  };
};
