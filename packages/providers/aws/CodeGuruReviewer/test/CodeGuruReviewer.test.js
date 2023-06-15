const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeGuruReviewer", async function () {
  it("RepositoryAssociation", () =>
    pipe([
      () => ({
        groupType: "CodeGuruReviewer::RepositoryAssociation",
        livesNotFound: ({ config }) => [
          {
            AssociationArn: `arn:${config.partition}:codeguru-reviewer:${
              config.region
            }:${config.accountId()}:association:3ff47938-9aff-4c64-99da-13a0ac87ab31`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
