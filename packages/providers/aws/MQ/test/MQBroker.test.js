const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("MQBroker", async function () {
  let config;
  let provider;
  let broker;

  before(async function () {
    provider = await AwsProvider({ config });
    broker = provider.getClient({
      groupType: "MQ::Broker",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => broker.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        broker.destroy({
          live: {
            BrokerId: "b-123",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        broker.getById({})({
          BrokerId: "b-123",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        broker.getByName({
          name: "broker-1234",
        }),
    ])
  );
});
