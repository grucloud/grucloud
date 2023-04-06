const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("InternetMonitor", async function () {
  it.only("Monitor", () =>
    pipe([
      () => ({
        groupType: "InternetMonitor::Monitor",
        livesNotFound: ({ config }) => [{ MonitorName: "m123" }],
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
});
