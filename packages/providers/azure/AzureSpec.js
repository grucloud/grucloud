const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit } = require("rubico");

const { defaultsDeep, pluck, isEmpty } = require("rubico/x");

const AzClient = require("./AzClient");
const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const AzTag = require("./AzTag");
const { getField, notAvailable } = require("@grucloud/core/ProviderCommon");
const { isUpByIdCore, compare, omitIfEmpty } = require("@grucloud/core/Common");
const { tos } = require("@grucloud/core/tos");

exports.fnSpecs = (config) => {
  const { location, managedByKey, managedByValue, stageTagKey, stage } = config;
  const subscriptionId = process.env.SUBSCRIPTION_ID;
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
    group: "resourceManagement",
    ids: [live.id.replace(`/providers/${live.type}/${live.name}`, "")],
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
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtual-networks
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/virtualNetworks?api-version=2020-05-01
        group: "virtualNetworks",
        type: "VirtualNetwork",
        dependsOn: ["resourceManagement::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "resourceManagement",
          },
        }),
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick(["addressSpace", "enableDdosProtection"]),
              ]),
            }),
          ]),
        Client: ({ spec }) =>
          AzClient({
            spec,
            pathBase: `/subscriptions/${subscriptionId}`,
            pathSuffix: ({ dependencies: { resourceGroup } }) => {
              assert(resourceGroup, "missing resourceGroup dependency");
              return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/virtualNetworks`;
            },
            pathSuffixList: () =>
              `/providers/Microsoft.Network/virtualNetworks`,
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
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-security-groups
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{networkSecurityGroupName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2020-05-01
        group: "virtualNetworks",
        type: "SecurityGroup",
        dependsOn: ["resourceManagement::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "resourceManagement",
          },
        }),
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick(["securityRules"]),
                assign({
                  securityRules: pipe([
                    get("securityRules"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            omit(["provisioningState"]),
                            omitIfEmpty([
                              "destinationAddressPrefixes",
                              "destinationPortRanges",
                              "sourceAddressPrefixes",
                              "sourcePortRanges",
                            ]),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                }),
              ]),
            }),
          ]),
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
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/public-ip-addresses
        // GET, PUT, DELETE, LIST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/{publicIpAddressName}?api-version=2020-05-01
        // LISTALL                https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/publicIPAddresses?api-version=2020-05-01
        group: "virtualNetworks",
        type: "PublicIpAddress",
        dependsOn: ["resourceManagement::ResourceGroup"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "resourceManagement",
          },
        }),
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick([
                  "publicIPAddressVersion",
                  "publicIPAllocationMethod",
                  "idleTimeoutInMinutes",
                ]),
              ]),
            }),
          ]),
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
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-interfaces
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{networkInterfaceName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkInterfaces?api-version=2020-05-01
        group: "virtualNetworks",
        type: "NetworkInterface",
        dependsOn: [
          "resourceManagement::ResourceGroup",
          "virtualNetworks::VirtualNetwork",
          "virtualNetworks::SecurityGroup",
          "virtualNetworks::PublicIpAddress",
        ],
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick(["ipConfigurations"]),
                assign({
                  ipConfigurations: pipe([
                    get("ipConfigurations"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            pick(["privateIPAllocationMethod"]),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                }),
              ]),
            }),
          ]),
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "resourceManagement",
          },
          virtualNetwork: {
            type: "VirtualNetwork",
            group: "virtualNetworks",
          },
          publicIpAddress: {
            type: "PublicIpAddress",
            group: "virtualNetworks",
          },
          securityGroup: { type: "SecurityGroup", group: "virtualNetworks" },
        }),
        compare: compare({
          filterTarget: pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
          filterLive: pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
        }),
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
                group: "virtualNetworks",
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
                group: "virtualNetworks",
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
                group: "virtualNetworks",
                ids: [get("properties.networkSecurityGroup.id")(live)],
              },
            ],
            config,
            configDefault: async ({ properties, dependencies }) => {
              const { securityGroup, virtualNetwork, subnet, publicIpAddress } =
                dependencies;
              assert(virtualNetwork, "dependencies is missing virtualNetwork");
              assert(subnet, "dependencies is missing subnet");
              assert(
                publicIpAddress,
                "dependencies is missing publicIpAddress"
              );
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
                    networkSecurityGroup: {
                      id: getField(securityGroup, "id"),
                    },
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
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/compute/virtual-machines
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/{vmName}?api-version=2019-12-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compute/virtualMachines?api-version=2019-12-01
        group: "compute",
        type: "VirtualMachine",
        dependsOn: [
          "resourceManagement::ResourceGroup",
          "virtualNetworks::NetworkInterface",
        ],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "resourceManagement",
          },
          networkInterface: {
            type: "NetworkInterface",
            group: "virtualNetworks",
          },
        }),
        environmentVariables: () => [
          {
            path: "properties.osProfile.adminPassword",
            suffix: "ADMIN_PASSWORD",
          },
        ],
        filterLive: () =>
          pipe([
            pick(["tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                pick([
                  "hardwareProfile",
                  "storageProfile.imageReference",
                  "osProfile",
                ]),
                omitIfEmpty(["osProfile.secrets"]),
              ]),
            }),
          ]),
        compare: compare({
          filterTarget: pipe([
            tap((params) => {
              assert(true);
            }),
            omit(["properties.osProfile.adminPassword"]),
          ]),
          filterLive: pipe([
            tap((params) => {
              assert(true);
            }),
          ]),
        }),
        Client: ({ spec }) =>
          AzClient({
            spec,
            pathBase: `/subscriptions/${subscriptionId}`,
            pathSuffix: ({ dependencies: { resourceGroup } }) => {
              assert(resourceGroup, "missing resourceGroup dependency");
              return `/resourceGroups/${resourceGroup.name}/providers/Microsoft.Compute/virtualMachines`;
            },
            pathSuffixList: () =>
              `/providers/Microsoft.Compute/virtualMachines`,
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
                group: "resourceManagement",
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
                group: "virtualNetworks",
                ids: pipe([
                  () => live,
                  get("properties.networkProfile.networkInterfaces"),
                  pluck("id"),
                ])(),
              },
            ],
          }),
      },
    ],
    map(defaultsDeep({ isOurMinion })),
  ])();
};
