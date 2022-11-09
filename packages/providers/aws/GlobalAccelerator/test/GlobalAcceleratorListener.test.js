const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("GlobalAcceleratorListener", async function () {
  let config;
  let provider;
  let listener;

  before(async function () {
    provider = await AwsProvider({ config });
    listener = provider.getClient({
      groupType: "GlobalAccelerator::Listener",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        listener.destroy({
          live: {
            ListenerArn:
              "arn:aws:globalaccelerator::840541460064:accelerator/a74affc1-eae0-427b-9011-0b04fadaf8e1/listener/f13b08ab",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        listener.getById({})({
          ListenerArn:
            "arn:aws:globalaccelerator::840541460064:accelerator/a74affc1-eae0-427b-9011-0b04fadaf8e1/listener/f13b08ab",
        }),
    ])
  );
});
