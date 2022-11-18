const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CostExplorer", async function () {
  it.skip("AnomalyMonitor", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::AnomalyMonitor",
        livesNotFound: ({ config }) => [{}],
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
