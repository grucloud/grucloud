const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

let config = () => ({ region: "us-west-2" });

describe("DeviceFarm", async function () {
  it.skip("DevicePool", () =>
    pipe([
      () => ({
        config,
        groupType: "DeviceFarm::DevicePool",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("InstanceProfile", () =>
    pipe([
      () => ({
        config,
        groupType: "DeviceFarm::InstanceProfile",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("NetworkProfile", () =>
    pipe([
      () => ({
        config,
        groupType: "DeviceFarm::NetworkProfile",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Project", () =>
    pipe([
      () => ({
        config,
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
  it.skip("TestGridProject", () =>
    pipe([
      () => ({
        config,
        groupType: "DeviceFarm::TestGridProject",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:devicefarm:${
            //   config.region
            // }:${config.accountId()}:project:EXAMPLE-GUID-123-456`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("VPCEConfiguration", () =>
    pipe([
      () => ({
        config,
        groupType: "DeviceFarm::VPCEConfiguration",
        livesNotFound: ({ config }) => [
          {
            // arn: `arn:aws:devicefarm:${
            //   config.region
            // }:${config.accountId()}:project:EXAMPLE-GUID-123-456`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  //
});
