const path = require("path");

const { GoogleProvider } = require("@grucloud/provider-google");

exports.createStack = async () => {
  const provider = GoogleProvider({ config: require("./config") });

  const myBucket = await provider.storage.makeBucket({
    name: `grucloud-test`,
    properties: () => ({}),
  });

  const file = await provider.storage.makeObject({
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
