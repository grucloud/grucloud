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
  and,
  filter,
  any,
  switchCase,
  fork,
} = require("rubico");
const {
  callProp,
  find,
  defaultsDeep,
  includes,
  isEmpty,
  findIndex,
  pluck,
  flatten,
  first,
} = require("rubico/x");
const { omitIfEmpty, replaceWithName } = require("@grucloud/core/Common");
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

const GROUP = "compute";

const findEC2VpnConnectionByIp = ({ peerIp }) =>
  find(
    and([
      eq(get("groupType"), "EC2::VpnConnection"),
      pipe([
        get("live.Options.TunnelOptions"),
        any(eq(pipe([get("OutsideIpAddress")]), peerIp)),
      ]),
    ])
  );

const findVpnConnectionIndex = ({ peerIp }) =>
  pipe([
    get("Options.TunnelOptions"),
    findIndex(eq(pipe([get("OutsideIpAddress")]), peerIp)),
    tap((index) => {
      assert(index >= 0);
    }),
  ]);

const findVirtualNetworkGatewayIndex = ({ peerIp }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
    get("properties.bgpSettings.bgpPeeringAddresses"),
    findIndex(eq(pipe([get("tunnelIpAddresses"), first]), peerIp)),
    tap((index) => {
      assert(index >= 0);
    }),
  ]);

const findAzureVirtualNetworkGateway = ({ peerIp }) =>
  find(
    and([
      eq(get("groupType"), "Network::VirtualNetworkGateway"),
      pipe([
        get("live.properties.bgpSettings.bgpPeeringAddresses"),
        pluck("tunnelIpAddresses"),
        flatten,
        any(includes(peerIp)),
      ]),
    ])
  );

