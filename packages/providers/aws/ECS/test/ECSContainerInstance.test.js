const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("ECSContainerInstance", async function () {
  let config;
  let provider;
  let containerinstance;

  before(async function () {
    provider = await AwsProvider({ config });
    containerinstance = provider.getClient({
      groupType: "ECS::ContainerInstance",
    });
    await provider.start();
  });
});
