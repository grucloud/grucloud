const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DynamoDB", async function () {
  it("Table", () =>
    pipe([
      () => ({
        groupType: "DynamoDB::Table",
        livesNotFound: ({ config }) => [
          {
            TableName: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("KinesisStreamingDestination", () =>
    pipe([
      () => ({
        groupType: "DynamoDB::KinesisStreamingDestination",
        livesNotFound: ({ config }) => [
          {
            TableName: "12345",
            StreamArn: `arn:aws:kinesis:us-east-1:${config.accountId()}:stream/sam-app-KinesisStream-i22fijDM7MAY`,
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
