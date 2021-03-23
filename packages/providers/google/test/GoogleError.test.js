const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");

describe("GoogleError", async function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("application credentials not found", async function () {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "/i/do/not/exist";
    try {
      GoogleProvider({
        name: "google",
        config: () => ({
          projectId: () => "grucloud-e2e",
          projectName: () => "grucloud-e2e",
        }),
      });
    } catch (error) {
      assert.equal(error.code, 422);
    }
  });
});
