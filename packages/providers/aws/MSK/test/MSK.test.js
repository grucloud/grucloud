const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("MSK", async function () {
  it("ClusterV2", () =>
    pipe([
      () => ({
        groupType: "MSK::ClusterV2",
        livesNotFound: ({ config }) => [
          {
            ClusterArn: `arn:${
              config.partition
            }:kafka:us-east-1:${config.accountId()}:cluster/demo-cluster-1/5db24fe7-4e03-4fb2-adb6-254e707209c5-s4`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Configuration", () =>
    pipe([
      () => ({
        groupType: "MSK::Configuration",
        livesNotFound: ({ config }) => [
          {
            Arn: `arn:${
              config.partition
            }:kafka:us-east-1:${config.accountId()}:configuration/my-configuration/9d0f971d-1873-4615-8cfd-7c8dba612825-19`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
