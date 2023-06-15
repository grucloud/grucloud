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
              TopicArn: `arn:${config.partition}:sns:${
                config.region
              }:${config.accountId()}:idnonotexist`,
            },
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("PlatformApplication", () =>
    pipe([
      () => ({
        groupType: "SNS::PlatformApplication",
        livesNotFound: ({ config }) => [
          {
            PlatformApplicationArn: `arn:${config.partition}:sns:${
              config.region
            }:${config.accountId()}:app/GCM/ddddd`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
