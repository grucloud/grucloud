const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ControlTower", async function () {
  it("Control", () =>
    pipe([
      () => ({
        groupType: "ControlTower::Control",
        livesNotFound: ({ config }) => [
          {
            targetIdentifier: `arn:aws:organizations::${config.accountId()}:ou/o-xs8pjirjbw/ou-941x-jjadijba`,
            controlIdentifier: `arn:aws:controltower:${config.region}::control/AWS-GR_EC2_VOLUME_INUSE_CHECK`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
