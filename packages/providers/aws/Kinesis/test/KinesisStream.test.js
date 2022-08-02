const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("KinesisStream", async function () {
  let config;
  let provider;
  let stream;

  before(async function () {
    provider = await AwsProvider({ config });
    stream = provider.getClient({ groupType: "Kinesis::Stream" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => stream.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        stream.destroy({
          live: { StreamName: "a-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        stream.getById({
          StreamName: "a-124",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        stream.getByName({
          name: "a-124",
        }),
    ])
  );
});
