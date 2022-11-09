const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ApplicationAutoScaling", async function () {
  it("Policy", () =>
    pipe([
      () => ({
        groupType: "ApplicationAutoScaling::Policy",
        livesNotFound: ({ config }) => [
          {
            PolicyName: "p123",
            ResourceId: "r123",
            ScalableDimension: "dynamodb:index:ReadCapacityUnits",
            ServiceNamespace: "dynamodb",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Target", () =>
    pipe([
      () => ({
        groupType: "ApplicationAutoScaling::Target",
        livesNotFound: ({ config }) => [
          {
            ResourceId: "r123",
            ScalableDimension: "dynamodb:index:ReadCapacityUnits",
            ServiceNamespace: "dynamodb",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
