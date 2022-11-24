const assert = require("assert");
const path = require("path");

const {
  get,
  eq,
  switchCase,
  pipe,
  tap,
  map,
  omit,
  assign,
  tryCatch,
  or,
  filter,
  not,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  find,
  includes,
  size,
  isEmpty,
  flatten,
  keys,
} = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "GcpVmInstance" });
const { tos } = require("@grucloud/core/tos");

const GoogleClient = require("../../GoogleClient");
const {
  compareGoogle,
  buildLabel,
  createAxiosMakerGoogle,
} = require("../../GoogleCommon");
const { toTagName } = require("@grucloud/core/TagName");
const { getField } = require("@grucloud/core/ProviderCommon");
const { axiosErrorToJSON } = require("@grucloud/core/Common");
const { GCP_COMPUTE_BASE_URL } = require("./GcpComputeCommon");
const { retryCall } = require("@grucloud/core/Retry");

// https://cloud.google.com/compute/docs/reference/rest/v1

exports.GoogleVmInstance = ({ spec, config: configProvider }) => {
  assert(spec);
  assert(configProvider);
  assert(configProvider.stage);
  const { providerName } = configProvider;
  assert(providerName);
  const { projectId, region, zone, managedByTag } = configProvider;
  assert(projectId);

  const url = `/projects/${projectId}/zones/${zone}/instances`;

  const axios = createAxiosMakerGoogle({
    baseURL: GCP_COMPUTE_BASE_URL,
    url,
    config: configProvider,
  });

  const findDependencies = ({ live, lives }) => [
    {
      type: "Network",
      group: "compute",
      ids: pipe([
        () => live,
        get("networkInterfaces"),
        pluck("network"),
        map((network) =>
          pipe([
            lives.getByType({
              type: "Network",
              group: "compute",
              providerName,
            }),
            find(eq(get("live.selfLink"), network)),
            get("id"),
          ])()
        ),
      ])(),
    },
    {
      type: "Subnetwork",
      group: "compute",
      ids: pipe([
        () => live,
        get("networkInterfaces"),
        pluck("subnetwork"),
        map((network) =>
          pipe([
            lives.getByType({
              type: "Subnetwork",
              group: "compute",
              providerName,
            }),
            find(eq(get("live.selfLink"), network)),
            get("id"),
          ])()
        ),
      ])(),
    },
    {
      type: "Disk",
      group: "compute",
      ids: pipe([
        () => live,
        get("disks"),
        pluck("source"),
        map((source) =>
          pipe([
            lives.getByType({
              type: "Disk",
              group: "compute",
              providerName,
            }),
            find(eq(get("live.selfLink"), source)),
            get("id"),
          ])()
        ),
      ])(),
    },
    {
      type: "Address",
      group: "compute",
      ids: pipe([
        () => live,
        get("networkInterfaces"),
        pluck("accessConfigs"),
        flatten,
        pluck("natIP"),
        map((natIP) =>
          pipe([
            lives.getByType({
              type: "Address",
              group: "compute",
              providerName,
            }),
            find(eq(get("live.address"), natIP)),
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
      isEmpty,
      () => "default",
      get("resource.name"),
    ]);

    const config = defaultsDeep({
      kind: "compute#instance",
      name,
      zone: `${GCP_COMPUTE_BASE_URL}/projects/${projectId}/zones/${zone}`,
      machineType: `${GCP_COMPUTE_BASE_URL}/projects/${projectId}/zones/${zone}/machineTypes/${machineType}`,
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
            diskType: `projects/${projectId}/zones/${zone}/diskTypes/${diskType}`,
            diskSizeGb,
          },
          diskEncryptionKey: {},
        },
      ],
      networkInterfaces: [
        {
          kind: "compute#networkInterface",
          subnetwork: `projects/${projectId}/regions/${region}/subnetworks/${buildSubNetwork(
            subNetwork
          )}`,
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
    })(otherProperties);
    logger.debug(`configDefault ${name} result: ${tos(config)}`);
    return config;
  };

  const isInstanceUp = eq(get("status"), "RUNNING");
  const isInstanceDown = or([isEmpty, eq(get("status"), "TERMINATED")]);

  const client = GoogleClient({
    spec,
    baseURL: GCP_COMPUTE_BASE_URL,
    url: `/projects/${projectId}/zones/${zone}/instances`,
    config: configProvider,
    isInstanceUp,
    isInstanceDown,
    configDefault,
    findDependencies,
  });

  const instanceStop = ({ name, id }) =>
    pipe([
      tap(() => {
        logger.debug(`instanceStop ${name}, id: ${id}`);
      }),
      () => axios.post(`/${name}/stop`),
      tap(() =>
        retryCall({
          name: `instanceStop isDownById name: ${name}`,
          fn: () => client.isDownById({ id, name }),
          config: configProvider,
        })
      ),
      tap(() => {
        logger.debug(`instanceStop done`);
      }),
    ])();

  const instanceStart = ({ name, id }) =>
    pipe([
      tap(() => {
        logger.debug(`instanceStart ${name}`);
      }),
      () => axios.post(`/${name}/start`),
      tap(() =>
        retryCall({
          name: `instanceStart isDownById name: ${name}`,
          fn: () => client.isUpById({ id, name }),
          config: configProvider,
        })
      ),
      tap(() => {
        logger.debug(`instanceStart done`);
      }),
    ])();

  const disksAttach = ({ disks = [], name }) =>
    pipe([
      tap(() => {
        logger.debug(`disksAttach ${name} #disks: ${size(disks)}`);
      }),
      () => disks,
      map(
        tryCatch(
          pipe([
            tap((disk) => {
              logger.debug(`disksAttach disks ${disk.name}`);
            }),
            (disk) => ({
              source: `/compute/v1/projects/${projectId}/zones/${zone}/disks/${disk.name}`,
            }),
            (params) => axios.post(`/${name}/attachDisk`, params),
          ]),
          (error, disk) =>
            pipe([
              tap(() => {
                logger.error(
                  `disksAttach error disks ${disk.name}, ${tos(error)}`
                );
              }),
              () => ({ error, disk }),
            ])()
        )
      ),
      filter(get("error")),
      tap.if(not(isEmpty), (errors) => {
        throw Error(`cannot attach volume: ${tos(errors)}`);
      }),
    ])();

  const create = ({ name, payload, dependencies }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(`create ${name}, payload: ${tos({ payload })}`);
        }),
        () => client.create({ name, payload, dependencies }),
        tap(() => disksAttach({ disks: dependencies().disks, name })),
        tap(({ id }) => {
          logger.debug(`created vm ${name}, id: ${id}`);
        }),
      ]),
      (error) => {
        throw axiosErrorToJSON(error);
      }
    )();

  const update = ({ name, payload, dependencies, diff, live, id }) =>
    tryCatch(
      pipe([
        tap(() => {
          logger.debug(
            `update ${name}, payload: ${tos({ payload, diff, live, id })}`
          );
          assert(name);
          assert(payload);
          assert(!spec.singleton);
          assert(!spec.listOnly);
        }),
        () => diff,
        switchCase([
          get("updateNeedRestart"),
          pipe([
            tap(() => {
              logger.debug(`updateNeedRestart`);
            }),
            () => instanceStop({ name, id }),
            () => client.getById({ id }),
            ({ fingerprint }) =>
              axios.put(`/${name}`, {
                ...payload,
                fingerprint,
              }),
            () => instanceStart({ name, id }),
          ]),
          //get("updateNeedRefresh"),
          pipe([
            tap(() => {
              logger.debug(`updateNeedRefresh`);
            }),
            () =>
              axios.put(`/${name}`, {
                ...payload,
                fingerprint: live.fingerprint,
              }),
          ]),
          // () => {
          //   assert(false, "updateNeedRestart or updateNeedRefresh not set");
          // },
        ]),
      ]),
      (error) => {
        throw axiosErrorToJSON(error);
      }
    )();

  return { ...client, update, create };
};

