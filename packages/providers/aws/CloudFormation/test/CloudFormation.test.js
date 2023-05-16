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
  it("StackSet", () =>
    pipe([
      () => ({
        groupType: "CloudFormation::StackSet",
        livesNotFound: ({ config }) => [
          {
            StackSetName: "b123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("StackSetInstance", () =>
    pipe([
      () => ({
        groupType: "CloudFormation::StackSetInstance",
        livesNotFound: ({ config }) => [
          {
            StackSetName: "b123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Type", () =>
    pipe([
      () => ({
        groupType: "CloudFormation::Type",
        livesNotFound: ({ config }) => [
          {
            TypeName: "GC::MyService::MyResource",
            Type: "RESOURCE",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
