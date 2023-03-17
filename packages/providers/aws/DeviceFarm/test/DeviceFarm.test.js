const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DeviceFarm", async function () {
  it.skip("Project", () =>
    pipe([
      () => ({
        groupType: "DeviceFarm::Project",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:devicefarm:${
              config.region
            }:${config.accountId()}:project:EXAMPLE-GUID-123-456`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
