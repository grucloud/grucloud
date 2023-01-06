const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("S3Control", async function () {
  it.skip("AccessPoint", () =>
    pipe([
      () => ({
        groupType: "S3Control::AccessPoint",
        livesNotFound: ({ config }) => [{ Name: "d123" }],
      }),
      awsResourceTest,
    ])());
  it.skip("MultiRegionAccessPoint", () =>
    pipe([
      () => ({
        groupType: "S3Control::MultiRegionAccessPoint",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("StorageLensConfiguration", () =>
    pipe([
      () => ({
        groupType: "S3Control::StorageLensConfiguration",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
