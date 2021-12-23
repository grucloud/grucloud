const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit } = require("rubico");
const { defaultsDeep, pluck, isObject } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { tos } = require("@grucloud/core/tos");

const { findDependenciesResourceGroup, buildTags } = require("../AzureCommon");
const AzClient = require("../AzClient");

exports.fnSpecs = ({ config }) => {
  const { location } = config;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtual-networks
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/virtualNetworks?api-version=2020-05-01
        group: "Network",
        type: "VirtualNetwork",
        pickPropertiesCreate: [
          "properties.addressSpace.addressPrefixes",
          "properties.flowTimeoutInMinutes",
          "properties.enableDdosProtection",
          "properties.enableVmProtection",
          "properties.bgpCommunities.virtualNetworkCommunity",
          "properties.encryption.enabled",
          "properties.encryption.enforcement",
        ],
        pickProperties: [
          "properties.addressSpace.addressPrefixes",
          "properties.flowTimeoutInMinutes",
          "properties.enableDdosProtection",
          "properties.enableVmProtection",
          "properties.bgpCommunities.virtualNetworkCommunity",
          "properties.encryption.enabled",
          "properties.encryption.enforcement",
        ],
        Client: ({ spec }) =>
          AzClient({
            spec,
            config,
          }),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-security-groups
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{networkSecurityGroupName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2020-05-01
        group: "Network",
        type: "NetworkSecurityGroup",
        omitProperties: ["properties.securityRules"],
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
            config,
          }),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/public-ip-addresses
        // GET, PUT, DELETE, LIST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/{publicIpAddressName}?api-version=2020-05-01
        // LISTALL                https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/publicIPAddresses?api-version=2020-05-01
        group: "Network",
        type: "PublicIPAddress",
        propertiesDefault: {
          sku: { name: "Basic", tier: "Regional" },
          properties: {
            publicIPAddressVersion: "IPv4",
            publicIPAllocationMethod: "Dynamic",
            idleTimeoutInMinutes: 4,
          },
        },
        pickProperties: [],
        pickPropertiesCreate: [
          "sku.name",
          "sku.tier",
          "properties.publicIPAllocationMethod",
          "properties.publicIPAddressVersion",
          "properties.dnsSettings.domainNameLabel",
        ],
        Client: ({ spec }) =>
          AzClient({
            spec,
            config,
          }),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-interfaces
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{networkInterfaceName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkInterfaces?api-version=2020-05-01
        group: "Network",
        type: "NetworkInterface",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
          virtualNetwork: {
            type: "VirtualNetwork",
            group: "Network",
            createOnly: true,
          },
          publicIpAddress: {
            type: "PublicIPAddress",
            group: "Network",
            createOnly: true,
          },
          securityGroup: {
            type: "NetworkSecurityGroup",
            group: "Network",
            createOnly: true,
          },
          subnet: { type: "Subnet", group: "Network", createOnly: true },
        },
        propertiesDefault: {
          properties: {
            enableAcceleratedNetworking: false,
            enableIPForwarding: false,
          },
        },
        pickProperties: [
          "properties.enableAcceleratedNetworking",
          "properties.enableIPForwarding",
        ],
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
          {
            type: "VirtualNetwork",
            group: "Network",
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
            type: "PublicIPAddress",
            group: "Network",
            ids: pipe([
              () => live,
              get("properties.ipConfigurations"),
              pluck("properties"),
              pluck("publicIPAddress"),
              pluck("id"),
            ])(),
          },
          {
            type: "NetworkSecurityGroup",
            group: "Network",
            ids: [get("properties.networkSecurityGroup.id")(live)],
          },
          {
            type: "Subnet",
            group: "Network",
            ids: pipe([
              () => live,
              get("properties.ipConfigurations"),
              pluck("properties"),
              pluck("subnet"),
              pluck("id"),
            ])(),
          },
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
        configDefault: async ({ properties, dependencies }) => {
          assert(isObject(dependencies));
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

          return defaultsDeep({
            location,
            tags: buildTags(config),
            properties: {
              //TODO securityGroup => networkSecurityGroup
              ...(securityGroup && {
                networkSecurityGroup: {
                  id: getField(securityGroup, "id"),
                },
              }),
              ipConfigurations: [
                {
                  properties: {
                    subnet: {
                      id: getField(subnet, "id"),
                    },
                    //TODO
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
        Client: ({ spec }) =>
          AzClient({
            spec,
            config,
          }),
      },
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/subnets
      {
        group: "Network",
        type: "Subnet",
        pickProperties: [
          "properties.addressPrefix",
          "properties.addressPrefixes",
          "properties.serviceEndpoints",
          "properties.serviceEndpointPolicies",
          "properties.privateEndpointNetworkPolicies",
          "properties.privateLinkServiceNetworkPolicies",
          "properties.applicationGatewayIpConfigurations",
        ],
        pickPropertiesCreate: [
          "properties.addressPrefix",
          "properties.addressPrefixes",
          "properties.serviceEndpoints",
          "properties.serviceEndpointPolicies",
          "properties.privateEndpointNetworkPolicies",
          "properties.privateLinkServiceNetworkPolicies",
          "properties.applicationGatewayIpConfigurations",
        ],
        configDefault: ({ properties, dependencies }) => {
          return defaultsDeep({
            properties: {},
          })(properties);
        },
      },
      {
        group: "Network",
        type: "NetworkWatcher",
        ignoreResource: () => () => true,
        managedByOther: () => true,
        cannotBeDeleted: () => true,
      },
    ],
  ])();
};
