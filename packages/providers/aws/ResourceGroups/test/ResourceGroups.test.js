const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ResourceGroups", async function () {
  it("Group", () =>
    pipe([
      () => ({
        groupType: "ResourceGroups::Group",
        livesNotFound: ({ config }) => [
          {
            GroupArn: `arn:aws:resource-groups:${
              config.region
            }:${config.accountId()}:group/g123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
