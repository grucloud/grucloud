const assert = require("assert");
const { pipe, eq, get, tap, filter, map } = require("rubico");

const { defaultsDeep, isFunction, pluck, find } = require("rubico/x");

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
    location,
    managedByKey,
    managedByValue,
    stageTagKey,
    stage,
    providerName,
  } = config;

  assert(providerName);

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
      type: "Server",
      //dependsOn: ["ResourceGroup", "NetworkInterface"],
      Client: ({ spec }) =>
        OpenStackClient({
          spec,
          pathBase: `https://compute.uk1.cloud.ovh.net/v2.1/291a80ce2c8d490fb030c3a3b76eeb02`,
          pathSuffix: () => `/`,
          pathSuffixList: () => `/servers`,
          isUpByIdFactory,
          isInstanceUp,
          config,
          configDefault: ({ properties, dependencies }) => {
            return defaultsDeep({
              //tags: buildTags(config),
            })(properties);
          },
          findDependencies: ({ live }) => [],
        }),
      isOurMinion,
    },
  ];
};

exports.OpenStackProvider = ({ name = "openstack", config, ...other }) => {
  assert(isFunction(config), "config must be a function");

  const { OS_USERNAME, OS_PASSWORD, OS_AUTH_URL } = process.env;
  assert(OS_USERNAME);
  assert(OS_PASSWORD);
  assert(OS_AUTH_URL);

  let bearerToken;
  const start = async () => {
    bearerToken = await OpenStackAuthorize({
      baseURL: OS_AUTH_URL,
      username: OS_USERNAME,
      password: OS_PASSWORD,
    });
  };

  const configProviderDefault = {
    bearerToken: () => bearerToken,
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
