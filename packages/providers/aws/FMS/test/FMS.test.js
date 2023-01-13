const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("FMS", async function () {
  it("AdminAccount", () =>
    pipe([
      () => ({
        groupType: "FMS::AdminAccount",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Policy", () =>
    pipe([
      () => ({
        groupType: "FMS::Policy",
        livesNotFound: ({ config }) => [
          { PolicyId: "p12311111111111111111111111111111111" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("Protocol", () =>
    pipe([
      () => ({
        groupType: "FMS::Protocol",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
