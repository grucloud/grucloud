const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { ECSContainerInstance } = require("../ECSContainerInstance");

describe("ECSContainerInstance", async function () {
  let config;
  let provider;
  let containerinstance;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    containerinstance = provider.getClient({
      groupType: "ECS::ContainerInstance",
    });
    await provider.start();
  });
});
