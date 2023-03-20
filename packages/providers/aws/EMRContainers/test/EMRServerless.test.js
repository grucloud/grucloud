const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("EMRContainers", async function () {
  it("VirtualCluster", () =>
    pipe([
      () => ({
        groupType: "EMRContainers::VirtualCluster",
        livesNotFound: ({ config }) => [
          {
            id: "123application12345",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
