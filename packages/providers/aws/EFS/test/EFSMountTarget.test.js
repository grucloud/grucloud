const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EFSMountTarget", async function () {
  let config;
  let provider;
  let fileSystem;

  before(async function () {
    provider = await AwsProvider({ config });
    fileSystem = provider.getClient({ groupType: "EFS::MountTarget" });
    await provider.start();
  });

  it(
    "delete with invalid id",
    pipe([
      () =>
        fileSystem.destroy({
          live: {
            MountTargetId: "fsmt-0fda94134613a4f1b",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        fileSystem.getById({
          MountTargetId: "fsmt-0fda94134613a4f1b",
        }),
    ])
  );
});
