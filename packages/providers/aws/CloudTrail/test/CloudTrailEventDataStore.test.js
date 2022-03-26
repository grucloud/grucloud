const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudTrail EventDataStore", async function () {
  let config;
  let provider;
  let eventDataStore;

  before(async function () {
    provider = AwsProvider({ config });
    eventDataStore = provider.getClient({
      groupType: "CloudTrail::EventDataStore",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => eventDataStore.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        eventDataStore.destroy({
          live: { EventDataStoreArn: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        eventDataStore.getById({
          EventDataStoreArn: "a-12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        eventDataStore.getByName({
          name: "124",
        }),
    ])
  );
});
