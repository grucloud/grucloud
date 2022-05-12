const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 FlowLogs", async function () {
  let config;
  let provider;
  let flowLog;

  before(async function () {
    provider = AwsProvider({ config });
    flowLog = provider.getClient({
      groupType: "EC2::FlowLogs",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => flowLog.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        flowLog.destroy({
          live: {
            FlowLogId: "fl-0c95e8a96eb84d765",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        flowLog.getById({
          FlowLogId: "fl-0c95e8a96eb84d765",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        flowLog.getByName({
          name: "a123",
        }),
    ])
  );
});
