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
  it("NotificationChannel", () =>
    pipe([
      () => ({
        groupType: "FMS::NotificationChannel",
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
  it("ProtocolsList", () =>
    pipe([
      () => ({
        groupType: "FMS::ProtocolsList",
        livesNotFound: ({ config }) => [
          { ListId: "l12345678901234567890123456789123456" },
        ],
      }),
      awsResourceTest,
    ])());
});
