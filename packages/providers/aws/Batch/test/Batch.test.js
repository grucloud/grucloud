const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Batch", async function () {
  it("ComputeEnvironment", () =>
    pipe([
      () => ({
        groupType: "Batch::ComputeEnvironment",
        livesNotFound: ({ config }) => [
          {
            computeEnvironmentName: "compute-environment",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("JobDefinition", () =>
    pipe([
      () => ({
        groupType: "Batch::JobDefinition",
        livesNotFound: ({ config }) => [
          {
            jobDefinitionArn: `arn:aws:batch:us-east-1:${config.accountId()}:job-definition/job-definition:1`,
          },
        ],
        skipDelete: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("JobQueue", () =>
    pipe([
      () => ({
        groupType: "Batch::JobQueue",
        livesNotFound: ({ config }) => [
          {
            jobQueueName: "j123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("SchedulingPolicy", () =>
    pipe([
      () => ({
        groupType: "Batch::SchedulingPolicy",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:batch:us-east-1:${config.accountId()}:scheduling-policy/a123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
