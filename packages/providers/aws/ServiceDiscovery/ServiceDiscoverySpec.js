const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { compareAws } = require("../AwsCommon");

const { createAwsService } = require("../AwsService");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ServiceDiscovery.html

const {
  ServiceDiscoveryHttpNamespace,
} = require("./ServiceDiscoveryHttpNamespace");
const { ServiceDiscoveryInstance } = require("./ServiceDiscoveryInstance");
const {
  ServiceDiscoveryPrivateDnsNamespace,
} = require("./ServiceDiscoveryPrivateDnsNamespace");
const {
  ServiceDiscoveryPublicDnsNamespace,
} = require("./ServiceDiscoveryPublicDnsNamespace");
const { ServiceDiscoveryService } = require("./ServiceDiscoveryService");

const GROUP = "ServiceDiscovery";

const compare = compareAws({});

module.exports = pipe([
  () => [
    //
    ServiceDiscoveryHttpNamespace({ compare }),
    ServiceDiscoveryInstance({ compare }),
    ServiceDiscoveryPrivateDnsNamespace({ compare }),
    ServiceDiscoveryPublicDnsNamespace({ compare }),
    ServiceDiscoveryService({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
      }),
    ])
  ),
]);
