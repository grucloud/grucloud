const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("S3Control", async function () {
  it("AccessPoint", () =>
    pipe([
      () => ({
        groupType: "S3Control::AccessPoint",
        livesNotFound: ({ config }) => [
          { AccountId: config.accountId(), Name: "gc-n123" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("MultiRegionAccessPoint", () =>
    pipe([
      () => ({
        groupType: "S3Control::MultiRegionAccessPoint",
        livesNotFound: ({ config }) => [
          { AccountId: config.accountId(), Name: "gc-n123" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("ObjectLambdaAccessPoint", () =>
    pipe([
      () => ({
        groupType: "S3Control::ObjectLambdaAccessPoint",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PublicAccessBlock", () =>
    pipe([
      () => ({
        groupType: "S3Control::PublicAccessBlock",
        livesNotFound: ({ config }) => [{}],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it.skip("StorageLensConfiguration", () =>
    pipe([
      () => ({
        groupType: "S3Control::StorageLensConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
