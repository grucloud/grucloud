const assert = require("assert");
const {
  OpenStackAuthorize,
  OpenStackListServices,
} = require("../OpenStackUtils");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");

describe("OpenStackAuthorize", async function () {
  let config;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
      assert(config);
    } catch (error) {
      this.skip();
    }
  });
  after(async () => {});
  it("ovh authenticate", async function () {
    try {
      const token = await OpenStackAuthorize({
        baseURL: process.env.OS_AUTH_URL,
        username: process.env.OS_USERNAME,
        password: process.env.OS_PASSWORD,
        projectId: process.env.OS_PROJECT_ID,
        projectName: process.env.OS_PROJECT_NAME,
      });
      assert(token);

      // const services = await OpenStackListServices({
      //   baseURL: process.env.OS_AUTH_URL,
      //   token,
      // });

      // assert(services);
    } catch (error) {
      throw error;
    }
  });
});
