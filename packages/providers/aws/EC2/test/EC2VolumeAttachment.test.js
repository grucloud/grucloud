const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EC2 VolumeAttachment", async function () {
  let config;
  let provider;
  let volumeAttachment;

  before(async function () {
    provider = AwsProvider({ config });
    volumeAttachment = provider.getClient({
      groupType: "EC2::VolumeAttachment",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        volumeAttachment.destroy({
          live: {
            VolumeId: "vol-035a2aa7c23edd8e0",
          },
        }),
      tap((params) => {
        assert(true);
      }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        volumeAttachment.getById({
          VolumeId: "vol-035a2aa7c23edd8e0",
        }),
    ])
  );
});
