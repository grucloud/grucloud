const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("BudgetsBudget", async function () {
  let config;
  let provider;
  let budget;

  before(async function () {
    provider = await AwsProvider({ config });
    budget = provider.getClient({
      groupType: "Budgets::Budget",
    });
    await provider.start();
  });
  after(async () => {});
  it(
    "list",
    pipe([
      () => budget.getList(),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () => ({
        live: {
          AccountId: provider.getConfig().accountId(),
          BudgetName: "b123",
        },
      }),
      (x) => budget.destroy(x),
    ])
  );
});
