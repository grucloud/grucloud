const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DocDBElastic", async function () {
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "DocDBElastic::Cluster",
        livesNotFound: ({ config }) => [
          {
            clusterArn: `arn:${config.partition}:docdb-elastic:${
              config.region
            }:${config.accountId()}:cluster/c123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
