const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeStarNotifications", async function () {
  it.skip("NotificationRule", () =>
    pipe([
      () => ({
        groupType: "CodeStarNotifications::NotificationRule",
        livesNotFound: ({ config }) => [
          {
            ConnectionArn: `arn:aws:codestar-notifications:us-east-1:${config.accountId()}:notification-rule/6ba9de29-73f2-436c-82e2-4ef7de54f061`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
