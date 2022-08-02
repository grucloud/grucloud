const assert = require("assert");
const { tryCatch, pipe, tap } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");

describe("EC2NatGateway", async function () {
  let provider;
  let natGateway;
  before(async function () {
    provider = await AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    natGateway = provider.getClient({ groupType: "EC2::NatGateway" });
  });

  it(
    "NatGateway destroy not found",
    pipe([
      () =>
        natGateway.destroy({
          live: {
            NatGatewayId: "nat-0ceb4fc535e8d1872",
          },
        }),
    ])
  );
});
