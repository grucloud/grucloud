const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2RouteTableAssociation", async function () {
  let config;
  let provider;
  let routeTableAssociation;

  before(async function () {
    provider = AwsProvider({ config });
    routeTableAssociation = provider.getClient({
      groupType: "EC2::RouteTableAssociation",
    });
    await provider.start();
  });

  it(
    "delete with invalid id",
    pipe([
      () =>
        routeTableAssociation.destroy({
          live: {
            RouteTableAssociationId: "rtbassoc-04770dad06db7240a",
          },
        }),
    ])
  );
});
