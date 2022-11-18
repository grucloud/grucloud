const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DirectConnect.html

//const { DirectConnectBgpPeer } = require("./DirectConnectBgpPeer");
//const { DirectConnectConnection} = require("./DirectConnectConnection");
//const { DirectConnectConnectionAssociation } = require("./DirectConnectConnectionAssociation");
//const { DirectConnectConnectionConfirmation } = require("./DirectConnectConnectionConfirmation");
//const { DirectConnectGateway} = require("./DirectConnectGateway");
//const { DirectConnectGatewayAssociation } = require("./DirectConnectGatewayAssociation");
//const { DirectConnectGatewayAssociationProposal } = require("./DirectConnectGatewayAssociationProposal");
//const { DirectConnectHostedConnection } = require("./DirectConnectHostedConnection");
//const { DirectConnectHostedPrivateVirtualInterface } = require("./DirectConnectHostedPrivateVirtualInterface");
//const { DirectConnectHostedPrivateVirtualInterfaceAccepter } = require("./DirectConnectHostedPrivateVirtualInterfaceAccepter");
//const { DirectConnectHostedPublicVirtualInterface } = require("./DirectConnectHostedPublicVirtualInterface");
//const { DirectConnectHostedPublicVirtualInterfaceAccepter } = require("./DirectConnectHostedPublicVirtualInterfaceAccepter");
//const { DirectConnectHostedTransitVirtualInterface } = require("./DirectConnectHostedTransitVirtualInterface");
//const { DirectConnectHostedTransitVirtualInterfaceAccepter } = require("./DirectConnectHostedTransitVirtualInterfaceAccepter");
//const { DirectConnectLag } = require("./DirectConnectLag");
//const { DirectConnectPrivateVirtualInterface } = require("./DirectConnectPrivateVirtualInterface");
//const { DirectConnectPublicVirtualInterface } = require("./DirectConnectPublicVirtualInterface");
//const { DirectConnectTransitVirtualInterface } = require("./DirectConnectTransitVirtualInterface");

const GROUP = "DirectConnect";
const tagsKey = "tag";
const compare = compareAws({ tagsKey, key: "key" });

module.exports = pipe([
  () => [
    // DirectConnectBgpPeer({})
    // DirectConnectConnection({})
    // DirectConnectConnectionAssociation({})
    // DirectConnectConnectionConfirmation({})
    // DirectConnectGateway({})
    // DirectConnectGatewayAssociation({})
    // DirectConnectGatewayConfirmation({})
    // DirectConnectGatewayAssociationProposal({})
    // DirectConnectHostedConnection({})
    // DirectConnectHostedPrivateVirtualInterface({})
    // DirectConnectHostedPrivateVirtualInterfaceAccepter({})
    // DirectConnectHostedPublicVirtualInterface({})
    // DirectConnectHostedPublicVirtualInterfaceAccepter({})
    // DirectConnectHostedTransitVirtualInterface({})
    // DirectConnectHostedTransitVirtualInterfaceAccepter({})
    // DirectConnectLag({})
    // DirectConnectPrivateVirtualInterface({})
    // DirectConnectPublicVirtualInterface({})
    // DirectConnectTransitVirtualInterface({})
  ],
  map(createAwsService),
  map(
    defaultsDeep({
      group: GROUP,
      tagsKey,
      compare: compare({}),
    })
  ),
]);
