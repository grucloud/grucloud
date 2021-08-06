const assert = require("assert");
const { tryCatch, pipe, tap } = require("rubico");

const { AwsProvider } = require("../../AwsProvider");
const { AwsNatGateway } = require("../AwsNatGateway");

describe("AwsNatGateway", async function () {
  let config;
  let provider;

  before(async function () {
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
  });

  it(
    "NatGateway destroy not found",
    pipe([
      () => provider.config,
      (config) => AwsNatGateway({ config }),
      tryCatch(
        (natGateway) =>
          natGateway.destroy({
            live: {
              NatGatewayId: "nat-0ceb4fc535e8d1872",
            },
          }),
        (error) => {
          assert(false, "shoud not be here");
        }
      ),
    ])
  );
});
