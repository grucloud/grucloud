const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

let config = () => ({ region: "us-west-2" });

describe("NetworkManager", async function () {
  it("CoreNetwork", () =>
    pipe([
      () => ({
        config,
        groupType: "NetworkManager::CoreNetwork",
        livesNotFound: ({ config }) => [
          {
            CoreNetworkId: "core-network-123456789",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Device", () =>
    pipe([
      () => ({
        config,
        groupType: "NetworkManager::Device",
        livesNotFound: ({ config }) => [
          {
            GlobalNetworkId: "global-network-004d81c3933d7e5a1",
            SiteId: "site-0d621fa7de7691161",
            DeviceId: "device-0d621fa7de7691161",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("GlobalNetwork", () =>
    pipe([
      () => ({
        config,
        groupType: "NetworkManager::GlobalNetwork",
        livesNotFound: ({ config }) => [
          {
            GlobalNetworkId: "a-123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Link", () =>
    pipe([
      () => ({
        config,
        groupType: "NetworkManager::Link",
        livesNotFound: ({ config }) => [
          {
            GlobalNetworkId: "global-network-004d81c3933d7e5a1",
            SiteId: "site-0d621fa7de7691161",
            LinkId: "device-0d621fa7de7691161",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("TransitGatewayRegistration", () =>
    pipe([
      () => ({
        config,
        groupType: "NetworkManager::TransitGatewayRegistration",
        livesNotFound: ({ config }) => [
          {
            GlobalNetworkId: "global-network-004d81c3933d7e5a1",
            TransitGatewayArn: `arn:aws:ec2:us-west-2:${config.accountId()}:transit-gateway/tgw-0ddc701209bc2fe6f`,
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("Site", () =>
    pipe([
      () => ({
        config,
        groupType: "NetworkManager::Site",
        livesNotFound: ({ config }) => [
          {
            GlobalNetworkId: "global-network-004d81c3933d7e5a1",
            SiteId: "site-0d621fa7de7691161",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("VpcAttachment", () =>
    pipe([
      () => ({
        config,
        groupType: "NetworkManager::VpcAttachment",
        livesNotFound: ({ config }) => [
          {
            AttachmentId: "attachment-01484f6f707aacf96",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("SiteToSiteVpnAttachment", () =>
    pipe([
      () => ({
        config,
        groupType: "NetworkManager::SiteToSiteVpnAttachment",
        livesNotFound: ({ config }) => [
          {
            AttachmentId: "attachment-01484f6f707aacf96",
          },
        ],
      }),
      awsResourceTest,
    ])());
});
