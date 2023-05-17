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
            TargetGroupARN: `arn:aws:elasticloadbalancing:${
              config.region
            }:${config.accountId()}:targetgroup/target-group-rest/ba26c2aeba8e7da0`,
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
  it("Notification", () =>
    pipe([
      () => ({
        groupType: "AutoScaling::Notification",
        livesNotFound: ({ config }) => [
          {
            AutoScalingGroupName: "lc-12345",
            TopicARN: `arn:aws:sns:${
              config.region
            }:${config.accountId()}:my-sns-topic`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Policy", () =>
    pipe([
      () => ({
        groupType: "AutoScaling::Policy",
        livesNotFound: ({ config }) => [
          {
            AutoScalingGroupName: "lc-12345",
            PolicyName: "p123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("WarmPool", () =>
    pipe([
      () => ({
        groupType: "AutoScaling::WarmPool",
        livesNotFound: ({ config }) => [
          {
            AutoScalingGroupName: "d123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
