const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("Route53ResolverRuleAssociation", async function () {
  let config;
  let provider;
  let ruleAssociation;

  before(async function () {
    provider = await AwsProvider({ config });
    ruleAssociation = provider.getClient({
      groupType: "Route53Resolver::RuleAssociation",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => ruleAssociation.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        ruleAssociation.destroy({
          live: { ResolverRuleId: "12345", VPCId: "vpc-xx" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        ruleAssociation.getById({
          Id: "12345",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        ruleAssociation.getByName({
          name: "124",
        }),
    ])
  );
});
