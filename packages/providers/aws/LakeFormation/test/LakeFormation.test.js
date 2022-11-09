const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("LakeFormation", async function () {
  it.skip("DataLakeSettings", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::DataLakeSettings",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("LfTags", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::LfTags",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Permissions", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::Permissions",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Resource", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::Resource",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ResourceIfTags", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::ResourceIfTags",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
