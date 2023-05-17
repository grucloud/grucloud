const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["LookoutVision"] });

describe("LookoutVision", async function () {
  it.skip("Project", () =>
    pipe([
      () => ({
        config,
        groupType: "LookoutVision::Project",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
