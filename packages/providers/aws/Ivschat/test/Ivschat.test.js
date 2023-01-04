const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe.skip("IvschatRoom", async function () {
  it("LoggingConfiguration", () =>
    pipe([
      () => ({
        groupType: "Ivschat::LoggingConfiguration",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:ivschat:${
              config.region
            }:${config.accountId()}:logging-configuration/y47bQ0MmtKmd`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Room", () =>
    pipe([
      () => ({
        groupType: "Ivschat::Room",
        livesNotFound: ({ config }) => [
          {
            arn: `arn:aws:ivschat:${
              config.region
            }:${config.accountId()}:room/32no4tl70Fmr`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
