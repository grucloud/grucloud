const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SESV2", async function () {
  it.skip("ConfigurationSet", () =>
    pipe([
      () => ({
        groupType: "SESV2::XXX",
        livesNotFound: ({ config }) => [
          {
            Arn: ``,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("DedicatedIpAssignment", () =>
    pipe([
      () => ({
        groupType: "SESV2::DedicatedIpAssignment",
        livesNotFound: ({ config }) => [
          {
            Arn: ``,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("DedicatedIpPool", () =>
    pipe([
      () => ({
        groupType: "SESV2::DedicatedIpPool",
        livesNotFound: ({ config }) => [
          {
            Arn: ``,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("EmailIdentity", () =>
    pipe([
      () => ({
        groupType: "SESV2::EmailIdentity",
        livesNotFound: ({ config }) => [
          {
            Arn: ``,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("IdentityFeedbackAttributes", () =>
    pipe([
      () => ({
        groupType: "SESV2::IdentityFeedbackAttributes",
        livesNotFound: ({ config }) => [
          {
            Arn: ``,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
