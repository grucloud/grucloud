const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CostExplorer", async function () {
  it("AnomalyMonitor", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::AnomalyMonitor",
        livesNotFound: ({ config }) => [
          {
            MonitorArn: `arn:aws:ce::${config.accountId()}:anomalymonitor/abcecedc-f3e2-4e6d-b2b8-63028730a499`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("AnomalySubscription", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::AnomalySubscription",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("CostAllocationTag", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::CostAllocationTag",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("CostCategory", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::CostCategory",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
