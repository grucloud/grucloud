const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const path = require("path");
const { AzureProvider } = require("../AzureProvider");
const { Cli } = require("@grucloud/core/cli/cliCommands");

describe("AzProvider", async function () {
  let config;
  let provider;

  before(async function () {
    try {
    } catch (error) {
      this.skip();
    }
    provider = AzureProvider({
      name: "azure",
      config: () => ({ location: "uksouth" }),
    });
  });
  after(async () => {});
  it("az info", async function () {
    const programOptions = {
      workingDirectory: path.resolve(__dirname, "../../../../examples/multi"),
    };

    const cli = await Cli({
      programOptions,
      createStack: () => ({ provider }),
      config,
    });
    pipe([
      cli.info,
      get("results[0]"),
      (info) => {
        assert(info.subscriptionId);
        assert(info.tenantId);
        assert(info.appId);
      },
    ])();
  });
});
