const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudFrontFunction", async function () {
  let config;
  let provider;
  let functionEdge;

  before(async function () {
    provider = await AwsProvider({ config });
    functionEdge = provider.getClient({
      groupType: "CloudFront::Function",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => functionEdge.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        functionEdge.destroy({
          live: { Name: "a123", ETag: "ETVPDKIKX0DER" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        functionEdge.getById({})({
          Name: "a123",
          FunctionMetadata: { Stage: "DEVELOPMENT" },
        }),
    ])
  );
});
