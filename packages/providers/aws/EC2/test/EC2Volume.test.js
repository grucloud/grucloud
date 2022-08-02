const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 Volume", async function () {
  let config;
  let provider;
  let volume;

  before(async function () {
    provider = await AwsProvider({ config });
    volume = provider.getClient({
      groupType: "EC2::Volume",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => volume.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        volume.destroy({
          live: {
            VolumeId: "vol-035a2aa7c23edd8e0",
          },
        }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  // it(
  //   "getByName with invalid id",
  //   pipe([
  //     () =>
  //       volume.getByName({
  //         name: "vol-035a2aa7c23edd8e0",
  //       }),
  //   ])
  // );
});
