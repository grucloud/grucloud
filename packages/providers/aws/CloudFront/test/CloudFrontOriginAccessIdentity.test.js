const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("CloudFrontOriginAccessIdentity", async function () {
  let config;
  let provider;
  let originAccessIdentity;

  before(async function () {
    provider = await AwsProvider({ config });
    originAccessIdentity = provider.getClient({
      groupType: "CloudFront::OriginAccessIdentity",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => originAccessIdentity.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        originAccessIdentity.destroy({
          live: {
            ETag: "E3E08X4BDY57MM",
            CloudFrontOriginAccessIdentity: { Id: "E2D1PSO5NWDAJ5" },
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        originAccessIdentity.getById({
          ETag: "E3E08X4BDY57MM",
          CloudFrontOriginAccessIdentity: { Id: "E2D1PSO5NWDAJ5" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        originAccessIdentity.getByName({
          name: "access-identity-cloudfront-demo.grucloud.org.s3.us-east-1.amazonaws.com",
        }),
    ])
  );
});
