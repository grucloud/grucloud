const assert = require("assert");
const { defaultsDeep } = require("lodash/fp");
const CoreProvider = require("../CoreProvider");
const AzClient = require("./AzClient");
const logger = require("../../logger")({ prefix: "AzProvider" });
const AzTag = require("./AzTag");
const { getField, notAvailable } = require("../ProviderCommon");
const { AzAuthorize } = require("./AzAuthorize");
const { isUpByIdCore } = require("../Common");
//const compare = require("../../Utils").compare;
const tos = (x) => JSON.stringify(x, null, 4);

const fnSpecs = (config) => {
  const {
    location,
    subscriptionId,
    managedByKey,
    managedByValue,
    stageTagKey,
    stage,
  } = config;

  const getStateName = (instance) => {
    const { provisioningState } = instance.properties;
    assert(provisioningState);
    logger.debug(`stateName ${provisioningState}`);
    return provisioningState;
  };

  const isUpByIdFactory = (getById) =>
    isUpByIdCore({
      states: ["Succeeded"],
      getStateName,
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
            defaultsDeep(
              {
                location,
                tags: buildTags(config),
              },
              properties
            ),
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtualnetworks
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/virtualNetworks?api-version=2020-05-01

      type: "VirtualNetwork",
      Client: ({ spec }) =>
        AzClient({
          spec,
          dependsOn: ["ResourceGroup"],
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
            defaultsDeep(
              {
                location,
                tags: buildTags(config),
              },
              properties
            ),
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networksecuritygroups
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{networkSecurityGroupName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2020-05-01
      type: "SecurityGroup",
      Client: ({ spec }) =>
        AzClient({
          spec,
          dependsOn: ["ResourceGroup"],
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
            defaultsDeep(
              {
                location,
                tags: buildTags(config),
              },
              properties
            ),
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/publicipaddresses
      // GET, PUT, DELETE, LIST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/{publicIpAddressName}?api-version=2020-05-01
      // LISTALL                https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/publicIPAddresses?api-version=2020-05-01

      type: "PublicIpAddress",
      Client: ({ spec }) =>
        AzClient({
          spec,
          dependsOn: ["ResourceGroup"],
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
          configDefault: ({ properties, dependenciesLive }) => {
            return defaultsDeep(properties, {
              location,
              tags: buildTags(config),
              properties: {},
            });
          },
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networkinterfaces
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{networkInterfaceName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkInterfaces?api-version=2020-05-01
      type: "NetworkInterface",
      Client: ({ spec }) =>
        AzClient({
          spec,
          dependsOn: [
            "ResourceGroup",
            "VirtualNetwork",
            "SecurityGroup",
            "PublicIpAddress",
          ],
          pathBase: `/subscriptions/${subscriptionId}`,
          pathSuffix: ({ dependencies: { resourceGroup } }) => {
            assert(resourceGroup, "missing resourceGroup dependency");
            return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/networkInterfaces`;
          },
          pathSuffixList: () =>
            `/providers/Microsoft.Network/networkInterfaces`,
          queryParameters: () => "?api-version=2020-05-01",
          config,
          configDefault: async ({ properties, dependenciesLive }) => {
            const {
              securityGroup,
              virtualNetwork,
              subnet,
              publicIpAddress,
            } = dependenciesLive;
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
                return notAvailable(subnetName);
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
            return defaultsDeep(
              {
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
              },
              properties
            );
          },
        }),
      isOurMinion,
    },

    {
      // https://docs.microsoft.com/en-us/rest/api/compute/virtualmachines
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2019-12-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2019-12-01

      type: "VirtualMachine",
      Client: ({ spec }) =>
        AzClient({
          spec,
          dependsOn: ["ResourceGroup", "NetworkInterface"],
          pathBase: `/subscriptions/${subscriptionId}`,
          pathSuffix: ({ dependencies: { resourceGroup } }) => {
            assert(resourceGroup, "missing resourceGroup dependency");
            return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Compute/virtualMachines`;
          },
          pathSuffixList: () => `/providers/Microsoft.Compute/virtualMachines`,
          queryParameters: () => "?api-version=2019-12-01",
          isUpByIdFactory,
          config,
          configDefault: ({ properties, dependenciesLive }) => {
            const { networkInterface } = dependenciesLive;
            assert(
              networkInterface,
              "networkInterfaces is missing VirtualMachine"
            );
            return defaultsDeep(properties, {
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
            });
          },
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
    config: defaultsDeep(configProviderDefault, config),
    fnSpecs,
  });

  return core;
};
