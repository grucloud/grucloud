const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("DirectConnect", async function () {
  it.skip("BgpPeer", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::BgpPeer",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("Connection", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::Connection",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("ConnectionAssociation", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::ConnectionAssociation",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("Gateway", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::Gateway",
        livesNotFound: ({ config }) => [{}],
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
  it.skip("Lag", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::Lag",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PrivateVirtualInterface", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::PrivateVirtualInterface",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PublicVirtualInterface", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::PublicVirtualInterface",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
  it.skip("PublicTransitInterface", () =>
    pipe([
      () => ({
        groupType: "DirectConnect::PublicTransitInterface",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());
});
