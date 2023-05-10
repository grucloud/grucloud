const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("LakeFormation", async function () {
  it("DataLakeSettings", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::DataLakeSettings",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("LFTag", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::LFTag",
        livesNotFound: ({ config }) => [{ TagKey: "toto" }],
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
  it("Resource", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::Resource",
        livesNotFound: ({ config }) => [
          { ResourceArn: "arn:aws:s3:::gcpaperino" },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("ResourceLFTags", () =>
    pipe([
      () => ({
        groupType: "LakeFormation::ResourceLFTags",
        livesNotFound: ({ config }) => [
          {
            LFTags: [
              {
                TagKey: "STRING_VALUE",
                TagValues: ["STRING_VALUE"],
              },
            ],
            Resource: {
              Database: {
                Name: "d1234",
              },
            },
          },
        ],
      }),
      awsResourceTest,
    ])());
});
