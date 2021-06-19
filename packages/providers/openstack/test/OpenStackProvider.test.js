const assert = require("assert");
const { OpenStackProvider } = require("../OpenStackProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const cliCommands = require("@grucloud/core/cli/cliCommands");

describe("OpenStackProvider", async function () {
  let config;
  let provider;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
      assert(config);
    } catch (error) {
      this.skip();
    }
    provider = OpenStackProvider({
      name: "openstack",
      config,
    });
  });
  after(async () => {});
  it("openstack list", async function () {
    const result = await cliCommands.list({
      infra: { provider },
      commandOptions: { all: true },
    });
    assert(!result.error);
  });
});
