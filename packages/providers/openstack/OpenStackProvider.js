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
  identity,
  isEmpty,
} = require("rubico/x");

const CoreProvider = require("@grucloud/core/CoreProvider");
const OpenStackClient = require("./OpenStackClient");
const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const { mergeConfig } = require("@grucloud/core/ProviderCommon");

const { tos } = require("@grucloud/core/tos");
const { isOurMinion } = require("./OpenStackTag");
const { OpenStackAuthorize } = require("./OpenStackUtils");

const fnSpecs = (config) => {
  const { projectId, providerName } = config;

  assert(providerName);
  assert(projectId);

  const isInstanceUp = (instance) => {
    return !!instance;
  };

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
          onResponseList: () => get("networks"),
          isInstanceUp,
          config,
          configDefault: ({ properties }) => defaultsDeep({})(properties),
          isDefault: () =>
            pipe([
              tap((xxx) => {
                //logger.debug(``);
              }),
              eq(get("name"), "Ext-Net"),
            ]),
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
          onResponseList: () => get("subnets"),
          isInstanceUp,
          config,
          configDefault: ({ properties }) => defaultsDeep({})(properties),
          findName: () =>
            pipe([
              get("name"),
              switchCase([isEmpty, () => live.cidr, identity]),
              tap((name) => {
                assert(name, `missing name in ${tos(live)}`);
              }),
            ]),
          findDependencies: ({ live }) => [
            {
              type: "Network",
              ids: [live.network_id],
            },
          ],
          isDefault: ({ live, lives }) =>
            pipe([
              () => live.network_id,
              lives.getById({
                type: "Network",
                providerName,
              }),
              get("isDefault"),
            ])(),
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
          onResponseList:
            ({ axios }) =>
            (data) =>
              pipe([
                () => data,
                get("volumes"),
                map(getHref({ field: "volume", axios, type: "self" })),
              ])(),
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
          onResponseList:
            ({ axios }) =>
            (data) =>
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
              ])(),
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
                map(
                  lives.getByName({
                    providerName,
                    type: "Network",
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

exports.OpenStackProvider = ({
  name = "openstack",
  config,
  configs = [],
  ...other
}) => {
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

  const configDefault = {
    bearerToken: () => bearerToken,
    username: OS_USERNAME,
    projectId: OS_PROJECT_ID,
    projectName: OS_PROJECT_NAME,
    retryCount: 60,
    retryDelay: 10e3,
  };

  const makeConfig = () => mergeConfig({ configDefault, config, configs });

  const info = () => ({
    username: OS_USERNAME,
  });

  const core = CoreProvider({
    ...other,
    type: "openstack",
    name,
    mandatoryConfigKeys: [""],
    makeConfig,
    fnSpecs,
    start,
    info,
  });

  return core;
};
