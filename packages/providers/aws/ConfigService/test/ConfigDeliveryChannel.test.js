const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("ConfigDeliveryChannel", async function () {
  let config;
  let provider;
  let deliveryChannel;

  before(async function () {
    provider = await AwsProvider({ config });
    deliveryChannel = provider.getClient({
      groupType: "Config::DeliveryChannel",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => deliveryChannel.getList(),
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
      deliveryChannel.destroy,
    ])());
});
