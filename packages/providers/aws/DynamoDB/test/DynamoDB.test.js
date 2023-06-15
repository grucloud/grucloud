const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DynamoDB", async function () {
  it.skip("GlobalTable", () =>
    pipe([
      () => ({
        groupType: "DynamoDB::GlobalTable",
        livesNotFound: ({ config }) => [
          {
            //TableName: "12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
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
  it("TableItem", () =>
    pipe([
      () => ({
        groupType: "DynamoDB::TableItem",
        livesNotFound: ({ config }) => [
          {
            TableName: "12345",
            Key: { Id: { S: "123" } },
          },
        ],
        skipGetByName: true,
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
            StreamArn: `arn:${
              config.partition
            }:kinesis:us-east-1:${config.accountId()}:stream/sam-app-KinesisStream-i22fijDM7MAY`,
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
