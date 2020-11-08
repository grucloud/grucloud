const assert = require("assert");
const { AwsProvider } = require("../AwsProvider");

describe("AwsProvider Corner case", async function () {
  it("invalid zone", async function () {
    try {
      const config = { region: "eu-west-2", zone: "us-central1-a" };
      const provider = AwsProvider({
        name: "aws",
        config,
      });
      await provider.start();
      assert(false);
    } catch (error) {
      assert.equal(error.code, 400);
    }
  });
});
