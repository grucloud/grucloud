const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Lambda", async function () {
  it("EventSourceMapping", () =>
    pipe([
      () => ({
        groupType: "Lambda::EventSourceMapping",
        livesNotFound: ({ config }) => [
          { UUID: "6593e837-c99d-4b4e-a743-68f45fa54e9f" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Function", () =>
    pipe([
      () => ({
        groupType: "Lambda::Function",
        livesNotFound: ({ config }) => [
          { Configuration: { FunctionArn: "a12345" } },
        ],
      }),
      awsResourceTest,
    ])());
  it("Layer", () =>
    pipe([
      () => ({
        groupType: "Lambda::Layer",
        livesNotFound: ({ config }) => [{ LayerName: "aa", Version: "1" }],
      }),
      awsResourceTest,
    ])());
});
