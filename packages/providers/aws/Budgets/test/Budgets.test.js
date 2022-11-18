const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Budgets", async function () {
  it("Budget", () =>
    pipe([
      () => ({
        groupType: "Budgets::Budget",
        livesNotFound: ({ config }) => [
          {
            BudgetName: "b123",
            AccountId: config.accountId(),
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("BudgetAction", () =>
    pipe([
      () => ({
        groupType: "Budgets::BudgetAction",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
