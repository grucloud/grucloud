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
            MonitorArn: `arn:${
              config.partition
            }:ce::${config.accountId()}:anomalymonitor/abcecedc-f3e2-4e6d-b2b8-63028730a499`,
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
            SubscriptionArn: `arn:${
              config.partition
            }:ce::${config.accountId()}:anomalysubscription/ee065538-d146-47ba-8c1f-e2ac6077f064`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("CostAllocationTag", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::CostAllocationTag",
        livesNotFound: ({ config }) => [{ TagKey: "myTagKey" }],
      }),
      awsResourceTest,
    ])());
  it("CostCategory", () =>
    pipe([
      () => ({
        groupType: "CostExplorer::CostCategory",
        livesNotFound: ({ config }) => [
          {
            CostCategoryArn: `arn:${
              config.partition
            }:ce::${config.accountId()}:costcategory/72cf8715-0107-4df5-bb56-c336b1514af4`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
