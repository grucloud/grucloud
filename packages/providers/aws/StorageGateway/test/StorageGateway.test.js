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
  it.skip("Gateway", () =>
    pipe([
      () => ({
        groupType: "StorageGateway::Gateway",
        livesNotFound: ({ config }) => [
          {
            //stateMachineArn: `arn:aws:states:us-east-1:${config.accountId()}:stateMachine:test-test`,
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
