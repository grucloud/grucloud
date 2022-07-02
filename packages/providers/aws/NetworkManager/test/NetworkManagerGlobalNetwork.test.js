const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("NetworkManager GlobalNetwork", async function () {
  let config;
  let provider;
  let globalNetwork;

  before(async function () {
    provider = AwsProvider({ config });
    globalNetwork = provider.getClient({
      groupType: "NetworkManager::GlobalNetwork",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => globalNetwork.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        globalNetwork.destroy({
          live: {
            GlobalNetworkId: "a-123",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        globalNetwork.getById({
          GlobalNetworkId: "a-123",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        globalNetwork.getByName({
          name: "a124",
        }),
    ])
  );
});
