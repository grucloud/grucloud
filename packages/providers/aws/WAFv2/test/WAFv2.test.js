const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("WAFv2", async function () {
  it("IPSet", () =>
    pipe([
      () => ({
        groupType: "WAFv2::IPSet",
        livesNotFound: ({ config }) => [
          {
            Id: "6041b115-b84b-47db-b0ca-47039e3b5279",
            LockToken: "57768011-a86a-4f07-b145-5767ec55d963",
            Name: "sss",
            Scope: "REGIONAL",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("RegexPatternSet", () =>
    pipe([
      () => ({
        groupType: "WAFv2::RegexPatternSet",
        livesNotFound: ({ config }) => [
          {
            Id: "6041b115-b84b-47db-b0ca-47039e3b5279",
            LockToken: "57768011-a86a-4f07-b145-5767ec55d963",
            Name: "sss",
            Scope: "REGIONAL",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("WebACL", () =>
    pipe([
      () => ({
        groupType: "WAFv2::WebACL",
        livesNotFound: ({ config }) => [
          {
            Id: "6041b115-b84b-47db-b0ca-47039e3b5279",
            LockToken: "57768011-a86a-4f07-b145-5767ec55d963",
            Name: "sss",
            Scope: "REGIONAL",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("WebACLCloudFront", () =>
    pipe([
      () => ({
        groupType: "WAFv2::WebACLCloudFront",
        livesNotFound: ({ config }) => [
          {
            Id: "6041b115-b84b-47db-b0ca-47039e3b5279",
            LockToken: "57768011-a86a-4f07-b145-5767ec55d963",
            Name: "sss",
            Scope: "CLOUDFRONT",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("WebACLAssociation", () =>
    pipe([
      () => ({
        groupType: "WAFv2::WebACLAssociation",
        livesNotFound: ({ config }) => [
          {
            ResourceArn: `arn:aws:apigateway:${config.region}::/restapis/j9zcm72xm6/stages/dev`,
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("LoggingConfiguration", () =>
    pipe([
      () => ({
        groupType: "WAFv2::LoggingConfiguration",
        livesNotFound: ({ config }) => [
          {
            ResourceArn: `arn:aws:wafv2:${
              config.region
            }:${config.accountId()}:regional/webacl/my-webacl/ce01e085-5737-4092-80c3-224fd26843ed`,
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
