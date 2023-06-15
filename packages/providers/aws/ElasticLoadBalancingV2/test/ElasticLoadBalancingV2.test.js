const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ElasticLoadBalancingV2", async function () {
  it("Listener", () =>
    pipe([
      () => ({
        groupType: "ElasticLoadBalancingV2::Listener",
        livesNotFound: ({ config }) => [
          {
            ListenerArn: `arn:${config.partition}:elasticloadbalancing:${
              config.region
            }:${config.accountId()}:listener/app/load-balancer/e6f97c90654062f0/db2d92e8196bc8c1`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("LoadBalancer", () =>
    pipe([
      () => ({
        groupType: "ElasticLoadBalancingV2::LoadBalancer",
        livesNotFound: ({ config }) => [
          {
            Name: "alb",
            LoadBalancerArn: `arn:${config.partition}:elasticloadbalancing:${
              config.region
            }:${config.accountId()}:loadbalancer/app/load-balancer/e6f97c90654062f0`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TargetGroup", () =>
    pipe([
      () => ({
        groupType: "ElasticLoadBalancingV2::TargetGroup",
        livesNotFound: ({ config }) => [
          {
            TargetGroupArn: `arn:${config.partition}:elasticloadbalancing:${
              config.region
            }:${config.accountId()}:targetgroup/target-group-web/6d67bc913cf24fdd`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TargetGroupAttachments", () =>
    pipe([
      () => ({
        groupType: "ElasticLoadBalancingV2::TargetGroupAttachments",
        livesNotFound: ({ config }) => [
          {
            TargetGroupArn: `arn:${config.partition}:elasticloadbalancing:${
              config.region
            }:${config.accountId()}:targetgroup/target-group-web/6d67bc913cf24fdd`,
            Targets: [
              {
                Id: `arn:${config.partition}:lambda:${
                  config.region
                }:${config.accountId()}:function:AlbLambdaCdkStack-LambdaFunctionBF21E41F-VSCEutUH57C2`,
              },
            ],
          },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  //TargetGroupArn
  it("Rule", () =>
    pipe([
      () => ({
        groupType: "ElasticLoadBalancingV2::Rule",
        livesNotFound: ({ config }) => [
          {
            RuleArn: `arn:${config.partition}:elasticloadbalancing:${
              config.region
            }:${config.accountId()}:listener-rule/app/load-balancer/e6f97c90654062f0/db2d92e8196bc8c1/b902c6929ac9bcd7`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
