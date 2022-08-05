const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudFrontCachePolicy", async function () {
  let config;
  let provider;
  let cachePolicy;

  before(async function () {
    provider = await AwsProvider({ config });
    cachePolicy = provider.getClient({
      groupType: "CloudFront::CachePolicy",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => cachePolicy.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        cachePolicy.destroy({
          live: {
            CachePolicy: { Id: "658327ea-f89d-4fab-a63d-7e88639e58fa" },
            ETag: "ETVPDKIKX0DER",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        cachePolicy.getById({
          CachePolicy: { Id: "658327ea-f89d-4fab-a63d-7e88639e58fa" },
        }),
    ])
  );
});
