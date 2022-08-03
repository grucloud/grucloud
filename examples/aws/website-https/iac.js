const { assign } = require("rubico");
const { AwsProvider } = require("@grucloud/provider-aws");
const { createResources } = require("./resources");
const { createResourcesS3Object } = require("./resourcesS3Objects");

exports.createStack = assign({
  provider: ({ createProvider }) =>
    createProvider(AwsProvider, {
      createResources: [createResourcesS3Object, createResources],
      config: require("./config"),
    }),
});
