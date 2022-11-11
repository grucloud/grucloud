const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("EMRServerless", async function () {
  it("Application", () =>
    pipe([
      () => ({
        groupType: "EMRServerless::Application",
        livesNotFound: ({ config }) => [
          {
            applicationId: "123application12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
