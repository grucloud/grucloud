const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("SESV2", async function () {
  it("ConfigurationSet", () =>
    pipe([
      () => ({
        groupType: "SESV2::ConfigurationSet",
        livesNotFound: ({ config }) => [
          {
            ConfigurationSetName: `c123`,
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
  it("DedicatedIpPool", () =>
    pipe([
      () => ({
        groupType: "SESV2::DedicatedIpPool",
        livesNotFound: ({ config }) => [
          {
            PoolName: `p123`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("EmailIdentity", () =>
    pipe([
      () => ({
        groupType: "SESV2::EmailIdentity",
        livesNotFound: ({ config }) => [
          {
            EmailIdentity: `pipo`,
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
