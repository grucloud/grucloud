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
const { prepend, callProp, find, defaultsDeep } = require("rubico/x");
const { camelCase } = require("change-case");

const logger = require("@grucloud/core/logger")({ prefix: "GcpComputeSpec" });

const GoogleTag = require("../../GoogleTag");
const { compare } = require("../../GoogleCommon");

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
const { omitIfEmpty } = require("@grucloud/core/Common");

const GROUP = "compute";

const ResourceVarNameSubnet = pipe([camelCase, prepend("subnet_")]);
const ResourceNameSubnet = (name) =>
  ResourceVarNameSubnet(name).replace(/_/g, "-");

module.exports = pipe([
  () => [
    {
      type: "SslCertificate",
      Client: GcpSslCertificate,
    },
    {
      type: "BackendBucket",
      Client: GcpBackendBucket,
    },
    {
      type: "UrlMap",
      dependsOn: ["compute::BackendBucket"],
      dependencies: () => ({
        backendBucket: { type: "BackendBucket", group: "compute" },
      }),
      Client: GcpUrlMap,
    },
    {
      type: "HttpsTargetProxy",
      dependsOn: ["compute::UrlMap", "compute::SslCertificate"],
      dependencies: () => ({
        urlMap: { type: "UrlMap", group: "compute" },
        certificate: { type: "SslCertificate", group: "compute" },
      }),
      Client: GcpHttpsTargetProxy,
    },
    {
      type: "GlobalForwardingRule",
      dependsOn: ["compute::HttpsTargetProxy"],
      dependencies: () => ({
        httpsTargetProxy: { type: "HttpsTargetProxy", group: "compute" },
      }),
      Client: GcpGlobalForwardingRule,
    },
    {
      type: "Network",
      Client: GcpNetwork,
      filterLive: () =>
        pick(["description", "autoCreateSubnetworks", "routingConfig"]),
    },
    {
      type: "SubNetwork",
      dependsOn: ["compute::Network"],
      filterLive: () =>
        pipe([
          pick(["ipCidrRange"]),
          tap((params) => {
            assert(true);
          }),
        ]),
      Client: GcpSubNetwork,
      dependencies: () => ({
        network: { type: "Network", group: "compute" },
      }),
      resourceVarName: ResourceVarNameSubnet,
      resourceName: ResourceNameSubnet,
    },
    {
      type: "Firewall",
      dependsOn: ["compute::Network"],
      Client: GcpFirewall,
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
          // TODO remove if sourceRanges: ["0.0.0.0/0"],
          tap((params) => {
            assert(true);
          }),
        ]),
    },
    {
      type: "Address",
      Client: GcpAddress,
      filterLive: () => pick(["description"]),
    },
    {
      type: "Disk",
      Client: GcpDisk,
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
      compare: compareVmInstance,
      dependencies: () => ({
        ip: { type: "Address", group: "compute" },
        subNetwork: { type: "SubNetwork", group: "compute" },
        disks: { type: "Disk", group: "compute", list: true },
        frewall: { type: "Firewall", group: "compute" },
        serviceAccount: { type: "ServiceAccount", group: "iam" },
      }),
      defaultValue: {
        startRestricted: false,
        deletionProtection: false,
        shieldedInstanceConfig: {
          enableSecureBoot: false,
          enableVtpm: true,
          enableIntegrityMonitoring: true,
        },
        shieldedInstanceIntegrityPolicy: {
          updateAutoLearnPolicy: true,
        },
      },
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
            "tags.fingerprint",
            "metadata.fingerprint",
            "metadata.kind",
          ]),
          omitIfEmpty(["tags"]),
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
  ],
  map(
    pipe([
      assign({ group: () => GROUP }),
      defaultsDeep({ isOurMinion: GoogleTag.isOurMinion, compare }),
    ])
  ),
]);
