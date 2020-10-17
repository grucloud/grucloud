const chance = require("chance")();
const { GoogleProvider } = require("@grucloud/core");

exports.createStack = async ({ config }) => {
  const provider = await GoogleProvider({ config });

  const myBucket = await provider.makeBucket({
    name: `grucloud-test`,
    properties: () => ({}),
  });

  const file = await provider.makeObject({
    name: `myfile`,
    dependencies: { bucket: myBucket },
    properties: () => ({
      path: "/",
      content: "ciao",
    }),
  });
  return {
    provider,
  };
};
