const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DirectConnect", async function () {
  it("BgpPeer", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::BGPPeer",
        livesNotFound: ({ config }) => [
          {
            asn: 65432,
            bgpPeerId: "b1234",
            customerAddress: "10.0.0.1",
            virtualInterfaceId: "dxvif-ffvpcwkq",
          },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("Connection", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::Connection",
        livesNotFound: ({ config }) => [{ connectionId: "dxcon-ffabc123" }],
      }),
      awsResourceTest,
    ])());
  it("ConnectionAssociation", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::ConnectionAssociation",
        livesNotFound: ({ config }) => [
          { connectionId: "dxcon-ffabc123", lagId: "dxlag-fg02ox79" },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it.skip("ConnectionConfirmation", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::ConnectionConfirmation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Gateway", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::Gateway",
        livesNotFound: ({ config }) => [
          { directConnectGatewayId: "f73c8c46-8288-4464-8c22-cda54e212db8" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("GatewayAssociation", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::GatewayAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("GatewayAssociationProposal", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::GatewayAssociationProposal",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("HostedConnection", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::HostedConnection",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("HostedPrivateVirtualInterface", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::HostedPrivateVirtualInterface",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("HostedPrivateVirtualInterfaceAccepter", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::HostedPrivateVirtualInterfaceAccepter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("HostedPublicVirtualInterface", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::HostedPublicVirtualInterface",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("HostedPublicVirtualInterfaceAccepter", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::HostedPublicVirtualInterfaceAccepter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("HostedTransitVirtualInterface", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::HostedTransitVirtualInterface",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("HostedTransitVirtualInterfaceAccepter", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::HostedTransitVirtualInterfaceAccepter",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it("Lag", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::Lag",
        livesNotFound: ({ config }) => [{ lagId: "dxlag-fg02ox79" }],
      }),
      awsResourceTest,
    ])());
  it("MacSecKeyAssociation", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::MacSecKeyAssociation",
        livesNotFound: ({ config }) => [
          {
            connectionId: "dxcon-ffabc123",
            secretARN: `arn:${config.partition}:secretsmanager:${
              config.region
            }:${config.accountId()}:secret:demordsservice-demostage-credentials-G7IcAQ`,
          },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("VirtualInterface", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::VirtualInterface",
        livesNotFound: ({ config }) => [
          { virtualInterfaceId: "dxvif-ffvpcwkq" },
        ],
      }),
      awsResourceTest,
    ])());
});
