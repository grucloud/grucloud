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

module.exports = (config) => {
  const isOurMinion = GoogleTag.isOurMinion;

  return [
    {
      type: "SslCertificate",
      Client: ({ spec }) =>
        GcpSslCertificate({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "BackendBucket",
      Client: ({ spec }) =>
        GcpBackendBucket({
          spec,
          config,
        }),
      isOurMinion,
    },

    {
      type: "UrlMap",
      dependsOn: ["BackendBucket"],
      Client: ({ spec }) =>
        GcpUrlMap({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "HttpsTargetProxy",
      dependsOn: ["UrlMap", "SslCertificate"],
      Client: ({ spec }) =>
        GcpHttpsTargetProxy({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "GlobalForwardingRule",
      dependsOn: ["HttpsTargetProxy"],
      Client: ({ spec }) =>
        GcpGlobalForwardingRule({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "Network",
      Client: ({ spec }) =>
        GcpNetwork({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "SubNetwork",
      dependsOn: ["Network"],
      Client: ({ spec }) =>
        GcpSubNetwork({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "Firewall",
      dependsOn: ["Network"],
      Client: ({ spec }) =>
        GcpFirewall({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "Address",
      Client: ({ spec }) =>
        GcpAddress({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "Disk",
      Client: ({ spec }) =>
        GcpDisk({
          spec,
          config,
        }),
      isOurMinion,
    },
    {
      type: "VmInstance",
      dependsOn: [
        "ServiceAccount",
        "Address",
        "SubNetwork",
        "Firewall",
        "Disk",
      ],
      Client: ({ spec }) =>
        GoogleVmInstance({
          spec,
          config,
        }),
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
  ];
};
