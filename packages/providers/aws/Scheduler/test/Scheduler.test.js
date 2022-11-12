const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Scheduler", async function () {
  it("Schedule", () =>
    pipe([
      () => ({
        groupType: "Scheduler::Schedule",
        livesNotFound: ({ config }) => [
          { Name: "c123", ClientToken: "9cd3d11e-6054-4c6b-86f3-f9ab016087fa" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ScheduleGroup", () =>
    pipe([
      () => ({
        groupType: "Scheduler::ScheduleGroup",
        livesNotFound: ({ config }) => [{ Name: "c123" }],
      }),
      awsResourceTest,
    ])());
});
