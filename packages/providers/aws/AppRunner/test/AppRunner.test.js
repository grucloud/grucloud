const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("AppRunner", async function () {
  it("Connection", () =>
    pipe([
      () => ({
        groupType: "AppRunner::Connection",
        livesNotFound: ({ config }) => [
          {
            ConnectionArn: `arn:aws:apprunner:us-east-1:${config.accountId()}:connection/mock-server/4d97761b3685416bb95d7debd86ca5a8`,
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
            ServiceArn: `arn:aws:apprunner:us-east-1:${config.accountId()}:service/mock-server/4d97761b3685416bb95d7debd86ca5a8`,
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
            VpcConnectorArn: `arn:aws:apprunner:us-east-1:${config.accountId()}:vpcconnector/connector/1/89fea545a5da460c843c8329e21f7daf`,
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
            VpcIngressConnectionArn: `arn:aws:apprunner:us-east-1:${config.accountId()}:vpcingressconnection/connector/1/89fea545a5da460c843c8329e21f7daf`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
