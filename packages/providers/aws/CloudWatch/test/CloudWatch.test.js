const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudWatch", async function () {
  it("CompositeAlarm", () =>
    pipe([
      () => ({
        groupType: "CloudWatch::CompositeAlarm",
        livesNotFound: ({ config }) => [{ AlarmName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it("Dashboard", () =>
    pipe([
      () => ({
        groupType: "CloudWatch::Dashboard",
        livesNotFound: ({ config }) => [{ DashboardName: "a123" }],
      }),
      awsResourceTest,
    ])());
  it("MetricAlarm", () =>
    pipe([
      () => ({
        groupType: "CloudWatch::MetricAlarm",
        livesNotFound: ({ config }) => [{ AlarmName: "api-12345" }],
      }),
      awsResourceTest,
    ])());
  it.skip("MetricStream", () =>
    pipe([
      () => ({
        groupType: "CloudWatch::MetricStream",
        livesNotFound: ({ config }) => [{ AlarmName: "api-12345" }],
      }),
      awsResourceTest,
    ])());
});
