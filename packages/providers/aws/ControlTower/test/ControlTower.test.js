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
            targetIdentifier: `arn:${
              config.partition
            }:organizations::${config.accountId()}:ou/o-xs8pjirjbw/ou-941x-jjadijba`,
            controlIdentifier: `arn:${config.partition}:controltower:${config.region}::control/AWS-GR_EC2_VOLUME_INUSE_CHECK`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
