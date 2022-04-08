const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EFSFileSystem", async function () {
  let config;
  let provider;
  let fileSystem;

  before(async function () {
    provider = AwsProvider({ config });
    fileSystem = provider.getClient({ groupType: "EFS::FileSystem" });
    await provider.start();
  });
  it(
    "list",
    pipe([
      () => fileSystem.getList(),
      tap(({ items }) => {
        assert(Array.isArray(items));
      }),
    ])
  );
  it(
    "delete with invalid id",
    pipe([
      () =>
        fileSystem.destroy({
          live: {
            FileSystemId:
              "arn:aws:elasticfilesystem:us-east-1:840541460064:file-system/fs-0aaaf7b0715648e5a",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        fileSystem.getById({
          FileSystemId:
            "arn:aws:elasticfilesystem:us-east-1:840541460064:file-system/fs-0aaaf7b0715648e5a",
        }),
    ])
  );
  it(
    "getByName with invalid id",
    pipe([
      () =>
        fileSystem.getByName({
          name: "a-124",
        }),
    ])
  );
});
