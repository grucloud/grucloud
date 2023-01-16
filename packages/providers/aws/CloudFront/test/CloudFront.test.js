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
  it("CachePolicy", () =>
    pipe([
      () => ({
        groupType: "CloudFront::CachePolicy",
        livesNotFound: ({ config }) => [
          {
            Id: "123",
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
  it("KeyGroup", () =>
    pipe([
      () => ({
        groupType: "CloudFront::KeyGroup",
        livesNotFound: ({ config }) => [{ Id: "123", ETag: "E123456" }],
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
  it("OriginRequestPolicy", () =>
    pipe([
      () => ({
        groupType: "CloudFront::OriginRequestPolicy",
        livesNotFound: ({ config }) => [
          {
            Id: "123",
            ETag: "E123456",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("PublicKey", () =>
    pipe([
      () => ({
        groupType: "CloudFront::PublicKey",
        livesNotFound: ({ config }) => [{ Id: "123", ETag: "E123456" }],
      }),
      awsResourceTest,
    ])());
  it("ResponseHeadersPolicy", () =>
    pipe([
      () => ({
        groupType: "CloudFront::ResponseHeadersPolicy",
        livesNotFound: ({ config }) => [
          {
            Id: "123",
            ETag: "E123456",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
