const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { pipe, tap } = require("rubico");

describe("SQSQueue", async function () {
  let config;
  let provider;
  let queue;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    queue = provider.getClient({ groupType: "SQS::Queue" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => queue.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        queue.destroy({
          live: {
            QueueUrl: `https://sqs.${
              provider.config.region
            }.amazonaws.com/${provider.config.accountId()}/MyNewerQueue`,
          },
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        queue.getByName({
          name: "queue-124",
        }),
    ])
  );
});
