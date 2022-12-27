const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("RUM", async function () {
  it("AppMonitor", () =>
    pipe([
      () => ({
        groupType: "RUM::AppMonitor",
        livesNotFound: ({ config }) => [{ Name: "d123" }],
      }),
      awsResourceTest,
    ])());
  it("MetricsDestination", () =>
    pipe([
      () => ({
        groupType: "RUM::MetricsDestination",
        livesNotFound: ({ config }) => [
          { AppMonitorName: "d123", Destination: "CloudWatch" },
        ],
      }),
      awsResourceTest,
    ])());
});
