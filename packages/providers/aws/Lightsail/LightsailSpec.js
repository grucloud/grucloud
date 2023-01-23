const assert = require("assert");
const { tap, pipe, map, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { compareAws } = require("../AwsCommon");
const { createAwsService } = require("../AwsService");

const GROUP = "Lightsail";

const tagsKey = "tags";
const compare = compareAws({ tagsKey, key: "key" });
const { LightsailBucket } = require("./LightsailBucket");

const { LightsailCertificate } = require("./LightsailCertificate");
const { LightsailContainerService } = require("./LightsailContainerService");
const { LightsailDatabase } = require("./LightsailDatabase");
const { LightsailDisk } = require("./LightsailDisk");
const { LightsailDiskAttachment } = require("./LightsailDiskAttachment");
const { LightsailDomain } = require("./LightsailDomain");
const { LightsailInstance } = require("./LightsailInstance");
const {
  LightsailInstancePublicPorts,
} = require("./LightsailInstancePublicPorts");

const { LightsailKeyPair } = require("./LightsailKeyPair");
const { LightsailLoadBalancer } = require("./LightsailLoadBalancer");
const {
  LightsailLoadBalancerCertificate,
} = require("./LightsailLoadBalancerCertificate");
const {
  LightsailLoadBalancerCertificateAttachment,
} = require("./LightsailLoadBalancerCertificateAttachment");

const {
  LightsailLoadBalancerAttachment,
} = require("./LightsailLoadBalancerAttachment");

const { LightsailStaticIp } = require("./LightsailStaticIp");
const {
  LightsailStaticIpAttachment,
} = require("./LightsailStaticIpAttachment");

module.exports = pipe([
  () => [
    LightsailBucket({}),
    LightsailCertificate({ compare }),
    LightsailContainerService({ compare }),
    LightsailDatabase({ compare }),
    LightsailDisk({ compare }),
    LightsailDiskAttachment({ compare }),
    //LightsailDomain({ compare }),
    LightsailInstance({ compare }),
    LightsailInstancePublicPorts({ compare }),
    LightsailKeyPair({ compare }),
    LightsailLoadBalancer(),
    LightsailLoadBalancerAttachment({ compare }),
    LightsailLoadBalancerCertificate({ compare }),
    LightsailLoadBalancerCertificateAttachment({ compare }),
    LightsailStaticIp({ compare }),
    LightsailStaticIpAttachment({ compare }),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        compare: compare({}),
        tagsKey,
      }),
    ])
  ),
]);
