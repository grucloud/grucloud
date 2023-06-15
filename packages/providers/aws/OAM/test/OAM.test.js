const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("OAM", async function () {
  it("Link", () =>
    pipe([
      () => ({
        groupType: "OAM::Link",
        livesNotFound: ({ config }) => [
          {
            Identifier: `arn:${config.partition}:oam:${
              config.region
            }:${config.accountId()}:link/e4b6b5bd-74db-4776-9967-dc13aa3b2807`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Sink", () =>
    pipe([
      () => ({
        groupType: "OAM::Sink",
        livesNotFound: ({ config }) => [
          {
            Identifier: `arn:${config.partition}:oam:${
              config.region
            }:${config.accountId()}:sink/e4b6b5bd-74db-4776-9967-dc13aa3b2807`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("SinkPolicy", () =>
    pipe([
      () => ({
        groupType: "OAM::SinkPolicy",
        livesNotFound: ({ config }) => [
          {
            SinkIdentifier: `arn:${config.partition}:oam:${
              config.region
            }:${config.accountId()}:sink/e4b6b5bd-74db-4776-9967-dc13aa3b2807`,
          },
        ],
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
});
