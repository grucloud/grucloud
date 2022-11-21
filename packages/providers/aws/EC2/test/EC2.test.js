const assert = require("assert");
const { pipe, tap } = require("rubico");

const { awsResourceTest } = require("../../AwsResourceTester");

describe("EC2", async function () {
  it("ClientVpnAuthorizationRule", () =>
    pipe([
      () => ({
        groupType: "EC2::ClientVpnAuthorizationRule",
        livesNotFound: ({ config }) => [
          {
            ClientVpnEndpointId: "cvpn-endpoint-087d9903708fd6756",
            TargetNetworkCidr: "10.0.0.0/16",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("ClientVpnEndpoint", () =>
    pipe([
      () => ({
        groupType: "EC2::ClientVpnEndpoint",
        livesNotFound: ({ config }) => [
          { ClientVpnEndpointId: "cvpn-endpoint-087d9903708fd6756" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ClientVpnTargetNetwork", () =>
    pipe([
      () => ({
        groupType: "EC2::ClientVpnTargetNetwork",
        livesNotFound: ({ config }) => [
          {
            ClientVpnEndpointId: "cvpn-endpoint-087d9903708fd6756",
            AssociationId: "a-b80a4ff5123",
          },
        ],
      }),
      awsResourceTest,
    ])());
  it("CustomerGateway", () =>
    pipe([
      () => ({
        groupType: "EC2::CustomerGateway",
        livesNotFound: ({ config }) => [
          { CustomerGatewayId: "cgw-032cb2c8350925850" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DhcpOptions", () =>
    pipe([
      () => ({
        groupType: "EC2::DhcpOptions",
        livesNotFound: ({ config }) => [
          { DhcpOptionsId: "dopt-036a6462c18e0cce1" },
        ],
      }),
      awsResourceTest,
    ])());
  it("DhcpOptionsAssociation", () =>
    pipe([
      () => ({
        groupType: "EC2::DhcpOptionsAssociation",
        livesNotFound: ({ config }) => [
          { DhcpOptionsId: "dopt-036a6462c18e0cce1", VpcId: "vpc-123456" },
        ],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("EgressOnlyInternetGateway", () =>
    pipe([
      () => ({
        groupType: "EC2::EgressOnlyInternetGateway",
        livesNotFound: ({ config }) => [
          { EgressOnlyInternetGatewayId: "eigw-0214d5aba979cedf1" },
        ],
      }),
      awsResourceTest,
    ])());
  it("FlowLogs", () =>
    pipe([
      () => ({
        groupType: "EC2::FlowLogs",
        livesNotFound: ({ config }) => [{ FlowLogId: "fl-0c95e8a96eb84d765" }],
      }),
      awsResourceTest,
    ])());
  it("InternetGateway", () =>
    pipe([
      () => ({
        groupType: "EC2::InternetGateway",
        livesNotFound: ({ config }) => [
          { InternetGatewayId: "igw-06da9cc02b522921c" },
        ],
      }),
      awsResourceTest,
    ])());
  it("InternetGatewayAttachment", () =>
    pipe([
      () => ({
        groupType: "EC2::InternetGatewayAttachment",
        livesNotFound: ({ config }) => [
          { InternetGatewayId: "igw-06da9cc02b522924c" },
        ],
        skipDelete: true,
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("Ipam", () =>
    pipe([
      () => ({
        groupType: "EC2::Ipam",
        livesNotFound: ({ config }) => [{ IpamId: "ipam-xxxxxxxxxxxxxxxxx" }],
      }),
      awsResourceTest,
    ])());
  it("IpamScope", () =>
    pipe([
      () => ({
        groupType: "EC2::IpamScope",
        livesNotFound: ({ config }) => [
          { IpamScopeId: "ipam-scope-xxxxxxxxxxxxxxxxx" },
        ],
      }),
      awsResourceTest,
    ])());
  it("IpamPool", () =>
    pipe([
      () => ({
        groupType: "EC2::IpamPool",
        livesNotFound: ({ config }) => [
          { IpamPoolId: "ipam-pool-xxxxxxxxxxxxxxxxx" },
        ],
      }),
      awsResourceTest,
    ])());
  it("IpamPoolCidr", () =>
    pipe([
      () => ({
        groupType: "EC2::IpamPoolCidr",
        livesNotFound: ({ config }) => [
          { IpamPoolId: "ipam-pool-xxxxxxxxxxxxxxxxx", Cidr: "10.0.0.0/24" },
        ],
      }),
      awsResourceTest,
    ])());
  it("KeyPair", () =>
    pipe([
      () => ({
        groupType: "EC2::KeyPair",
        livesNotFound: ({ config }) => [{ KeyName: "my-key" }],
      }),
      awsResourceTest,
    ])());

  it("ElasticIpAddress", () =>
    pipe([
      () => ({
        groupType: "EC2::ElasticIpAddress",
        livesNotFound: ({ config }) => [
          { AllocationId: "eipalloc-0017fa73b3a36997a" },
        ],
      }),
      awsResourceTest,
    ])());
  it("ElasticIpAddressAssociation", () =>
    pipe([
      () => ({
        groupType: "EC2::ElasticIpAddressAssociation",
        livesNotFound: ({ config }) => [
          { AssociationId: "eipassoc-0e9608c55c1ca711e" },
        ],
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("Instance", () =>
    pipe([
      () => ({
        groupType: "EC2::Instance",
        livesNotFound: ({ config }) => [{ InstanceId: "i-0e85b55470b03b863" }],
      }),
      awsResourceTest,
    ])());
  it("LaunchTemplate", () =>
    pipe([
      () => ({
        groupType: "EC2::LaunchTemplate",
        livesNotFound: ({ config }) => [{ LaunchTemplateId: "lt-12345" }],
      }),
      awsResourceTest,
    ])());
  it("NetworkAcl", () =>
    pipe([
      () => ({
        groupType: "EC2::NetworkAcl",
        livesNotFound: ({ config }) => [{}],
        //TODO
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("NetworkInterface", () =>
    pipe([
      () => ({
        groupType: "EC2::NetworkInterface",
        //livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("NatGateway", () =>
    pipe([
      () => ({
        groupType: "EC2::NatGateway",
        livesNotFound: ({ config }) => [
          { NatGatewayId: "nat-0ceb4fc535e8d1872" },
        ],
      }),
      awsResourceTest,
    ])());

  it("ManagedPrefixList", () =>
    pipe([
      () => ({
        groupType: "EC2::ManagedPrefixList",
        livesNotFound: ({ config }) => [{ PrefixListId: "pl-63a5400b" }],
      }),
      awsResourceTest,
    ])());
  it("PlacementGroup", () =>
    pipe([
      () => ({
        groupType: "EC2::PlacementGroup",
        livesNotFound: ({ config }) => [{ GroupName: "a-123" }],
      }),
      awsResourceTest,
    ])());
  it("RouteTable", () =>
    pipe([
      () => ({
        groupType: "EC2::RouteTable",
        livesNotFound: ({ config }) => [
          { RouteTableId: "rtb-032cb2c8350925850" },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("RouteTableAssociation", () =>
    pipe([
      () => ({
        groupType: "EC2::RouteTableAssociation",
        livesNotFound: ({ config }) => [
          { RouteTableAssociationId: "rtbassoc-04770dad06db7240a" },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("Route", () =>
    pipe([
      () => ({
        groupType: "EC2::Route",
        livesNotFound: ({ config }) => [
          { RouteTableId: "rtb-12345", DestinationCidrBlock: "0.0.0.0/0" },
        ],
      }),
      awsResourceTest,
    ])());
  it("Subnet", () =>
    pipe([
      () => ({
        groupType: "EC2::Subnet",
        livesNotFound: ({ config }) => [
          { SubnetId: "subnet-05a750592a3c77058" },
        ],
      }),
      awsResourceTest,
    ])());
  it("SecurityGroup", () =>
    pipe([
      () => ({
        groupType: "EC2::SecurityGroup",
        livesNotFound: ({ config }) => [{ GroupId: "sg-06ff67cc5474ec7c7" }],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("SecurityGroupRuleIngress", () =>
    pipe([
      () => ({
        groupType: "EC2::SecurityGroupRuleIngress",
        livesNotFound: ({ config }) => [{ GroupId: "sg-06ff67cc5474ec7c7" }],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("SecurityGroupRuleEgress", () =>
    pipe([
      () => ({
        groupType: "EC2::SecurityGroupRuleEgress",
        livesNotFound: ({ config }) => [
          {
            GroupId: "sg-06ff67cc5474ec7c7",
            FromPort: 80,
            IpProtocol: "tcp",
            ToPort: 80,
          },
        ],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("TransitGateway", () =>
    pipe([
      () => ({
        groupType: "EC2::TransitGateway",
        livesNotFound: ({ config }) => [
          { TransitGatewayId: "tgw-032cb2c8350925850" },
        ],
      }),
      awsResourceTest,
    ])());
  it("TransitGatewayRoute", () =>
    pipe([
      () => ({
        groupType: "EC2::TransitGatewayRoute",
        livesNotFound: ({ config }) => [
          {
            DestinationCidrBlock: "0.0.0.0/24",
            TransitGatewayRouteTableId: "tgw-rtb-032cb2c8350925850",
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("TransitGatewayRouteTable", () =>
    pipe([
      () => ({
        groupType: "EC2::TransitGatewayRouteTable",
        livesNotFound: ({ config }) => [
          { TransitGatewayRouteTableId: "tgw-rtb-032cb2c8350925850" },
        ],
      }),
      awsResourceTest,
    ])());
  it("TransitGatewayPeeringAttachment", () =>
    pipe([
      () => ({
        groupType: "EC2::TransitGatewayPeeringAttachment",
        livesNotFound: ({ config }) => [
          { TransitGatewayAttachmentId: "tgw-attach-0c9df0b7bb2d2ca81" },
        ],
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it("TransitGatewayAttachment", () =>
    pipe([
      () => ({
        groupType: "EC2::TransitGatewayAttachment",
        livesNotFound: ({ config }) => [{}],
        skipGetById: true,
        skipGetByName: true,
        skipDelete: true,
      }),
      awsResourceTest,
    ])());
  it("TransitGatewayVpcAttachment", () =>
    pipe([
      () => ({
        groupType: "EC2::TransitGatewayVpcAttachment",
        livesNotFound: ({ config }) => [
          { TransitGatewayAttachmentId: "tgw-attach-032cb2c8350925850" },
        ],
      }),
      awsResourceTest,
    ])());
  it("TransitGatewayRouteTableAssociation", () =>
    pipe([
      () => ({
        groupType: "EC2::TransitGatewayRouteTableAssociation",
        livesNotFound: ({ config }) => [
          {
            TransitGatewayAttachmentId: "tgw-attach-0c9df0b7bb2d2ca81",
            TransitGatewayRouteTableId: "tgw-rtb-0b82f57d1cfead30a",
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("TransitGatewayRouteTablePropagation", () =>
    pipe([
      () => ({
        groupType: "EC2::TransitGatewayRouteTablePropagation",
        livesNotFound: ({ config }) => [
          {
            TransitGatewayAttachmentId: "tgw-attach-0c9df0b7bb2d2ca81",
            TransitGatewayRouteTableId: "tgw-rtb-0b82f57d1cfead30a",
          },
        ],
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
  it("Volume", () =>
    pipe([
      () => ({
        groupType: "EC2::Volume",
        livesNotFound: ({ config }) => [{ VolumeId: "vol-035a2aa7c23edd8e0" }],
      }),
      awsResourceTest,
    ])());
  it("VolumeAttachment", () =>
    pipe([
      () => ({
        groupType: "EC2::VolumeAttachment",
        livesNotFound: ({ config }) => [{ VolumeId: "vol-035a2aa7c23edd8e0" }],
      }),
      awsResourceTest,
    ])());
  it("Vpc", () =>
    pipe([
      () => ({
        groupType: "EC2::Vpc",
        livesNotFound: ({ config }) => [{ VpcId: "vpc-08744497940acc9c5" }],
      }),
      awsResourceTest,
    ])());
  it("VpcEndpoint", () =>
    pipe([
      () => ({
        groupType: "EC2::VpcEndpoint",
        livesNotFound: ({ config }) => [
          { VpcEndpointId: "vpce-0ceb4fc535e8d1872" },
        ],
      }),
      awsResourceTest,
    ])());
  it.skip("VpcIpv4CidrBlockAssociation", () =>
    pipe([
      () => ({
        groupType: "EC2::VpcIpv4CidrBlockAssociation",
        livesNotFound: ({ config }) => [{}],
      }),
      awsResourceTest,
    ])());

  it("VpcPeeringConnection", () =>
    pipe([
      () => ({
        groupType: "EC2::VpcPeeringConnection",
        livesNotFound: ({ config }) => [
          { VpcPeeringConnectionId: "pcx-032cb2c8350925850" },
        ],
      }),
      awsResourceTest,
    ])());
  it("VpcPeeringConnectionAccepter", () =>
    pipe([
      () => ({
        groupType: "EC2::VpcPeeringConnectionAccepter",
        livesNotFound: ({ config }) => [{}],
        skipDelete: true,
        skipGetById: true,
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("VpnConnection", () =>
    pipe([
      () => ({
        groupType: "EC2::VpnConnection",
        livesNotFound: ({ config }) => [
          { VpnConnectionId: "vgw-032cb2c8350925850" },
        ],
      }),
      awsResourceTest,
    ])());
  it("VpnConnectionRoute", () =>
    pipe([
      () => ({
        groupType: "EC2::VpnConnectionRoute",
        livesNotFound: ({ config }) => [
          {
            VpnConnectionId: "vgw-032cb2c8350925850",
            DestinationCidrBlock: "192.168.0.0/24",
          },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("VpnGateway", () =>
    pipe([
      () => ({
        groupType: "EC2::VpnGateway",
        livesNotFound: ({ config }) => [
          { VpnGatewayId: "cgw-032cb2c8350925850" },
        ],
      }),
      awsResourceTest,
    ])());
  it("VpnGatewayAttachment", () =>
    pipe([
      () => ({
        groupType: "EC2::VpnGatewayAttachment",
        livesNotFound: ({ config }) => [
          { VpcId: "vpc-123456", VpnGatewayId: "vpn-032cb2c8350925850" },
        ],
        skipGetByName: true,
      }),
      awsResourceTest,
    ])());
  it("VpnGatewayRoutePropagation", () =>
    pipe([
      () => ({
        groupType: "EC2::VpnGatewayRoutePropagation",
        livesNotFound: ({ config }) => [
          { RouteTableId: "rtb-123456", GatewayId: "vgw-032cb2c8350925850" },
        ],
        skipGetByName: true,
        skipGetById: true,
      }),
      awsResourceTest,
    ])());
});