const filterItem = ({ config }) =>
  pipe([
    tap((item) => {
      assert(config.zone);
      assert(config.projectId);
    }),
    omit(["disks", "networkInterfaces", "scheduling", "serviceAccounts"]),
    assign({
      machineType: ({ machineType }) =>
        machineType.replace(
          `${GCP_COMPUTE_BASE_URL}/projects/${config.projectId}/zones/${config.zone}/machineTypes/`,
          ""
        ),
    }),
    tap((xxx) => {
      assert(true);
    }),
  ]);

// See https://cloud.google.com/compute/docs/instances/update-instance-properties#updatable-properties
const VM_INSTANCE_ATTRIBUTES_RESTART = [
  "reservationAffinity",
  "disk",
  "displayDevice",
  "guestAccelerator",
  "machineType",
  "minCpuPlatform",
  "scheduling",
  "serviceAccount",
  "shieldedInstanceConfig",
  "labels",
];

const VM_INSTANCE_ATTRIBUTES_REFRESH = [
  "deletionProtection",
  "description",
  "disk",
  "metadata",
  "tags",
];

exports.compareVmInstance = pipe([
  tap(({ config }) => {
    assert(config);
  }),
  //TODO
  compareGoogle({
    filterTarget: ({ config }) => pipe([filterItem({ config })]),
    filterLive: ({ config }) => pipe([filterItem({ config })]),
  }),
  assign({
    // TODO change image ?
    // updateNeedDestroy: pipe([
    //   get("liveDiff.updated"),
    //   Object.keys,
    //   or([find((key) => includes(key)(["ImageId"]))]),
    // ]),
    // updateNeedRefresh: or([
    //   pipe([
    //     get("liveDiff.updated"),
    //     keys,
    //     or([find((key) => includes(key)(VM_INSTANCE_ATTRIBUTES_REFRESH))]),
    //   ]),
    //   pipe([
    //     get("liveDiff.added"),
    //     keys,
    //     or([find((key) => includes(key)(VM_INSTANCE_ATTRIBUTES_REFRESH))]),
    //   ]),
    // ]),
    updateNeedRestart: or([
      pipe([
        get("liveDiff.updated"),
        keys,
        or([find((key) => includes(key)(VM_INSTANCE_ATTRIBUTES_RESTART))]),
      ]),
      pipe([
        get("liveDiff.added"),
        keys,
        or([find((key) => includes(key)(VM_INSTANCE_ATTRIBUTES_RESTART))]),
      ]),
    ]),
  }),
  tap((diff) => {
    logger.debug(`compareVmInstance ${tos(diff)}`);
  }),
]);
