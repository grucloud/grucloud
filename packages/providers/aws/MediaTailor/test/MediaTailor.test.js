const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["MediaTailor"] });

describe("MediaTailor", async function () {
  it.skip("Configuration", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaTailor::Configuration",
        livesNotFound: ({ config }) => [{ Name: "n123" }],
      }),
      awsResourceTest,
    ])());
});
