const assert = require("assert");
const { OpenStackProvider } = require("../OpenStackProvider");
const { Cli } = require("@grucloud/core/cli/cliCommands");

describe("OpenStackProvider", async function () {
  let config;
  let provider;

  before(async function () {
    provider = OpenStackProvider({
      name: "openstack",
      config,
    });
  });
  after(async () => {});
  it("openstack list", async function () {
    const cli = await Cli({
      createStack: () => ({
        provider,
      }),
      config,
    });

    const result = await cli.list({
      commandOptions: { all: true },
    });
    assert(!result.error);
  });
});