module.exports = pipe([
  () => [
    {
      type: "Address",
      Client: GcpAddress,
      omitPropertiesExtra: ["address"],
    },

    {
      type: "BackendBucket",
      Client: GcpBackendBucket,
    },

    // TargetHttpsProxy
    //TODO
    // {
    //   type: "HttpsTargetProxy",
    //   dependencies: {
    //     urlMap: { type: "UrlMap", group: "compute" },
    //     certificate: { type: "SslCertificate", group: "compute" },
    //   },
    //   Client: GcpHttpsTargetProxy,
    // },
    // {
    //   type: "GlobalForwardingRule",
    //   dependencies: {
    //     httpsTargetProxy: { type: "HttpsTargetProxy", group: "compute" },
    //   },
    //   Client: GcpGlobalForwardingRule,
    // },

    {
      type: "Disk",
      Client: GcpDisk,
      filterLive: ({ providerConfig }) =>
        pipe([
          pick(["name", "sizeGb", "type"]),
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
      type: "ForwardingRule",
      dependencies: {
        address: {
          type: "Address",
          group: "compute",
          pathId: "IPAddress",
          dependencyId:
            ({ lives, config }) =>
            ({ IPAddress }) =>
              pipe([
                tap((params) => {
                  assert(IPAddress);
                }),
                lives.getByType({
                  providerName: config.providerName,
                  type: "Address",
                  group: "compute",
                }),
                find(eq(get("live.address"), IPAddress)),
                get("id"),
              ])(),
        },
        targetVpnGateway: {
          type: "TargetVpnGateway",
          group: "compute",
          pathId: "target",
        },
      },
      omitPropertiesExtra: ["IPAddress"],
    },
    {
      type: "Firewall",
      Client: GcpFirewall,
      dependencies: {
        network: {
          type: "Network",
          group: "compute",
          excludeDefaultDependencies: true,
        },
      },
      compare: compareGoogle({
        filterTarget: () =>
          pipe([omit(["network"]), defaultsDeep({ disabled: false })]),
        filterLive: () => pipe([omit(["network", "creationTimestamp"])]),
      }),
      propertiesDefault: {
        sourceRanges: ["0.0.0.0/0"],
      },
      filterLive: () =>
        pipe([
          pick([
            "name",
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
      type: "Instance",
      Client: GoogleVmInstance,
      compare: compareVmInstance,
      omitProperties: [
        "disks",
        "networkInterfaces",
        "scheduling",
        "serviceAccounts",
        "id",
        "creationTimestamp",
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
        subNetwork: {
          type: "Subnetwork",
          group: "compute",
          excludeDefaultDependencies: true,
        },
        disks: {
          type: "Disk",
          group: "compute",
          excludeDefaultDependencies: true,
          list: true,
        },
        firewall: { type: "Firewall", group: "compute" },
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
    {
      type: "Network",
      Client: GcpNetwork,
      filterLive: () =>
        pick(["description", "autoCreateSubnetworks", "name", "routingConfig"]),
    },
    {
      type: "Subnetwork",
      filterLive: () =>
        pipe([
          pick(["name", "ipCidrRange"]),
          tap((params) => {
            assert(true);
          }),
        ]),
      Client: GcpSubNetwork,
      dependencies: {
        network: { type: "Network", group: "compute" },
      },
    },
    {
      type: "Route",
      dependencies: {
        network: {
          type: "Network",
          group: "compute",
          pathId: "network",
        },
        vpnTunnel: {
          type: "VpnTunnel",
          group: "compute",
          pathId: "nextHopVpnTunnel",
        },
      },
    },
    {
      type: "SslCertificate",
      Client: GcpSslCertificate,
    },
    {
      type: "UrlMap",
      dependencies: {
        backendBucket: { type: "BackendBucket", group: "compute" },
      },
      Client: GcpUrlMap,
    },
    {
      type: "VpnTunnel",
      dependencies: {
        router: {
          type: "Router",
          group: "compute",
          pathId: "router",
        },
        targetVpnGateway: {
          type: "TargetVpnGateway",
          group: "compute",
          pathId: "targetVpnGateway",
        },
        vpnGateway: {
          type: "VpnGateway",
          group: "compute",
          pathId: "vpnGateway",
        },
        vpnConnectionAws: {
          type: "VpnConnection",
          group: "EC2",
          createOnly: true,
          providerType: "aws",
          dependencyId:
            ({ lives, config }) =>
            ({ peerIp }) =>
              pipe([
                tap((params) => {
                  assert(peerIp);
                }),
                lives.getByType({
                  providerType: "aws",
                  type: "VpnConnection",
                  group: "EC2",
                }),
                find(
                  pipe([
                    get("live.Options.TunnelOptions"),
                    any(eq(get("OutsideIpAddress"), peerIp)),
                  ])
                ),
                get("id"),
              ])(),
        },
        virtualNetworkGatewayAzure: {
          type: "VirtualNetworkGateway",
          group: "Network",
          createOnly: true,
          providerType: "azure",
          dependencyId:
            ({ lives, config }) =>
            ({ peerIp }) =>
              pipe([
                tap((params) => {
                  assert(peerIp);
                }),
                lives.getByType({
                  providerType: "azure",
                  type: "VirtualNetworkGateway",
                  group: "Network",
                }),
                find(
                  pipe([
                    get("live.properties.bgpSettings.bgpPeeringAddresses"),
                    pluck("tunnelIpAddresses"),
                    flatten,
                    any(includes(peerIp)),
                  ])
                ),
                get("id"),
              ])(),
        },
      },
      omitPropertiesExtra: ["sharedSecretHash"],
      environmentVariables: [{ path: "sharedSecret", suffix: "SHAREDSECRET" }],
      shouldRetryOnExceptionCreate: pipe([
        tap(({ error }) => {
          assert(error);
        }),
        get("error.response"),
        and([
          eq(get("status"), 400),
          pipe([
            get("data.error.message"),
            includes(
              "VPN gateway must be configured with an ESP forwarding rule before creating tunnel"
            ),
          ]),
        ]),
      ]),
      filterLiveExtra: ({ lives, providerConfig }) =>
        pipe([
          assign({
            sharedSecret: ({ peerIp, sharedSecret }) =>
              pipe([
                () => lives,
                findEC2VpnConnectionByIp({ peerIp }),
                switchCase([
                  isEmpty,
                  () => sharedSecret,
                  ({ id, live }) =>
                    pipe([
                      () => live,
                      findVpnConnectionIndex({ peerIp }),
                      (index) =>
                        pipe([
                          () => id,
                          replaceWithName({
                            groupType: "EC2::VpnConnection",
                            path: `live.Options.TunnelOptions[${index}].PreSharedKey`,
                            providerConfig,
                            lives,
                          }),
                        ])(),
                    ])(),
                ]),
              ])(),
          }),
          assign({
            peerIp: ({ peerIp }) =>
              pipe([
                tap((params) => {
                  assert(peerIp);
                }),
                () => lives,
                fork({
                  ec2VpnConnection: findEC2VpnConnectionByIp({ peerIp }),
                  azureVirtualNetworkGateway: findAzureVirtualNetworkGateway({
                    peerIp,
                  }),
                }),
                switchCase([
                  get("ec2VpnConnection"),
                  pipe([
                    get("ec2VpnConnection"),
                    ({ id, live }) =>
                      pipe([
                        () => live,
                        findVpnConnectionIndex({ peerIp }),
                        (index) =>
                          pipe([
                            () => id,
                            replaceWithName({
                              groupType: "EC2::VpnConnection",
                              path: `live.Options.TunnelOptions[${index}].OutsideIpAddress`,
                              providerConfig,
                              lives,
                            }),
                          ])(),
                      ])(),
                  ]),
                  get("azureVirtualNetworkGateway"),
                  pipe([
                    get("azureVirtualNetworkGateway"),
                    ({ id, live }) =>
                      pipe([
                        () => live,
                        findVirtualNetworkGatewayIndex({ peerIp }),
                        (index) =>
                          pipe([
                            () => id,
                            replaceWithName({
                              groupType: "Network::VirtualNetworkGateway",
                              path: `live.properties.bgpSettings.bgpPeeringAddresses[${index}].tunnelIpAddresses[0]`,
                              providerConfig,
                              lives,
                            }),
                          ])(),
                      ])(),
                  ]),
                  () => peerIp,
                ]),
              ])(),
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
