const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("XRay", async function () {
  it("EncryptionConfig", () =>
    pipe([
      () => ({
        groupType: "XRay::EncryptionConfig",
        livesNotFound: ({ config }) => [{}],
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("Group", () =>
    pipe([
      () => ({
        groupType: "XRay::Group",
        livesNotFound: ({ config }) => [
          {
            GroupARN: `arn:aws:xray:${
              config.region
            }:${config.accountId()}:group/idonotexist`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("SamplingRule", () =>
    pipe([
      () => ({
        groupType: "XRay::SamplingRule",
        livesNotFound: ({ config }) => [
          {
            RuleARN: `arn:aws:xray:${
              config.region
            }:${config.accountId()}:sampling-rule/idonotexist`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
