const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppRunner", async function () {
  it("AutoScalingConfiguration", () =>
    pipe([
      () => ({
        groupType: "AppRunner::AutoScalingConfiguration",
        livesNotFound: ({ config }) => [
          {
            AutoScalingConfigurationArn: `arn:aws:apprunner:${
              config.region
            }:${config.accountId()}:autoscalingconfiguration/DefaultConfigurationko/1/00000000000000000000000000000001`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Connection", () =>
    pipe([
      () => ({
        groupType: "AppRunner::Connection",
        livesNotFound: ({ config }) => [
          {
            ConnectionName: "conn1",
            ConnectionArn: `arn:aws:apprunner:${
              config.region
            }:${config.accountId()}:connection/mock-server/4d97761b3685416bb95d7debd86ca5a8`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("CustomDomain", () =>
    pipe([
      () => ({
        groupType: "AppRunner::CustomDomain",
        livesNotFound: ({ config }) => [
          {
            DomainName: "runner.grucloud.org",
            ServiceArn: `arn:aws:apprunner:${
              config.region
            }:${config.accountId()}:service/mock-server/4d97761b3685416bb95d7debd86ca5a8`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ObservabilityConfiguration", () =>
    pipe([
      () => ({
        groupType: "AppRunner::ObservabilityConfiguration",
        livesNotFound: ({ config }) => [
          {
            ObservabilityConfigurationArn: `arn:aws:apprunner:${
              config.region
            }:${config.accountId()}:observabilityconfiguration/DefaultConfigurationKO/1/00000000000000000000000000000001`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Service", () =>
    pipe([
      () => ({
        groupType: "AppRunner::Service",
        livesNotFound: ({ config }) => [
          {
            ServiceArn: `arn:aws:apprunner:${
              config.region
            }:${config.accountId()}:service/mock-server/4d97761b3685416bb95d7debd86ca5a8`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("VpcConnector", () =>
    pipe([
      () => ({
        groupType: "AppRunner::VpcConnector",
        livesNotFound: ({ config }) => [
          {
            VpcConnectorArn: `arn:aws:apprunner:${
              config.region
            }:${config.accountId()}:vpcconnector/connector/1/89fea545a5da460c843c8329e21f7daf`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("VpcIngressConnection", () =>
    pipe([
      () => ({
        groupType: "AppRunner::VpcIngressConnection",
        livesNotFound: ({ config }) => [
          {
            VpcIngressConnectionArn: `arn:aws:apprunner:${
              config.region
            }:${config.accountId()}:vpcingressconnection/connector/1/89fea545a5da460c843c8329e21f7daf`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
