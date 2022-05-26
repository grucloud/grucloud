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
const {
  first,
  prepend,
  callProp,
  find,
  defaultsDeep,
  when,
} = require("rubico/x");
const { camelCase } = require("change-case");

const GoogleTag = require("../../GoogleTag");
const { compareGoogle } = require("../../GoogleCommon");

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
      dependencies: {
        backendBucket: { type: "BackendBucket", group: "compute" },
      },
      Client: GcpUrlMap,
    },
    {
      type: "HttpsTargetProxy",
      dependencies: {
        urlMap: { type: "UrlMap", group: "compute" },
        certificate: { type: "SslCertificate", group: "compute" },
      },
      Client: GcpHttpsTargetProxy,
    },
    {
      type: "GlobalForwardingRule",
      dependencies: {
        httpsTargetProxy: { type: "HttpsTargetProxy", group: "compute" },
      },
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
      filterLive: () =>
        pipe([
          pick(["ipCidrRange"]),
          tap((params) => {
            assert(true);
          }),
        ]),
      Client: GcpSubNetwork,
      dependencies: {
        network: { type: "Network", group: "compute" },
      },
      //resourceVarName: ResourceVarNameSubnet,
      resourceName: ResourceNameSubnet,
    },
    {
      type: "Firewall",
      Client: GcpFirewall,
      dependencies: {
        network: { type: "Network", group: "compute" },
      },
      compare: compareGoogle({
        filterTarget: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["network"]),
            defaultsDeep({ disabled: false }),
          ]),
        filterLive: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["network", "creationTimestamp"]),
          ]),
      }),
      propertiesDefault: {
        sourceRanges: ["0.0.0.0/0"],
      },
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
      Client: GoogleVmInstance,
      compare: compareVmInstance,
      omitProperties: [
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
        "lastStopTimestamp",
        "kind",
        "zone",
        "tags.fingerprint",
        "metadata.fingerprint",
        "metadata.kind",
      ],
      //TODO remove dependsOnList
      dependsOnList: ["compute::Disk"],
      dependencies: {
        ip: { type: "Address", group: "compute" },
        subNetwork: { type: "SubNetwork", group: "compute" },
        disks: { type: "Disk", group: "compute", list: true },
        frewall: { type: "Firewall", group: "compute" },
        serviceAccount: { type: "ServiceAccount", group: "iam" },
      },
      propertiesDefault: {
        diskSizeGb: "10",
        diskType: "pd-standard",
        sourceImage:
          "projects/ubuntu-os-cloud/global/images/family/ubuntu-2004-lts",
        canIpForward: false,
        reservationAffinity: {
          consumeReservationType: "ANY_RESERVATION",
        },
        displayDevice: {
          enableDisplay: false,
        },
        confidentialInstanceConfig: {
          enableConfidentialCompute: false,
        },
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
      filterLive: ({ providerConfig, lives, omitProperties }) =>
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
                  get("live.sourceImage", ""),
                  callProp("replace", `${GCP_COMPUTE_BASE_URL}/`, ""),
                ])(),
            ]),
          }),
          omit(omitProperties),
          omitIfEmpty(["tags", "description", "metadata"]),
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
        ]),
    },
  ],
  map(
    pipe([
      defaultsDeep({
        group: GROUP,
        isOurMinion: GoogleTag.isOurMinion,
        compare: compareGoogle,
        tagsKey: "tags",
      }),
    ])
  ),
]);
