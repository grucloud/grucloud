const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EFSAccessPoint", async function () {
  let config;
  let provider;
  let accessPoint;

  before(async function () {
    provider = AwsProvider({ config });
    accessPoint = provider.getClient({ groupType: "EFS::AccessPoint" });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        accessPoint.destroy({
          live: {
            AccessPointId:
              "arn:aws:elasticfilesystem:us-east-1:840541460064:access-point/fsap-0b3ae155f60ccbb8a",
          },
        }),
    ])
  );
});
