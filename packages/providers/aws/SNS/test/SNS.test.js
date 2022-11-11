const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SNS", async function () {
  it("Topic", () =>
    pipe([
      () => ({
        groupType: "SNS::Topic",
        livesNotFound: ({ config }) => [
          {
            Attributes: {
              TopicArn: `arn:aws:sns:us-east-1:${config.accountId()}:idnonotexist`,
            },
          },
        ],
      }),
      awsResourceTest,
    ])());
});
