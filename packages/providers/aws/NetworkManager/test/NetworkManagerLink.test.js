const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("NetworkManager Link", async function () {
  let config;
  let provider;
  let site;

  before(async function () {
    provider = AwsProvider({ config });
    site = provider.getClient({
      groupType: "NetworkManager::Link",
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
            LinkId: "device-0d621fa7de7691161",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        site.getById({
          GlobalNetworkId: "global-network-004d81c3933d7e5a1",
          SiteId: "site-0d621fa7de7691161",
          LinkId: "device-0d621fa7de7691161",
        }),
    ])
  );
});
