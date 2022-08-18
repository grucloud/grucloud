const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("NetworkManager CoreNetwork", async function () {
  let config = () => ({ region: "us-west-2" });
  let provider;
  let coreNetwork;

  before(async function () {
    provider = await AwsProvider({ config });
    coreNetwork = provider.getClient({
      groupType: "NetworkManager::CoreNetwork",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => coreNetwork.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        coreNetwork.destroy({
          live: {
            CoreNetworkId: "core-network-123456789",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        coreNetwork.getById({
          CoreNetworkId: "core-network-123456789",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        coreNetwork.getByName({
          name: "core-network-abc",
        }),
    ])
  );
});
