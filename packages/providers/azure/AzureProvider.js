const assert = require("assert");
const { pipe, eq, get, tap, filter, map } = require("rubico");

const { defaultsDeep, isFunction, pluck, find } = require("rubico/x");

const CoreProvider = require("@grucloud/core/CoreProvider");
const AzClient = require("./AzClient");
const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const AzTag = require("./AzTag");
const { getField, notAvailable } = require("@grucloud/core/ProviderCommon");
const { AzAuthorize } = require("./AzAuthorize");
const { isUpByIdCore } = require("@grucloud/core/Common");
const { checkEnv } = require("@grucloud/core/Utils");
const { tos } = require("@grucloud/core/tos");

const fnSpecs = (config) => {
  const {
    location,
    managedByKey,
    managedByValue,
    stageTagKey,
    stage,
    providerName,
  } = config;
  const subscriptionId = process.env.SUBSCRIPTION_ID;
  assert(providerName);
  //TODO move isInstanceUp and  isUpByIdFactory in AzClient
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

  const isOurMinion = AzTag.isOurMinion;

  const buildTags = () => ({
    [managedByKey]: managedByValue,
    [stageTagKey]: stage,
  });

  const isDefaultResourceGroup = eq(get("live.name"), "NetworkWatcherRG");

  const findDependenciesResourceGroup = ({ live }) => ({
    type: "ResourceGroup",
    ids: [live.id.replace(`/providers/${live.type}/${live.name}`, "")],
  });

  return [
    {
      // https://docs.microsoft.com/en-us/rest/api/resources/resource-groups
      // GET    https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
      // PUT    https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
      // DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2019-10-01
      // LIST   https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups?api-version=2019-10-01
      group: "resourceManagement",
      type: "ResourceGroup",
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
          cannotBeDeleted: isDefaultResourceGroup,
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtual-networks
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/virtualNetworks?api-version=2020-05-01
      group: "virtualNetworks",
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
          isInstanceUp,
          findDependencies: ({ live }) => [
            findDependenciesResourceGroup({ live }),
          ],
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
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-security-groups
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{networkSecurityGroupName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2020-05-01
      group: "virtualNetworks",
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
          isInstanceUp,
          config,
          configDefault: ({ properties }) =>
            defaultsDeep({
              location,
              tags: buildTags(config),
            })(properties),
          findDependencies: ({ live }) => [
            findDependenciesResourceGroup({ live }),
          ],
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/public-ip-addresses
      // GET, PUT, DELETE, LIST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/{publicIpAddressName}?api-version=2020-05-01
      // LISTALL                https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/publicIPAddresses?api-version=2020-05-01
      group: "virtualNetworks",
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
          isInstanceUp,
          config,
          configDefault: ({ properties, dependencies }) => {
            return defaultsDeep({
              location,
              tags: buildTags(config),
              properties: {},
            })(properties);
          },
          findDependencies: ({ live }) => [
            findDependenciesResourceGroup({ live }),
          ],
        }),
      isOurMinion,
    },
    {
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-interfaces
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{networkInterfaceName}?api-version=2020-05-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkInterfaces?api-version=2020-05-01
      group: "virtualNetworks",
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
          isInstanceUp,
          findDependencies: ({ live, lives }) => [
            findDependenciesResourceGroup({ live }),
            {
              type: "VirtualNetwork",
              ids: pipe([
                () => live,
                get("properties.ipConfigurations"),
                map(
                  pipe([
                    get("properties.subnet.id"),
                    (id) => id.replace(/\/subnet.+$/g, ""),
                  ])
                ),
              ])(),
            },
            {
              type: "PublicIpAddress",
              ids: pipe([
                () => live,
                get("properties.ipConfigurations"),
                pluck("properties"),
                pluck("publicIPAddress"),
                pluck("id"),
              ])(),
            },
            {
              type: "SecurityGroup",
              ids: [get("properties.networkSecurityGroup.id")(live)],
            },
          ],
          config,
          configDefault: async ({ properties, dependencies }) => {
            const { securityGroup, virtualNetwork, subnet, publicIpAddress } =
              dependencies;
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
                ...(securityGroup && {
                  networkSecurityGroup: { id: getField(securityGroup, "id") },
                }),
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
      // https://docs.microsoft.com/en-us/rest/api/compute/virtual-machines
      // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2019-12-01
      // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2019-12-01
      group: "compute",
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
          isInstanceUp,
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
          findDependencies: ({ live }) => [
            {
              type: "ResourceGroup",
              ids: pipe([
                () => [
                  live.id
                    .replace(`/providers/${live.type}/${live.name}`, "")
                    .toLowerCase()
                    .replace("resourcegroups", "resourceGroups"),
                ],
              ])(),
            },
            {
              type: "NetworkInterface",
              ids: pipe([
                () => live,
                get("properties.networkProfile.networkInterfaces"),
                pluck("id"),
              ])(),
            },
          ],
        }),
      isOurMinion,
    },
  ];
};

exports.AzureProvider = ({ name = "azure", config, ...other }) => {
  assert(isFunction(config), "config must be a function");

  const mandatoryEnvs = ["TENANT_ID", "SUBSCRIPTION_ID", "APP_ID", "PASSWORD"];

  const { TENANT_ID, APP_ID, PASSWORD, SUBSCRIPTION_ID } = process.env;

  let bearerToken;
  const start = async () => {
    checkEnv(mandatoryEnvs);
    const result = await AzAuthorize({
      tenantId: TENANT_ID,
      appId: APP_ID,
      password: PASSWORD,
    });
    bearerToken = result.bearerToken;
  };

  const configProviderDefault = {
    bearerToken: () => bearerToken,
    retryCount: 60,
    retryDelay: 10e3,
  };

  const info = () => ({
    subscriptionId: SUBSCRIPTION_ID,
    tenantId: TENANT_ID,
    appId: APP_ID,
  });

  const core = CoreProvider({
    ...other,
    type: "azure",
    name,
    mandatoryConfigKeys: ["location"],
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
