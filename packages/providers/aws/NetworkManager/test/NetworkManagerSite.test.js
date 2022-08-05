const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("NetworkManager Site", async function () {
  let config;
  let provider;
  let site;

  before(async function () {
    provider = await AwsProvider({ config });
    site = provider.getClient({
      groupType: "NetworkManager::Site",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        site.destroy({
          live: {
            GlobalNetworkId: "global-network-004d81c3933d7e5a1",
            SiteId: "site-0d621fa7de7691161",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        site.getById({
          GlobalNetworkId: "global-network-12345678",
          SiteId: "site-123456789",
        }),
    ])
  );
});
