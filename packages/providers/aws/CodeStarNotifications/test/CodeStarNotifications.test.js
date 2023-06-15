const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeStarNotifications", async function () {
  it("NotificationRule", () =>
    pipe([
      () => ({
        groupType: "CodeStarNotifications::NotificationRule",
        livesNotFound: ({ config }) => [
          {
            Arn: `arn:${config.partition}:codestar-notifications:${
              config.region
            }:${config.accountId()}:notificationrule/6ba9de29-73f2-436c-82e2-4ef7de54f061`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
