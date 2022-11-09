const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("GlobalAcceleratorEndpointGroup", async function () {
  let config;
  let provider;
  let endpointGroup;

  before(async function () {
    provider = await AwsProvider({ config });
    endpointGroup = provider.getClient({
      groupType: "GlobalAccelerator::EndpointGroup",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        endpointGroup.destroy({
          live: {
            EndpointGroupArn:
              "arn:aws:globalaccelerator::840541460064:accelerator/310c604a-5013-416e-b940-e53d61b2da2d/listener/686088c5/endpoint-group/98de4326d002",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        endpointGroup.getById({})({
          EndpointGroupArn:
            "arn:aws:globalaccelerator::840541460064:accelerator/310c604a-5013-416e-b940-e53d61b2da2d/listener/686088c5/endpoint-group/98de4326d002",
        }),
    ])
  );
});
