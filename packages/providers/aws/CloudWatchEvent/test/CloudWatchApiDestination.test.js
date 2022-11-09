const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudWatchEventApiDestination", async function () {
  let config;
  let provider;
  let apiDestination;

  before(async function () {
    provider = await AwsProvider({ config });
    apiDestination = provider.getClient({
      groupType: "CloudWatchEvents::ApiDestination",
    });
    await provider.start();
  });

  it(
    "delete with invalid id",
    pipe([
      () =>
        apiDestination.destroy({
          live: { Name: "api-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        apiDestination.getById({})({
          Name: "api-12345",
        }),
    ])
  );
});
