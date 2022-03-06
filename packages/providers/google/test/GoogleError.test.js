const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");

describe("GoogleError", async function () {
  let config;
  before(async function () {});
  after(async () => {});

  it("application credentials not found", async function () {
    process.env.GOOGLE_APPLICATION_CREDENTIALS = "/i/do/not/exist";
    try {
      GoogleProvider({
        name: "google",
        config: () => ({
          projectId: "grucloud-test",
        }),
      });
    } catch (error) {
      assert.equal(error.code, 422);
    }
  });
});
