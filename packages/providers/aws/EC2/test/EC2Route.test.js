const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { ConfigLoader } = require("@grucloud/core/ConfigLoader");
const { tryCatch, pipe, tap } = require("rubico");
const { EC2Route } = require("../EC2Route");

describe("EC2Route", async function () {
  let config;
  let provider;
  let route;

  before(async function () {
    try {
      config = ConfigLoader({ path: "../../../examples/multi" });
    } catch (error) {
      this.skip();
    }
    provider = AwsProvider({ config });
    route = EC2Route({ config: provider.config });
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
