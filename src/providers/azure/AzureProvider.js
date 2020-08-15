const assert = require("assert");
const { defaultsDeep } = require("rubico/x");

const CoreProvider = require("../CoreProvider");
const AzClient = require("./AzClient");
const logger = require("../../logger")({ prefix: "AzProvider" });
const AzTag = require("./AzTag");
const { getField, notAvailable } = require("../ProviderCommon");
const { AzAuthorize } = require("./AzAuthorize");
const { isUpByIdCore } = require("../Common");
const { checkEnv } = require("../../Utils");
//const compare = require("../../Utils").compare;
const { tos } = require("../../tos");

const fnSpecs = (config) => {
  const { location, managedByKey, managedByValue, stageTagKey, stage } = config;
  const subscriptionId = process.env.SUBSCRIPTION_ID;

  const getStateName = (instance) => {
    const { provisioningState } = instance.properties;
    assert(provisioningState);
    logger.debug(`az stateName ${provisioningState}`);
    return provisioningState;
  };

  const isInstanceUp = (instance) => {
    return ["Succeeded"].includes(getStateName(instance));
  };
  const isUpByIdFactory = ({ getById }) =>
    isUpByIdCore({
      isInstanceUp,
      getById,
    });

  const isOurMinion = ({ resource }) => AzTag.isOurMinion({ resource, config });

  const buildTags = () => ({
    [managedByKey]: managedByValue,
    [stageTagKey]: stage,
  });

  return [
    {
      // https://docs.microsoft.com/en-us/rest/api/resources/resourcegroups
      // GET    https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
      // PUT    https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
      // DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
      // LIST   https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups?api-version=2019-10-01

      type: "ResourceGroup",
      Client: ({ spec }) =>
        AzClient({
          spec,
          pathBase: `/subscriptions/${subscriptionId}/resourcegroups`,
          pathSuffix: () => "",
          queryParameters: () => "?api-version=2019-10-01",
          isUpByIdFactory,
          config,
          configDefault: ({ properties }) =>
            defaultsDeep({
              location,
              tags: buildTags(config),
            })(properties),
          cannotBeDeleted: ({ name }) => "NetworkWatcherRG" === name,
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtualnetworks
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/virtualNetworks?api-version=2020-05-01

      type: "VirtualNetwork",
      dependsOn: ["ResourceGroup"],
      Client: ({ spec }) =>
        AzClient({
          spec,
          pathBase: `/subscriptions/${subscriptionId}`,
          pathSuffix: ({ dependencies: { resourceGroup } }) => {
            assert(resourceGroup, "missing resourceGroup dependency");
            return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/virtualNetworks`;
          },
          pathSuffixList: () => `/providers/Microsoft.Network/virtualNetworks`,
          queryParameters: () => "?api-version=2020-05-01",
          isUpByIdFactory,
          config,
          configDefault: ({ properties }) =>
            defaultsDeep({
              location,
              tags: buildTags(config),
            })(properties),
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networksecuritygroups
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{networkSecurityGroupName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2020-05-01
      type: "SecurityGroup",
      dependsOn: ["ResourceGroup"],
      Client: ({ spec }) =>
        AzClient({
          spec,

          pathBase: `/subscriptions/${subscriptionId}`,
          pathSuffix: ({ dependencies: { resourceGroup } }) => {
            assert(resourceGroup, "missing resourceGroup dependency");
            return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/networkSecurityGroups`;
          },
          pathSuffixList: () =>
            `/providers/Microsoft.Network/networkSecurityGroups`,
          queryParameters: () => "?api-version=2020-05-01",
          isUpByIdFactory,
          config,
          configDefault: ({ properties }) =>
            defaultsDeep({
              location,
              tags: buildTags(config),
            })(properties),
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/publicipaddresses
      // GET, PUT, DELETE, LIST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/{publicIpAddressName}?api-version=2020-05-01
      // LISTALL                https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/publicIPAddresses?api-version=2020-05-01

      type: "PublicIpAddress",
      dependsOn: ["ResourceGroup"],

      Client: ({ spec }) =>
        AzClient({
          spec,
          pathBase: `/subscriptions/${subscriptionId}`,
          pathSuffix: ({ dependencies: { resourceGroup } }) => {
            assert(resourceGroup, "missing resourceGroup dependency");
            return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/publicIPAddresses`;
          },
          pathSuffixList: () =>
            `/providers/Microsoft.Network/publicIPAddresses`,
          queryParameters: () => "?api-version=2020-05-01",
          isUpByIdFactory,
          config,
          configDefault: ({ properties, dependencies }) => {
            return defaultsDeep({
              location,
              tags: buildTags(config),
              properties: {},
            })(properties);
          },
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{networkInterfaceName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkInterfaces?api-version=2020-05-01
      type: "NetworkInterface",
      dependsOn: [
        "ResourceGroup",
        "VirtualNetwork",
        "SecurityGroup",
        "PublicIpAddress",
      ],
      Client: ({ spec }) =>
        AzClient({
          spec,

          pathBase: `/subscriptions/${subscriptionId}`,
          pathSuffix: ({ dependencies: { resourceGroup } }) => {
            assert(resourceGroup, "missing resourceGroup dependency");
            return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/networkInterfaces`;
          },
          pathSuffixList: () =>
            `/providers/Microsoft.Network/networkInterfaces`,
          queryParameters: () => "?api-version=2020-05-01",
          config,
          configDefault: async ({ properties, dependencies }) => {
            const {
              securityGroup,
              virtualNetwork,
              subnet,
              publicIpAddress,
            } = dependencies;
            //TODO securityGroup not needed ?
            assert(securityGroup, "dependencies is missing securityGroup");
            assert(virtualNetwork, "dependencies is missing virtualNetwork");
            assert(subnet, "dependencies is missing subnet");
            assert(publicIpAddress, "dependencies is missing publicIpAddress");
            logger.debug(
              `NetworkInterface configDefault ${tos({
                properties,
                subnet,
                virtualNetwork,
              })}`
            );

            const findSubnetId = (subnetName, vnetLive) => {
              if (!vnetLive) {
                logger.debug(`findSubnetId no id yet`);
                return notAvailable(subnetName, "id");
              }
              assert(
                vnetLive.properties.subnets,
                "virtual network is missing subnets"
              );
              const subnet = vnetLive.properties.subnets.find(
                (item) => item.name === subnetName
              );
              if (!subnet) {
                const message = `cannot find subnet ${subnetName} in the virtual network subnet: ${tos(
                  { subnet: vnetLive.properties.subnet }
                )}`;
                logger.error(msg);
                throw { code: 422, message };
              }
              logger.debug(
                `findSubnetId ${tos({ subnetName, id: subnet.id })}`
              );

              return subnet.id;
            };
            return defaultsDeep({
              location,
              tags: buildTags(config),
              properties: {
                networkSecurityGroup: { id: getField(securityGroup, "id") },
                ipConfigurations: [
                  {
                    properties: {
                      subnet: {
                        id: findSubnetId(subnet, virtualNetwork.live),
                      },
                      ...(publicIpAddress && {
                        publicIPAddress: {
                          id: getField(publicIpAddress, "id"),
                        },
                      }),
                    },
                  },
                ],
              },
            })(properties);
          },
        }),
      isOurMinion,
    },

    {
      // https://docs.microsoft.com/en-us/rest/api/compute/virtualmachines
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2019-12-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2019-12-01

      type: "VirtualMachine",
      dependsOn: ["ResourceGroup", "NetworkInterface"],
      Client: ({ spec }) =>
        AzClient({
          spec,
          pathBase: `/subscriptions/${subscriptionId}`,
          pathSuffix: ({ dependencies: { resourceGroup } }) => {
            assert(resourceGroup, "missing resourceGroup dependency");
            return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Compute/virtualMachines`;
          },
          pathSuffixList: () => `/providers/Microsoft.Compute/virtualMachines`,
          queryParameters: () => "?api-version=2019-12-01",
          isUpByIdFactory,
          config,
          configDefault: ({ properties, dependencies }) => {
            const { networkInterface } = dependencies;
            assert(
              networkInterface,
              "networkInterfaces is missing VirtualMachine"
            );
            return defaultsDeep({
              location,
              tags: buildTags(config),
              properties: {
                networkProfile: {
                  networkInterfaces: [
                    {
                      id: getField(networkInterface, "id"),
                    },
                  ],
                },
              },
            })(properties);
          },
        }),
      isOurMinion,
    },
  ];
};

module.exports = AzureProvider = async ({ name = "azure", config }) => {
  const mandatoryEnvs = ["TENANT_ID", "SUBSCRIPTION_ID", "APP_ID", "PASSWORD"];
  checkEnv(mandatoryEnvs);

  const { TENANT_ID, APP_ID, PASSWORD } = process.env;
  const { bearerToken } = await AzAuthorize({
    tenantId: TENANT_ID,
    appId: APP_ID,
    password: PASSWORD,
  });

  const configProviderDefault = {
    bearerToken,
    retryCount: 60,
    retryDelay: 10e3,
  };

  const core = CoreProvider({
    type: "azure",
    name,
    mandatoryConfigKeys: ["location"],
    config: defaultsDeep(configProviderDefault)(config),
    fnSpecs,
  });

  return core;
};
