const assert = require("assert");
const { AwsProvider } = require("../AwsProvider");

describe("AwsProvider Corner case", async function () {
  it("invalid zone", async function () {
    try {
      const config = () => ({
        region: "eu-west-2",
        zone: "us-central1-a",
        projectName: "test",
      });
      const provider = AwsProvider({
        config,
      });
      await provider.start();
      assert("should not be here");
    } catch (error) {
      assert.equal(error.code, 400);
    }
  });
});
