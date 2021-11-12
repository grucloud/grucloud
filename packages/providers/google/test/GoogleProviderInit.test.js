const assert = require("assert");
const { GoogleProvider } = require("../GoogleProvider");
const { createProviderMaker } = require("@grucloud/core/cli/infra");
const { Cli } = require("@grucloud/core/cli/cliCommands");
const { pipe, tap } = require("rubico");

const promptsInject = ["grucloud-test", "us-east1", "us-east1-a"];

describe("GoogleProviderInit", async function () {
  let provider;
  before(async function () {
    provider = createProviderMaker({})(GoogleProvider, {
      config: () => ({ projectId: "grucloud-test" }),
      createResources: () => {},
    });

    await provider.start();
  });
  after(async () => {});

  it("init and unit", async function () {
    return pipe([
      () =>
        Cli({
          createStack: () => ({ provider }),
          promptsInject: [...promptsInject, ...promptsInject, ...promptsInject],
        }),
      (cli) =>
        pipe([
          () => cli.init(),
          () => cli.unInit({}),
          () => cli.unInit({}),
          () => cli.init(),
          () => cli.init(),
        ])(),
    ])();
  }).timeout(1000e3);
});
