const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("ResourceExplorer2", async function () {
  it("Index", () =>
    pipe([
      () => ({
        groupType: "ResourceExplorer2::Index",
        livesNotFound: ({ config }) => [
          {
            Arn: `arn:aws:resource-explorer-2:${
              config.region
            }:${config.accountId()}:index/b6e29843-fee3-4b39-84cc-33e51a87dd60`,
          },
        ],
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("View", () =>
    pipe([
      () => ({
        groupType: "ResourceExplorer2::View",
        livesNotFound: ({ config }) => [
          {
            ViewArn: `arn:aws:resource-explorer-2:${
              config.region
            }:${config.accountId()}:view/all-resources/2aabbe32-3381-40d0-bf90-fc1b668df0f3`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
