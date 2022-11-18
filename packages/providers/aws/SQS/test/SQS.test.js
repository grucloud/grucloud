const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SQS", async function () {
  it("Queue", () =>
    pipe([
      () => ({
        groupType: "SQS::Queue",
        livesNotFound: ({ config }) => [
          {
            QueueUrl: `https://sqs.${
              config.region
            }.amazonaws.com/${config.accountId()}/MyNewerQueue`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("RedriveAllowPolicy", () =>
    pipe([
      () => ({
        groupType: "SQS::RedriveAllowPolicy",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("RedrivePolicy", () =>
    pipe([
      () => ({
        groupType: "SQS::RedrivePolicy",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
