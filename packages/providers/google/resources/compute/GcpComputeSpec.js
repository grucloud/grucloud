const { pipe, assign, map } = require("rubico");
const { compare } = require("@grucloud/core/Utils");
const logger = require("@grucloud/core/logger")({ prefix: "GcpComputeSpec" });

const { tos } = require("@grucloud/core/tos");
const GoogleTag = require("../../GoogleTag");

const { GcpNetwork } = require("./GcpNetwork");
const { GcpSubNetwork } = require("./GcpSubNetwork");
const { GcpFirewall } = require("./GcpFirewall");
const { GoogleVmInstance, compareVmInstance } = require("./GcpVmInstance");
const { GcpAddress } = require("./GcpAddress");
const { GcpSslCertificate } = require("./GcpSslCertificate");
const { GcpBackendBucket } = require("./GcpBackendBucket");
const { GcpHttpsTargetProxy } = require("./GcpHttpsTargetProxy");
const { GcpUrlMap } = require("./GcpUrlMap");
const { GcpGlobalForwardingRule } = require("./GcpGlobalForwardingRule");
const { GcpDisk } = require("./GcpDisk");

const GROUP = "compute";

module.exports = () => {
  const isOurMinion = GoogleTag.isOurMinion;

  return map(assign({ group: () => GROUP }))([
    {
      type: "SslCertificate",
      Client: GcpSslCertificate,
      isOurMinion,
    },
    {
      type: "BackendBucket",
      Client: GcpBackendBucket,
      isOurMinion,
    },

    {
      type: "UrlMap",
      dependsOn: ["compute::BackendBucket"],
      Client: GcpUrlMap,
      isOurMinion,
    },
    {
      type: "HttpsTargetProxy",
      dependsOn: ["compute::UrlMap", "compute::SslCertificate"],
      Client: GcpHttpsTargetProxy,
      isOurMinion,
    },
    {
      type: "GlobalForwardingRule",
      dependsOn: ["compute::HttpsTargetProxy"],
      Client: GcpGlobalForwardingRule,
      isOurMinion,
    },
    {
      type: "Network",
      Client: GcpNetwork,
      isOurMinion,
    },
    {
      type: "SubNetwork",
      dependsOn: ["compute::Network"],
      Client: GcpSubNetwork,
      isOurMinion,
    },
    {
      type: "Firewall",
      dependsOn: ["compute::Network"],
      Client: GcpFirewall,
      isOurMinion,
    },
    {
      type: "Address",
      Client: GcpAddress,
      isOurMinion,
    },
    {
      type: "Disk",
      Client: GcpDisk,
      isOurMinion,
    },
    {
      type: "VmInstance",
      dependsOn: [
        "iam::ServiceAccount",
        "compute::Address",
        "compute::SubNetwork",
        "compute::Firewall",
        "compute::Disk",
      ],
      Client: GoogleVmInstance,
      propertiesDefault: {
        machineType: "f1-micro",
        diskSizeGb: "10",
        diskType: "pd-standard",
        sourceImage:
          "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
      },
      isOurMinion,
      compare: compareVmInstance,
    },
  ]);
};
