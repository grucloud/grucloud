const assert = require("assert");
const { pipe, tap } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");

describe("AppRunner", async function () {
  let provider;
  let appRunner;

  before(async function () {
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    await provider.start();
    appRunner = provider.getClient({ groupType: "AppRunner::AppRunner" });
  });
  it(
    "getById not found",
    pipe([
      () =>
        appRunner.getById({
          id: "",
        }),
    ])
  );
  it(
    "destroy not found",
    pipe([
      () =>
        appRunner.destroy({
          live: {
            Id: "",
          },
        }),
    ])
  );
});
