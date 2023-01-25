const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudWatchEvents", async function () {
  it("ApiDestination", () =>
    pipe([
      () => ({
        groupType: "CloudWatchEvents::ApiDestination",
        livesNotFound: ({ config }) => [{ Name: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("Connection", () =>
    pipe([
      () => ({
        groupType: "CloudWatchEvents::Connection",
        livesNotFound: ({ config }) => [{ Name: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("EventBus", () =>
    pipe([
      () => ({
        groupType: "CloudWatchEvents::EventBus",
        livesNotFound: ({ config }) => [{ Name: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("Rule", () =>
    pipe([
      () => ({
        groupType: "CloudWatchEvents::Rule",
        livesNotFound: ({ config }) => [{ Name: "12345" }],
      }),
      awsResourceTest,
    ])());
  it("Target", () =>
    pipe([
      () => ({
        groupType: "CloudWatchEvents::Target",
        livesNotFound: ({ config }) => [
          { Rule: "my-rule", EventBusName: "default", Id: "invalid" },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
});
