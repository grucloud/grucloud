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
  it.skip("EventDataStore", () =>
    pipe([
      () => ({
        groupType: "CloudTrail::EventDataStore",
        livesNotFound: ({ config }) => [
          {
            EventDataStoreArn: `arn:aws:cloudtrail:${
              config.region
            }:${config.accountId()}:eventdatastore/ee54-4813-92d5-999ae`,
            nameNotFound: `arn:aws:cloudtrail:${
              config.region
            }:${config.accountId()}:eventdatastore/ee54-4813-92d5-999ae`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
