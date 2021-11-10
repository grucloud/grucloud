const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const AzClient = require("../AzClient");
const AzTag = require("../AzTag");
const { compare, isUpByIdFactory, isInstanceUp } = require("../AzureCommon");

exports.fnSpecs = ({ config }) => {
  const { location, managedByKey, managedByValue, stageTagKey, stage } = config;
  const subscriptionId = process.env.SUBSCRIPTION_ID;

  const isDefaultResourceGroup = eq(get("live.name"), "NetworkWatcherRG");

  const isOurMinion = AzTag.isOurMinion;

  const buildTags = () => ({
    [managedByKey]: managedByValue,
    [stageTagKey]: stage,
  });

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/resources/resource-groups
        // GET    https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
        // PUT    https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
        // DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
        // LIST   https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups?api-version=2019-10-01
        group: "resourceManagement",
        type: "ResourceGroup",
        filterLive: () => pipe([pick(["tags"])]),
        ignoreResource: () =>
          pipe([
            tap((params) => {
              assert(params.name);
            }),
            eq(get("name"), "NetworkWatcherRG"),
          ]),
        Client: ({ spec }) =>
          AzClient({
            spec,
            pathBase: `/subscriptions/${subscriptionId}/resourcegroups`,
            pathSuffix: () => "",
            queryParameters: () => "?api-version=2019-10-01",
            isUpByIdFactory,
            isInstanceUp,
            config,
            configDefault: ({ properties }) =>
              defaultsDeep({
                location,
                tags: buildTags(config),
              })(properties),
            isDefault: isDefaultResourceGroup,
            managedByOther: isDefaultResourceGroup,
            cannotBeDeleted: isDefaultResourceGroup,
          }),
      },
    ],
    map(defaultsDeep({ isOurMinion, compare })),
  ])();
};
