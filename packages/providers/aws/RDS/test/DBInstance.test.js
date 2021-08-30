const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");
const { DBInstance } = require("../DBInstance");

describe("DBInstance", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    cluster = DBInstance({ config: provider.config });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => cluster.getList(),
      tap((items) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        cluster.destroy({
          live: { DBInstanceIdentifier: "instance-12345" },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        cluster.getByName({
          name: "124",
        }),
    ])
  );
});
