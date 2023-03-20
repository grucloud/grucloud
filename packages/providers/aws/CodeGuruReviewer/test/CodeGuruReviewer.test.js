const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CodeGuruReviewer", async function () {
  it.skip("RepositoryAssociation", () =>
    pipe([
      () => ({
        groupType: "CodeGuruReviewer::RepositoryAssociation",
        livesNotFound: ({ config }) => [{ AssociationArn: "" }],
      }),
      awsResourceTest,
    ])());
});
