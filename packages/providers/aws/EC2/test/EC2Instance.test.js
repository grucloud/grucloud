const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 Instance", async function () {
  let config;
  let provider;
  let instance;

  before(async function () {
    provider = AwsProvider({ config });
    instance = provider.getClient({
      groupType: "EC2::Instance",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => instance.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        instance.destroy({
          live: {
            InstanceId: "i-0e85b55470b03b863",
          },
        }),
    ])
  );
  // it(
  //   "getByName with invalid id",
  //   pipe([
  //     () =>
  //       instance.getByName({
  //         name: "i-0e85b55470b03b863",
  //       }),
  //   ])
  // );
});
