const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("StorageGateway", async function () {
  it("Cache", () =>
    pipe([
      () => ({
        groupType: "StorageGateway::Cache",
        livesNotFound: ({ config }) => [
          {
            GatewayARN: `arn:aws:storagegateway:${
              config.region
            }:${config.accountId()}:gateway/sgw-12A3456B`,
          },
        ],
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it("Gateway", () =>
    pipe([
      () => ({
        groupType: "StorageGateway::Gateway",
        livesNotFound: ({ config }) => [
          {
            GatewayARN: `arn:aws:storagegateway:${
              config.region
            }:${config.accountId()}:gateway/sgw-12A3456B`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TapePool", () =>
    pipe([
      () => ({
        groupType: "StorageGateway::TapePool",
        livesNotFound: ({ config }) => [
          {
            PoolARN: `arn:aws:storagegateway:${
              config.region
            }:${config.accountId()}:gateway/sgw-12A3456B/tapepool/tp-1122AABB`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Volume", () =>
    pipe([
      () => ({
        groupType: "StorageGateway::Volume",
        livesNotFound: ({ config }) => [
          {
            VolumeARN: `arn:aws:storagegateway:${
              config.region
            }:${config.accountId()}:gateway/sgw-12A3456B/volume/vol-1122AABB`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
