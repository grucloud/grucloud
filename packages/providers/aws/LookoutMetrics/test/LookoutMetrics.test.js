const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["LookoutMetrics"] });

describe("LookoutMetrics", async function () {
  it.skip("Alert", () =>
    pipe([
      () => ({
        config,
        groupType: "LookoutMetrics::Alert",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("AnomalyDetector", () =>
    pipe([
      () => ({
        config,
        groupType: "LookoutMetrics::AnomalyDetector",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
