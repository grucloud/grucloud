const assert = require("assert");
const { tryCatch, pipe, tap } = require("rubico");
const { AwsProvider } = require("../../AwsProvider");

describe("EC2VpcEndpoint", async function () {
  let provider;
  let vpcEndpoint;
  before(async function () {
    provider = AwsProvider({
      config: () => ({ projectName: "gru-test" }),
    });
    vpcEndpoint = provider.getClient({ groupType: "EC2::VpcEndpoint" });
  });
  it(
    "list",
    pipe([
      () => vpcEndpoint.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "vpcEndpoint destroy not found",
    pipe([
      () =>
        vpcEndpoint.destroy({
          live: {
            VpcEndpointId: "vpce-0ceb4fc535e8d1872",
          },
        }),
    ])
  );
  it(
    "vpcEndpoint getById not found",
    pipe([
      () =>
        vpcEndpoint.getById({
          VpcEndpointId: "vpce-0ceb4fc535e8d1872",
        }),
    ])
  );
});
