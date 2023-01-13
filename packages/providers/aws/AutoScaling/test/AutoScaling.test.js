const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AutoScaling", async function () {
  it("AutoScalingGroup", () =>
    pipe([
      () => ({
        groupType: "AutoScaling::AutoScalingGroup",
        livesNotFound: ({ config }) => [
          {
            AutoScalingGroupName: "TOTO",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("AutoScalingAttachment", () =>
    pipe([
      () => ({
        groupType: "AutoScaling::AutoScalingAttachment",
        //TODO
        skipGetById: true,
        livesNotFound: ({ config }) => [
          {
            AutoScalingGroupName: "TOTO",
            TargetGroupARN: `arn:aws:elasticloadbalancing:us-east-1:${config.accountId()}:targetgroup/target-group-rest/ba26c2aeba8e7da0`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("LaunchConfiguration", () =>
    pipe([
      () => ({
        groupType: "AutoScaling::LaunchConfiguration",
        livesNotFound: ({ config }) => [
          {
            LaunchConfigurationName: "lc-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
