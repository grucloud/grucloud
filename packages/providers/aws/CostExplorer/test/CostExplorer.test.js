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
  it("AnomalySubscription", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::AnomalySubscription",
        livesNotFound: ({ config }) => [
          {
            SubscriptionArn: `arn:aws:ce::${config.accountId()}:anomalysubscription/ee065538-d146-47ba-8c1f-e2ac6077f064`,
          },
        ],
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
  it("CostCategory", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::CostCategory",
        livesNotFound: ({ config }) => [
          {
            CostCategoryArn: `arn:aws:ce::${config.accountId()}:costcategory/72cf8715-0107-4df5-bb56-c336b1514af4`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
