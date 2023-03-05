const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Synthetics", async function () {
  it("Canary", () =>
    pipe([
      () => ({
        groupType: "Synthetics::Canary",
        livesNotFound: ({ config }) => [
          {
            Name: "c123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Group", () =>
    pipe([
      () => ({
        groupType: "Synthetics::Group",
        livesNotFound: ({ config }) => [
          {
            Id: "22",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
