const assert = require("assert");
const { AwsProvider } = require("../AwsProvider");
const { get } = require("rubico");
const { loadConfig } = require("@aws-sdk/node-config-provider");

describe("AwsProvider Corner case", async function () {
  //TODO
  it.skip("invalid zone", async function () {
    try {
      const config = () => ({
        region: "eu-west-2",
        zone: "us-central1-a",
        projectName: "test",
      });
      const provider = await AwsProvider({
        config,
      });
      await provider.start();
      assert("should not be here");
    } catch (error) {
      assert.equal(error.code, 400);
    }
  });
  it("loadConfig", async function () {
    try {
      const awsConfig = loadConfig(
        {
          configFileSelector: get("region"),
        },
        { profile: "default" }
      );
      assert(awsConfig);
      const result = await awsConfig({});
      //assert(result);
    } catch (error) {
      assert(false);
    }
  });
});
