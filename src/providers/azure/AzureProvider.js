const assert = require("assert");
const _ = require("lodash");
const CoreProvider = require("../CoreProvider");
const AzClient = require("./AzClient");
const logger = require("../../logger")({ prefix: "AzProvider" });
const AzTag = require("./AzTag");
const { AzAuthorize } = require("./AzAuthorize");
const compare = require("../../Utils").compare;
const toString = (x) => JSON.stringify(x, null, 4);

const fnSpecs = (config) => {
  const {
    location,
    subscriptionId,
    managedByKey,
    managedByValue,
    stageTagKey,
    stage,
  } = config;

  const isOurMinion = ({ resource }) => AzTag.isOurMinion({ resource, config });
  const buildTags = () => ({
    [managedByKey]: managedByValue,
    [stageTagKey]: stage,
  });
  // TODO Inside queryParameters AzClient ?
  const queryParameters = () => "?api-version=2019-10-01";
  return [
    {
      // https://docs.microsoft.com/en-us/rest/api/resources/resourcegroups
      type: "ResourceGroup",
      Client: ({ spec }) =>
        AzClient({
          spec,
          url: `subscriptions/${subscriptionId}/resourcegroups/`,
          path: ({ name }) => `/${name}`,
          queryParameters,
          config,

          configDefault: ({ name, properties }) => ({
            location,
            tags: buildTags(config),
            ...properties,
          }),
        }),
      isOurMinion,
    },
  ];
};

module.exports = AzureProvider = async ({ name, config }) => {
  const { bearerToken } = await AzAuthorize(config);

  const configProviderDefault = {
    bearerToken,
  };

  const core = CoreProvider({
    type: "azure",
    name,
    mandatoryConfigKeys: [
      "tenantId",
      "subscriptionId",
      "appId",
      "password",
      "location",
    ],
    config: _.defaults(config, configProviderDefault),
    fnSpecs,
  });

  return core;
};
