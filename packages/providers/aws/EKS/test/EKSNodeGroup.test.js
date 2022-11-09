const assert = require("assert");
const { AwsProvider } = require("../../AwsProvider");
const { pipe, tap } = require("rubico");

describe("EKSNodeGroup", async function () {
  let config;
  let provider;
  let nodeGroup;

  before(async function () {
    provider = await AwsProvider({ config });
    nodeGroup = provider.getClient({ groupType: "EKS::NodeGroup" });
    await provider.start();
  });
  // it(
  //   "list",
  //   pipe([
  //     () => nodeGroup.getList(),
  //     tap(({ items }) => {
  //       assert(Array.isArray(items));
  //     }),
  //   ])
  // );
  it(
    "delete with invalid id",
    pipe([
      () =>
        nodeGroup.destroy({
          live: { clusterName: "mycluster", nodegroupName: "12345" },
        }),
    ])
  );
  it(
    "getById with invalid id",
    pipe([
      () =>
        nodeGroup.getById({})({
          clusterName: "mycluster",
          nodegroupName: "12345",
        }),
    ])
  );
  // it(
  //   "getByName with invalid id",
  //   pipe([
  //     () =>
  //       nodeGroup.getByName({
  //         name: "124",
  //       }),
  //   ])
  // );
});
