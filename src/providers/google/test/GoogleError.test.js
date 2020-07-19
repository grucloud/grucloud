const assert = require("assert");
const GoogleProvider = require("../GoogleProvider");
const { ConfigLoader } = require("ConfigLoader");

describe("GoogleError", async function () {
  let config;
  before(async function () {
    try {
      config = ConfigLoader({ path: "examples/google/vm" });
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});

  it("application credentials not found", async function () {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "/i/do/not/exist";
    try {
      await GoogleProvider({
        name: "google",
        config,
      });
    } catch (error) {
      assert.equal(error.code, 422);
    }
  });
});
