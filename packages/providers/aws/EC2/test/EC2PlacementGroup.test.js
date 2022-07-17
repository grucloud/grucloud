const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("PlacementGroup", async function () {
  let config;
  let provider;
  let placementGroup;

  before(async function () {
    provider = AwsProvider({ config });
    placementGroup = provider.getClient({
      groupType: "EC2::PlacementGroup",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => placementGroup.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        placementGroup.destroy({
          live: {
            GroupName: "a-123",
          },
        }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        placementGroup.getById({
          GroupName: "a-123",
        }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        placementGroup.getByName({
          name: "invalid-placementGroup-id",
        }),
    ])
  );
});
