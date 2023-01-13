const assert = require("assert");
const { pipe, map, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const {
  NetworkManagerGlobalNetwork,
} = require("./NetworkManagerGlobalNetwork");
const { NetworkManagerCoreNetwork } = require("./NetworkManagerCoreNetwork");
const {
  NetworkManagerTransitGatewayRegistration,
} = require("./NetworkManagerTransitGatewayRegistration");
const { NetworkManagerSite } = require("./NetworkManagerSite");
const {
  NetworkManagerSiteToSiteVpnAttachment,
} = require("./NetworkManagerSiteToSiteVpnAttachment");

const { NetworkManagerDevice } = require("./NetworkManagerDevice");
const { NetworkManagerLink } = require("./NetworkManagerLink");
const {
  NetworkManagerVpcAttachment,
} = require("./NetworkManagerVpcAttachment");

const GROUP = "NetworkManager";
const compareNetworkManager = compareAws({});

module.exports = pipe([
  () => [
    NetworkManagerCoreNetwork({}),
    NetworkManagerDevice({}),
    NetworkManagerGlobalNetwork({}),
    NetworkManagerLink({}),
    NetworkManagerSite({}),
    NetworkManagerSiteToSiteVpnAttachment({}),
    NetworkManagerTransitGatewayRegistration({}),
    NetworkManagerVpcAttachment({}),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compareNetworkManager({}),
      }),
    ])
  ),
]);
