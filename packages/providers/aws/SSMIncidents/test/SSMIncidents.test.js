const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SSMIncidents", async function () {
  it("ReplicationSet", () =>
    pipe([
      () => ({
        groupType: "SSMIncidents::ReplicationSet",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:ssm-incidents:${
              config.region
            }:${config.accountId()}/replication-set/q1234`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ResponsePlan", () =>
    pipe([
      () => ({
        groupType: "SSMIncidents::ResponsePlan",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:ssm-incidents:${
              config.region
            }:${config.accountId()}/response-plan/q1234`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
