const assert = require("assert");
const AwsProvider = require("../AwsProvider");

describe("AwsProvider", async function () {
  it("invalid zone", async function () {
    try {
      const config = { region: "eu-west-2", zone: "us-central1-a" };
      await AwsProvider({
        name: "aws",
        config,
      });
      assert(false);
    } catch (error) {
      assert.equal(error.code, 400);
    }
  });
});
