const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("GlobalAcceleratorAccelerator", async function () {
  let config;
  let provider;
  let accelerator;

  before(async function () {
    provider = await AwsProvider({ config });
    accelerator = provider.getClient({
      groupType: "GlobalAccelerator::Accelerator",
    });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => accelerator.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        accelerator.destroy({
          live: {
            AcceleratorArn:
              "arn:aws:globalaccelerator::840541460064:accelerator/123",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        accelerator.getById({})({
          AcceleratorArn:
            "arn:aws:globalaccelerator::840541460064:accelerator/123",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        accelerator.getByName({
          name: "accelerator-1234",
        }),
    ])
  );
});
