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
});
