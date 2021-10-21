const path = require("path");

exports.createResources = ({ provider }) => {
  const myBucket = provider.storage.makeBucket({
    name: `grucloud-test`,
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
};
