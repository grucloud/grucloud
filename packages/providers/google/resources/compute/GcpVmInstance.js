const assert = require("assert");
const { get, eq, switchCase, pipe, tap, map } = require("rubico");
const { defaultsDeep, pluck, find } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "GcpVmInstance" });
const { tos } = require("@grucloud/core/tos");
const GoogleClient = require("../../GoogleClient");
const { buildLabel } = require("../../GoogleCommon");
const { toTagName } = require("@grucloud/core/TagName");
const { getField } = require("@grucloud/core/ProviderCommon");
const { isUpByIdCore } = require("@grucloud/core/Common");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");

module.exports = GoogleVmInstance = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);
  assert(configProvider.stage);
  const { providerName } = configProvider;
  assert(providerName);
  const { projectId, region, zone, managedByTag } = configProvider;

  const findDependencies = ({ live, lives }) => [
    {
      type: "Network",
      ids: pipe([
        () => live,
        get("networkInterfaces"),
        pluck("network"),
        map((network) =>
          pipe([
            () => lives.getByType({ type: "Network", providerName }),
            get("resources", []),
            find(eq(get("live.selfLink"), network)),
            get("id"),
          ])()
        ),
      ])(),
    },
    {
      type: "SubNetwork",
      ids: pipe([
        () => live,
        get("networkInterfaces"),
        pluck("subnetwork"),
        map((network) =>
          pipe([
            () => lives.getByType({ type: "SubNetwork", providerName }),
            get("resources", []),
            find(eq(get("live.selfLink"), network)),
            get("id"),
          ])()
        ),
      ])(),
    },
  ];

  const configDefault = ({ name, properties, dependencies }) => {
    logger.debug(`configDefault ${tos({ properties, dependencies })}`);
    const { ip, serviceAccount, subNetwork } = dependencies;
    const {
      machineType,
      diskType,
      sourceImage,
      diskSizeGb,
      metadata,
      ...otherProperties
    } = properties;

    const buildServiceAccount = ({ serviceAccount }) => {
      if (serviceAccount) {
        return [
          {
            email: getField(serviceAccount, "email"),
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
          },
        ];
      }
    };

    const buildSubNetwork = switchCase([
      (subNetwork) => subNetwork,
      (subNetwork) => subNetwork.resource.name,
      () => "default",
    ]);

    const config = defaultsDeep({
      kind: "compute#instance",
      name,
      zone: `projects/${projectId(configProvider)}/zones/${zone}`,
      machineType: `projects/${projectId(
        configProvider
      )}/zones/${zone}/machineTypes/${machineType}`,
      labels: buildLabel(configProvider),
      metadata: defaultsDeep({
        kind: "compute#metadata",
      })(metadata || {}),
      serviceAccounts: buildServiceAccount({ serviceAccount }),
      disks: [
        {
          kind: "compute#attachedDisk",
          type: "PERSISTENT",
          boot: true,
          mode: "READ_WRITE",
          autoDelete: true,
          deviceName: toTagName(name, managedByTag),
          initializeParams: {
            sourceImage,
            diskType: `projects/${projectId(
              configProvider
            )}/zones/${zone}/diskTypes/${diskType}`,
            diskSizeGb,
          },
          diskEncryptionKey: {},
        },
      ],
      networkInterfaces: [
        {
          kind: "compute#networkInterface",
          subnetwork: `projects/${projectId(
            configProvider
          )}/regions/${region}/subnetworks/${buildSubNetwork(subNetwork)}`,
          accessConfigs: [
            {
              ...(ip && { natIP: getField(ip, "address") }),
              kind: "compute#accessConfig",
              name: "External NAT",
              type: "ONE_TO_ONE_NAT",
              networkTier: "PREMIUM",
            },
          ],
          aliasIpRanges: [],
        },
      ],
      displayDevice: {
        enableDisplay: false,
      },
      canIpForward: false,
      scheduling: {
        preemptible: false,
        onHostMaintenance: "MIGRATE",
        automaticRestart: true,
        nodeAffinities: [],
      },
      deletionProtection: false,
      reservationAffinity: {
        consumeReservationType: "ANY_RESERVATION",
      },
      shieldedInstanceConfig: {
        enableSecureBoot: false,
        enableVtpm: true,
        enableIntegrityMonitoring: true,
      },
      confidentialInstanceConfig: {
        enableConfidentialCompute: false,
      },
    })(otherProperties);
    logger.debug(`configDefault ${name} result: ${tos(config)}`);
    return config;
  };

  const isInstanceUp = eq(get("status"), "RUNNING");

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  return GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId(configProvider)}/zones/${zone}/instances`,
    config: configProvider,
    isUpByIdFactory,
    configDefault,
    findDependencies,
  });
};
