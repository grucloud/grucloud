const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Connect", async function () {
  it.skip("BotAssociation", () =>
    pipe([
      () => ({
        groupType: "Connect::BotAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ContactFlow", () =>
    pipe([
      () => ({
        groupType: "Connect::ContactFlow",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ContactFlowModule", () =>
    pipe([
      () => ({
        groupType: "Connect::ContactFlowModule",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("HoursOfOperations", () =>
    pipe([
      () => ({
        groupType: "Connect::HoursOfOperations",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Instance", () =>
    pipe([
      () => ({
        groupType: "Connect::Instance",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Instance", () =>
    pipe([
      () => ({
        groupType: "Connect::Instance",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("InstanceStorageConfig", () =>
    pipe([
      () => ({
        groupType: "Connect::InstanceStorageConfig",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
