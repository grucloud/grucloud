const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("Fis", async function () {
  it("ExperimentTemplate", () =>
    pipe([
      () => ({
        groupType: "Fis::ExperimentTemplate",
        livesNotFound: ({ config }) => [
          {
            id: "i1234",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
