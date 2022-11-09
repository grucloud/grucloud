const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("CloudFront", async function () {
  it("Distribution", () =>
    pipe([
      () => ({
        groupType: "CloudFront::Distribution",
        livesNotFound: ({ config }) => [
          {
            Id: "A123456789",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("CachePolicy", () =>
    pipe([
      () => ({
        groupType: "CloudFront::CachePolicy",
        livesNotFound: ({ config }) => [
          {
            CachePolicy: { Id: "123" },
            ETag: "E123456",
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it.skip("Function", () =>
    pipe([
      () => ({
        groupType: "CloudFront::Function",
        livesNotFound: ({ config }) => [
          {
            Name: "a123",
            FunctionMetadata: { Stage: "123" },
            ETag: "ETVPDKIKX0DER",
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("OriginAccessIdentity", () =>
    pipe([
      () => ({
        groupType: "CloudFront::OriginAccessIdentity",
        livesNotFound: ({ config }) => [
          {
            ETag: "ETVPDKIKX0DER",
            CloudFrontOriginAccessIdentity: { Id: "a123s" },
          },
        ],
      }),
      awsResourceTest,
    ])());
});
