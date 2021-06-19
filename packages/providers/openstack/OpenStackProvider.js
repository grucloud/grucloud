const assert = require("assert");
const { pipe, eq, get, tap, filter, map } = require("rubico");

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
          onResponseList: ({ data: { volumes } }) => ({
            total: size(volumes),
            items: volumes,
          }),
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
                  get("links"),
                  find(eq(get("rel"), "self")),
                  get("href"),
                  (href) => axios.get(href),
                  get("data.server"),
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
