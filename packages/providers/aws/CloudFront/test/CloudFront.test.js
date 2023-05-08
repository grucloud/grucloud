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
            ETag: "E123456",
          },
        ],
        skipDelete: true,
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
  it("Function", () =>
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
        skipGetByName: true,
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
  it("MonitoringSubscription", () =>
    pipe([
      () => ({
        groupType: "CloudFront::MonitoringSubscription",
        livesNotFound: ({ config }) => [{ DistributionId: "d12345" }],
        skipGetById: true,
      }),
    ])());
  it("OriginAccessIdentity", () =>
    pipe([
      () => ({
        groupType: "CloudFront::OriginAccessIdentity",
        livesNotFound: ({ config }) => [
          {
            ETag: "ETVPDKIKX0DER",
            Id: "a123s",
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
  // CloudFront Real-Time Logs deprecated according to ChatGPT
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
