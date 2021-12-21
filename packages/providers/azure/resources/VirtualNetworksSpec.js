const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit, any } = require("rubico");

const { defaultsDeep, pluck, flatten, find, callProp } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { tos } = require("@grucloud/core/tos");
const { retryCallOnError } = require("@grucloud/core/Retry");

const { findDependenciesResourceGroup, buildTags } = require("../AzureCommon");
const AzClient = require("../AzClient");

exports.fnSpecs = ({ config }) => {
  const { location } = config;
  const subscriptionId = process.env.SUBSCRIPTION_ID;

  return pipe([
    () => [
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtual-networks
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/virtualNetworks?api-version=2020-05-01
        group: "Network",
        type: "VirtualNetwork",
        //TODO remove filterLive and replace with pickPropertiesCreate
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
        pickProperties: [
          "extendedLocation.name",
          "extendedLocation.type",
          "properties.addressSpace.addressPrefixes",
          "properties.dhcpOptions.dnsServers",
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
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
            ],
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
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
            ],
          }),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/public-ip-addresses
        // GET, PUT, DELETE, LIST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/publicIPAddresses/{publicIpAddressName}?api-version=2020-05-01
        // LISTALL                https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/publicIPAddresses?api-version=2020-05-01
        group: "Network",
        type: "PublicIPAddress",
        propertiesDefault: {},
        pickProperties: [],
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
            config,
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
            ],
          }),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-interfaces
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkInterfaces/{networkInterfaceName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkInterfaces?api-version=2020-05-01
        group: "Network",
        type: "NetworkInterface",
        dependencies: () => ({
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
        }),
        propertiesDefault: {},
        pickProperties: [],
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
        Client: ({ spec }) =>
          AzClient({
            spec,
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
          }),
      },
      // GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/Network/{virtualNetworkName}/subnets?api-version=2021-02-01
      // DELETE https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/Network/{virtualNetworkName}/subnets/{subnetName}?api-version=2021-04-01
      {
        group: "Network",
        type: "Subnet",
        dependsOnList: ["Network::VirtualNetwork"],
        dependencies: () => ({
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
          },
          virtualNetwork: {
            type: "VirtualNetwork",
            group: "Network",
          },
        }),
        isOurMinion: ({ live, lives }) =>
          pipe([
            () =>
              lives.getByType({
                providerName: config.providerName,
                type: "VirtualNetwork",
                group: "Network",
              }),
            find(
              pipe([
                get("live.properties.subnets"),
                any(eq(get("id"), live.id)),
              ])
            ),
            get("managedByUs"),
          ])(),
        filterLive: () =>
          pipe([
            pick(["properties"]),
            assign({
              properties: pipe([get("properties"), pick(["addressPrefix"])]),
            }),
          ]),
        pickProperties: [],
        Client: ({ spec, config }) =>
          AzClient({
            findDependencies: ({ live, lives }) => [
              findDependenciesResourceGroup({ live, lives, config }),
              {
                type: "VirtualNetwork",
                group: "Network",
                ids: [
                  pipe([
                    () => live,
                    get("id"),
                    callProp("split", "/"),
                    (arr) => arr[8],
                    (virtualNetwork) =>
                      lives.getByName({
                        name: virtualNetwork,
                        providerName: config.providerName,
                        type: "VirtualNetwork",
                        group: "Network",
                      }),
                    get("id"),
                  ])(),
                ],
              },
            ],
            getList: ({ axios }) =>
              pipe([
                tap((params) => {
                  assert(true);
                }),
                ({ lives }) =>
                  lives.getByType({
                    providerName: config.providerName,
                    type: "VirtualNetwork",
                    group: "Network",
                  }),
                pluck("live"),
                pluck("properties"),
                pluck("subnets"),
                flatten,
              ]),
            getByName:
              ({ axios }) =>
              ({ name, dependencies }) =>
                pipe([
                  dependencies,
                  tap(({ resourceGroup, virtualNetwork }) => {
                    assert(resourceGroup);
                    assert(virtualNetwork);
                  }),
                  ({ resourceGroup, virtualNetwork }) =>
                    `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup.name}/providers/Microsoft.Network/virtualNetworks/${virtualNetwork.name}/subnets/${name}?api-version=2021-02-01`,
                  (path) =>
                    retryCallOnError({
                      name: `getByName subnet ${path}`,
                      fn: () => axios.get(path),
                      config,
                    }),
                  get("data"),
                  tap((data) => {
                    logger.debug(`getByName subnet ${tos(data)}`);
                  }),
                ])(),
            spec,
            config,
            configDefault: ({ properties, dependencies }) => {
              return defaultsDeep({
                properties: {},
              })(properties);
            },
          }),
      },
    ],
  ])();
};
