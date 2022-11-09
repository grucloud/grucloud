const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudTrail", async function () {
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
