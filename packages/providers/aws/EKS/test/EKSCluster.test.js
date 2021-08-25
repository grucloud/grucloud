const assert = require("assert");
const { tryCatch, pipe, tap } = require("rubico");

const { AwsProvider } = require("../../AwsProvider");
const { EKSCluster } = require("../EKSCluster");

describe("EKSCluster", async function () {
  let config;
  let provider;
  let cluster;

  before(async function () {
    provider = AwsProvider({
      name: "aws",
      config: () => ({ projectName: "gru-test" }),
    });
    cluster = EKSCluster({ config: provider.config });

    await provider.start();
  });

  it.only(
    "delete with invalid id",
    pipe([
      () =>
        cluster.destroy({
          live: { name: "12345" },
        }),
    ])
  );
});
