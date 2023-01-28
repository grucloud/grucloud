const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

const config = () => ({ includeGroups: ["MediaPackage"] });

describe("MediaPackage", async function () {
  it("Channel", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaPackage::Channel",
        livesNotFound: ({ config }) => [{ Id: "n123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("OriginEndpoint", () =>
    pipe([
      () => ({
        config,
        groupType: "MediaPackage::OriginEndpoint",
        livesNotFound: ({ config }) => [{ Id: "n123" }],
      }),
      awsResourceTest,
    ])());
});
