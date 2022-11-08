const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ConfigConfigurationRecorder", async function () {
  let config;
  let provider;
  let recorder;

  before(async function () {
    provider = await AwsProvider({ config });
    recorder = provider.getClient({
      groupType: "Config::ConfigurationRecorder",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => recorder.getList(),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it("delete with invalid id", () =>
    pipe([
      () => ({
        live: {
          name: "b123",
        },
      }),
      recorder.destroy,
    ])());
});
