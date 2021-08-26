const assert = require("assert");
const {
  pipe,
  assign,
  map,
  pick,
  tap,
  omit,
  get,
  eq,
  filter,
} = require("rubico");
const { prepend, callProp, find } = require("rubico/x");
const { camelCase } = require("change-case");

const { compare } = require("@grucloud/core/Common");
const logger = require("@grucloud/core/logger")({ prefix: "GcpComputeSpec" });

const { tos } = require("@grucloud/core/tos");
const GoogleTag = require("../../GoogleTag");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");

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

const ResourceVarNameSubnet = pipe([camelCase, prepend("subnet_")]);
const ResourceNameSubnet = (name) =>
  ResourceVarNameSubnet(name).replace(/_/g, "-");

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
      dependencies: () => ({
        backendBucket: { type: "BackendBucket", group: "compute" },
      }),
      Client: GcpUrlMap,
      isOurMinion,
    },
    {
      type: "HttpsTargetProxy",
      dependsOn: ["compute::UrlMap", "compute::SslCertificate"],
      dependencies: () => ({
        urlMap: { type: "UrlMap", group: "compute" },
        certificate: { type: "SslCertificate", group: "compute" },
      }),
      Client: GcpHttpsTargetProxy,
      isOurMinion,
    },
    {
      type: "GlobalForwardingRule",
      dependsOn: ["compute::HttpsTargetProxy"],
      dependencies: () => ({
        httpsTargetProxy: { type: "HttpsTargetProxy", group: "compute" },
      }),
      Client: GcpGlobalForwardingRule,
      isOurMinion,
    },
    {
      type: "Network",
      Client: GcpNetwork,
      isOurMinion,
      filterLive: () =>
        pick(["description", "autoCreateSubnetworks", "routingConfig"]),
    },
    {
      type: "SubNetwork",
      dependsOn: ["compute::Network"],
      Client: GcpSubNetwork,
      dependencies: () => ({
        network: { type: "Network", group: "compute" },
      }),
      isOurMinion,
      resourceVarName: ResourceVarNameSubnet,
      resourceName: ResourceNameSubnet,
    },
    {
      type: "Firewall",
      dependsOn: ["compute::Network"],
      Client: GcpFirewall,
      isOurMinion,
      dependencies: () => ({
        network: { type: "Network", group: "compute" },
      }),
      compare: compare({
        filterTarget: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
        filterLive: pipe([
          tap((params) => {
            assert(true);
          }),
        ]),
      }),
      filterLive: () =>
        pipe([
          pick([
            "description",
            "priority",
            "sourceRanges",
            "allowed",
            "direction",
            "logConfig",
          ]),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "Address",
      Client: GcpAddress,
      isOurMinion,
      filterLive: () => pick(["description"]),
    },
    {
      type: "Disk",
      Client: GcpDisk,
      isOurMinion,
      filterLive: ({ providerConfig }) =>
        pipe([
          pick(["sizeGb", "type"]),
          assign({
            type: pipe([
              get("type"),
              callProp(
                "replace",
                `${GCP_COMPUTE_BASE_URL}/projects/${providerConfig.projectId}/zones/${providerConfig.zone}/diskTypes/`,
                ""
              ),
            ]),
          }),
        ]),
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
      dependencies: () => ({
        address: { type: "Address", group: "compute" },
        subnetworks: { type: "SubNetwork", group: "compute" },
        disks: { type: "Disk", group: "compute" },
        frewall: { type: "Firewall", group: "compute" },
        serviceAccount: { type: "ServiceAccount", group: "iam" },
      }),
      filterLive: ({ providerConfig, lives }) =>
        pipe([
          assign({
            sourceImage: pipe([
              get("disks"),
              find(get("boot")),
              get("source"),
              (source) =>
                pipe([
                  () => lives,
                  filter(eq(get("groupType"), "compute::Disk")),
                  find(eq(get("live.selfLink"), source)),
                  get("live.sourceImage"),
                  callProp("replace", `${GCP_COMPUTE_BASE_URL}/`, ""),
                ])(),
            ]),
          }),
          omit([
            "disks",
            "networkInterfaces",
            "scheduling",
            "serviceAccounts",
            "id",
            "creationTimestamp",
            "name",
            "status",
            "selfLink",
            "cpuPlatform",
            "labelFingerprint",
            "fingerprint",
            "lastStartTimestamp",
            "kind",
            "zone",
          ]),
          omit(["tags.fingerprint", "metadata.fingerprint", "metadata.kind"]),
          ///TODO remove our tags in labels
          //TODO remove tags if empty
          assign({
            machineType: pipe([
              get("machineType"),
              callProp(
                "replace",
                `${GCP_COMPUTE_BASE_URL}/projects/${providerConfig.projectId}/zones/${providerConfig.zone}/machineTypes/`,
                ""
              ),
            ]),
          }),
          tap((params) => {
            assert(true);
          }),
        ]),
    },
  ]);
};
