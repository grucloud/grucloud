const assert = require("assert");
const {
  pipe,
  eq,
  get,
  tap,
  assign,
  map,
  tryCatch,
  switchCase,
} = require("rubico");

const {
  defaultsDeep,
  isFunction,
  pluck,
  find,
  size,
  keys,
} = require("rubico/x");

const CoreProvider = require("@grucloud/core/CoreProvider");
const OpenStackClient = require("./OpenStackClient");
const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const { getField, notAvailable } = require("@grucloud/core/ProviderCommon");
const { isUpByIdCore } = require("@grucloud/core/Common");
const { checkEnv } = require("@grucloud/core/Utils");
const { tos } = require("@grucloud/core/tos");
const { isOurMinion } = require("./OpenStackTag");
const { OpenStackAuthorize } = require("./OpenStackUtils");

const fnSpecs = (config) => {
  const {
    managedByKey,
    managedByValue,
    stageTagKey,
    stage,
    projectId,
    providerName,
  } = config;

  assert(providerName);
  assert(projectId);

  const isInstanceUp = (instance) => {
    return !!instance;
  };

  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  const getHref = ({ field, axios, type = "bookmark" }) =>
    pipe([
      get("links"),
      find(eq(get("rel"), type)),
      get("href"),
      (href) =>
        tryCatch(
          pipe([() => axios.get(href), get(`data.${field}`)]),
          switchCase([
            eq(get("response.status"), 300),
            pipe([
              get("response.data.choices"),
              find(eq(get("status"), "CURRENT")),
              getHref({ field, axios, type: "self" }),
            ]),
            (error) => {
              throw error;
            },
          ])
        )(),
      tap((xxx) => {
        //logger.debug(``);
      }),
    ]);

  return [
    {
      type: "Network",
      Client: ({ spec }) =>
        OpenStackClient({
          spec,
          pathBase: `https://network.compute.uk1.cloud.ovh.net`,
          pathSuffixList: () => `/v2.0/networks`,
          onResponseList: ({ data: { networks } }) => ({
            total: size(networks),
            items: networks,
          }),
          isUpByIdFactory,
          isInstanceUp,
          config,
          configDefault: ({ properties }) => defaultsDeep({})(properties),
        }),
      isOurMinion,
    },
    {
      type: "Subnet",
      Client: ({ spec }) =>
        OpenStackClient({
          spec,
          pathBase: `https://network.compute.uk1.cloud.ovh.net`,
          pathSuffixList: () => `/v2.0/subnets`,
          findName: (subnet) => `${subnet.name}::${subnet.cidr}`,
          onResponseList: ({ data: { subnets } }) => ({
            total: size(subnets),
            items: subnets,
          }),
          isUpByIdFactory,
          isInstanceUp,
          config,
          configDefault: ({ properties }) => defaultsDeep({})(properties),
          findDependencies: ({ live }) => [
            {
              type: "Network",
              ids: [live.network_id],
            },
          ],
        }),
      isOurMinion,
    },
    // https://docs.openstack.org/api-ref/block-storage/
    {
      type: "Volume",
      Client: ({ spec }) =>
        OpenStackClient({
          spec,
          pathBase: `https://volume.compute.uk1.cloud.ovh.net/v3`,
          pathSuffixList: () => `/${projectId}/volumes`,
          onResponseList: ({ axios, data }) =>
            pipe([
              () => data,
              get("volumes"),
              map(getHref({ field: "volume", axios, type: "self" })),
              (volumes) => ({
                total: size(volumes),
                items: volumes,
              }),
            ])(),
          isUpByIdFactory,
          isInstanceUp,
          config,
          configDefault: ({ properties }) => defaultsDeep({})(properties),
          findDependencies: ({ live }) => [],
        }),
      isOurMinion,
    },
    // https://docs.openstack.org/api-ref/compute/
    {
      type: "Server",
      dependsOn: ["Network", "Volume"],
      Client: ({ spec }) =>
        OpenStackClient({
          spec,
          pathBase: `https://compute.uk1.cloud.ovh.net/v2.1`,
          pathSuffixList: () => `/${projectId}/servers`,
          onResponseList: ({ axios, data }) =>
            pipe([
              () => data,
              get("servers"),
              map(
                pipe([
                  getHref({ field: "server", axios, type: "self" }),
                  assign({
                    image: pipe([
                      get("image"),
                      getHref({ field: "image", axios }),
                    ]),
                    flavor: pipe([
                      get("flavor"),
                      getHref({ field: "flavor", axios }),
                    ]),
                  }),
                  tap((xxx) => {
                    //logger.debug(``);
                  }),
                ])
              ),
              (servers) => ({
                total: size(servers),
                items: servers,
              }),
            ])(),
          isUpByIdFactory,
          isInstanceUp,
          config,
          configDefault: ({ properties }) => defaultsDeep({})(properties),
          findDependencies: ({ live, lives }) => [
            {
              type: "Network",
              ids: pipe([
                () => live,
                get("addresses"),
                keys,
                map((network) =>
                  lives.getByName({
                    providerName,
                    type: "Network",
                    name: network,
                  })
                ),
                pluck("id"),
              ])(),
            },
            {
              type: "Volume",
              ids: pipe([
                () => live,
                get("os-extended-volumes:volumes_attached"),
                pluck("id"),
              ])(),
            },
          ],
        }),
      isOurMinion,
    },
  ];
};

exports.OpenStackProvider = ({ name = "openstack", config, ...other }) => {
  assert(isFunction(config), "config must be a function");

  const {
    OS_USERNAME,
    OS_PASSWORD,
    OS_AUTH_URL,
    OS_PROJECT_ID,
    OS_PROJECT_NAME,
  } = process.env;

  assert(OS_USERNAME);
  assert(OS_PASSWORD);
  assert(OS_AUTH_URL);
  //assert(OS_PROJECT_ID);
  assert(OS_PROJECT_NAME);

  let bearerToken;
  const start = async () => {
    bearerToken = await OpenStackAuthorize({
      baseURL: OS_AUTH_URL,
      username: OS_USERNAME,
      password: OS_PASSWORD,
      projectId: OS_PROJECT_ID,
      projectName: OS_PROJECT_NAME,
    });
  };

  const configProviderDefault = {
    bearerToken: () => bearerToken,
    username: OS_USERNAME,
    projectId: OS_PROJECT_ID,
    projectName: OS_PROJECT_NAME,
    retryCount: 60,
    retryDelay: 10e3,
  };

  const info = () => ({
    username: OS_USERNAME,
  });

  const core = CoreProvider({
    ...other,
    type: "openstack",
    name,
    mandatoryConfigKeys: [""],
    get config() {
      return pipe([
        () => config(configProviderDefault),
        defaultsDeep(configProviderDefault),
      ])();
    },
    fnSpecs,
    start,
    info,
  });

  return core;
};
