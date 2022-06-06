const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("RAMPrincipalAssociation", async function () {
  let config;
  let provider;
  let principalAssociation;

  before(async function () {
    provider = AwsProvider({ config });
    principalAssociation = provider.getClient({
      groupType: "RAM::PrincipalAssociation",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => principalAssociation.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        principalAssociation.destroy({
          live: {
            resourceShareArn:
              "arn:aws:ram:us-east-1:840541460064:resource-share/e4b6b5bd-74db-4776-9967-dc13aa3b2807",
            principals: ["123456789012"],
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        principalAssociation.getById({
          resourceShareArn:
            "arn:aws:ram:us-east-1:840541460064:resource-share/e4b6b5bd-74db-4776-9967-dc13aa3b2807",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        principalAssociation.getByName({
          name: "124",
        }),
    ])
  );
});
