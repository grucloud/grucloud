const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { tryCatch, pipe, tap } = require("rubico");

describe("EC2Route", async function () {
  let config;
  let provider;
  let route;

  before(async function () {
    provider = AwsProvider({ config });
    route = provider.getClient({ groupType: "EC2::Route" });
    await provider.start();
  });

  it(
    "delete with invalid id",
    pipe([
      () =>
        route.destroy({
          live: {
            RouteTableId: "rtb-0cd9b61a02eb4ba04",
            DestinationCidrBlock: "10.0.0.0/16",
          },
        }),
    ])
  );
});
