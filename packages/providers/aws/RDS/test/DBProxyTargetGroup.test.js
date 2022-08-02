const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("DBProxyTargetGroup", async function () {
  let config;
  let provider;
  let dbProxyTargetGroup;

  before(async function () {
    provider = await AwsProvider({ config });
    dbProxyTargetGroup = provider.getClient({
      groupType: "RDS::DBProxyTargetGroup",
    });
    await provider.start();
  });
  it(
    "delete with invalid id",
    pipe([
      () =>
        dbProxyTargetGroup.destroy({
          live: {
            DBProxyName: "proxyName-12345",
            TargetGroupName: "target",
          },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        dbProxyTargetGroup.getById({
          DBProxyName: "proxyName-12345",
          TargetGroupName: "target",
        }),
    ])
  );
});
