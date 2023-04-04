const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudTrail", async function () {
  it("Channel", () =>
    pipe([
      () => ({
        groupType: "CloudTrail::Channel",
        livesNotFound: ({ config }) => [
          {
            ChannelArn: "6593e837-c99d-4b4e-a743-68f45fa54e9f",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Trail", () =>
    pipe([
      () => ({
        groupType: "CloudTrail::Trail",
        livesNotFound: ({ config }) => [
          {
            Name: "a123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("EventDataStore", () =>
    pipe([
      () => ({
        groupType: "CloudTrail::EventDataStore",
        livesNotFound: ({ config }) => [
          {
            EventDataStoreArn: "a-12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
