const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("EMR", async function () {
  it("BlockPublicAccessConfiguration", () =>
    pipe([
      () => ({
        groupType: "EMR::BlockPublicAccessConfiguration",
        livesNotFound: ({ config }) => [{}],
        skipGetByName: true,
        skipGetById: true,
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it("Cluster", () =>
    pipe([
      () => ({
        groupType: "EMR::Cluster",
        livesNotFound: ({ config }) => [
          {
            ClusterId: "j-O4K5N4IU33KA",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Studio", () =>
    pipe([
      () => ({
        groupType: "EMR::Studio",
        livesNotFound: ({ config }) => [
          { StudioId: "es-1BRET96W6U5IYNMN4LZ0D6OA1" },
        ],
      }),
      awsResourceTest,
    ])());
  it("StudioSessionMapping", () =>
    pipe([
      () => ({
        groupType: "EMR::StudioSessionMapping",
        livesNotFound: ({ config }) => [
          {
            StudioId: "es-1BRET96W6U5IYNMN4LZ0D6OA1",
            SessionPolicyArn:
              "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole",
            IdentityType: "USER",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
