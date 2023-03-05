const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("StorageGateway", async function () {
  it.skip("Cache", () =>
    pipe([
      () => ({
        groupType: "StorageGateway::Cache",
        livesNotFound: ({ config }) => [
          {
            //stateMachineArn: `arn:aws:states:us-east-1:${config.accountId()}:stateMachine:test-test`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Gateway", () =>
    pipe([
      () => ({
        groupType: "StorageGateway::Gateway",
        livesNotFound: ({ config }) => [
          {
            GatewayARN: `arn:aws:storagegateway:${
              config.region
            }:${config.accountId()}:gateway/sgw-12A3456B`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("TapePool", () =>
    pipe([
      () => ({
        groupType: "StorageGateway::TapePool",
        livesNotFound: ({ config }) => [
          {
            //stateMachineArn: `arn:aws:states:us-east-1:${config.accountId()}:stateMachine:test-test`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
