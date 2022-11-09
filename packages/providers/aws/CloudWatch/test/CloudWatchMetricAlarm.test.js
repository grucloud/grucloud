const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("CloudWatchMetricAlarm", async function () {
  let config;
  let provider;
  let alarm;

  before(async function () {
    provider = await AwsProvider({ config });
    alarm = provider.getClient({
      groupType: "CloudWatch::MetricAlarm",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => alarm.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        alarm.destroy({
          live: { AlarmName: "api-12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        alarm.getById({})({
          Name: "api-12345",
        }),
    ])
  );
});
