const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DMS", async function () {
  it("Certificate", () =>
    pipe([
      () => ({
        groupType: "DMS::Certificate",
        livesNotFound: ({ config }) => [
          {
            CertificateArn: `arn:aws:dms:${
              config.region
            }:${config.accountId()}:cert:HDKU4NY5ETEZGOZZRMVURZALVJVWBSRJMUQHIIA`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Endpoint", () =>
    pipe([
      () => ({
        groupType: "DMS::Endpoint",
        livesNotFound: ({ config }) => [
          {
            EndpointArn: `arn:aws:dms:${
              config.region
            }:${config.accountId()}:endpoint:HDKU4NY5ETEZGOZZRMVURZALVJVWBSRJMUQHIIA`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("EventSubscription", () =>
    pipe([
      () => ({
        groupType: "DMS::EventSubscription",
        livesNotFound: ({ config }) => [{ SubscriptionName: "s123" }],
      }),
      awsResourceTest,
    ])());
  it("ReplicationInstance", () =>
    pipe([
      () => ({
        groupType: "DMS::ReplicationInstance",
        livesNotFound: ({ config }) => [
          {
            ReplicationInstanceArn: `arn:aws:dms:${
              config.region
            }:${config.accountId()}:rep:6UTDJGBOUS3VI3SUWA66XFJCJA`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ReplicationSubnetGroup", () =>
    pipe([
      () => ({
        groupType: "DMS::ReplicationSubnetGroup",
        livesNotFound: ({ config }) => [
          { ReplicationSubnetGroupIdentifier: "s123" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ReplicationTask", () =>
    pipe([
      () => ({
        groupType: "DMS::ReplicationTask",
        livesNotFound: ({ config }) => [
          {
            ReplicationTaskArn: `arn:aws:dms:${
              config.region
            }:${config.accountId()}:task:OEAMB3NXSTZ6LFYZFEPPBBXPYM`,
          },
        ],
      }),
      awsResourceTest,
    ])());
});
