const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudFormation", async function () {
  it("Stack", () =>
    pipe([
      () => ({
        groupType: "CloudFormation::Stack",
        livesNotFound: ({ config }) => [
          {
            StackName: "b123",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
