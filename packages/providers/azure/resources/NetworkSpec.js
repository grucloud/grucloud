const assert = require("assert");
const {
  pipe,
  eq,
  get,
  tap,
  pick,
  map,
  assign,
  omit,
  switchCase,
} = require("rubico");
const { defaultsDeep, pluck, isObject, when, flatten } = require("rubico/x");

const logger = require("@grucloud/core/logger")({ prefix: "AzProvider" });
const { getField } = require("@grucloud/core/ProviderCommon");
const { omitIfEmpty, compare } = require("@grucloud/core/Common");
const { tos } = require("@grucloud/core/tos");

const {
  findDependenciesResourceGroup,
  buildTags,
  configDefaultDependenciesId,
  configDefaultGeneric,
  assignDependenciesId,
} = require("../AzureCommon");

const group = "Network";

exports.fnSpecs = ({ config }) => {
  const { location } = config;

  return pipe([
    () => [
      {
        type: "LoadBalancer",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          publicIPAddresses: {
            type: "PublicIPAddress",
            group: "Network",
            createOnly: true,
            list: true,
          },
        },
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
          {
            type: "LoadBalancerBackendAddressPool",
            group: "Network",
            ids: pipe([
              () => live,
              get("properties.backendAddressPools"),
              pluck("properties"),
              pluck("loadBalancerBackendAddresses"),
              flatten,
              pluck("id"),
            ])(),
          },
          {
            type: "PublicIPAddress",
            group: "Network",
            ids: pipe([
              () => live,
              get("properties.frontendIPConfigurations"),
              pluck("properties"),
              pluck("publicIPAddress"),
              pluck("id"),
            ])(),
          },
        ],
        omitProperties: [
          "properties.frontendIPConfigurations",
          "properties.backendAddressPools",
        ],
        filterLive: ({ lives }) =>
          pipe([
            pick(["sku", "tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                omit(["provisioningState", "resourceGuid"]),
                assign({
                  frontendIPConfigurations: pipe([
                    get("frontendIPConfigurations"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            assign({
                              publicIPAddress: pipe([
                                get("publicIPAddress"),
                                assignDependenciesId({
                                  group: "Network",
                                  type: "PublicIPAddress",
                                  lives,
                                }),
                              ]),
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  backendAddressPools: pipe([
                    get("backendAddressPools"),
                    tap((params) => {
                      assert(true);
                    }),
                    map(
                      pipe([
                        tap((params) => {
                          assert(true);
                        }),
                        pick(["name" /*"properties"*/]),
                        // assign({
                        //   properties: pipe([get("properties")]),
                        // }),
                      ])
                    ),
                  ]),
                  /*
                  loadBalancingRules: [],
        probes: [],
        inboundNatRules: [],
        inboundNatPools: [],
        outboundRules: [],
                  */
                }),
              ]),
            }),
            tap((params) => {
              assert(true);
            }),
          ]),
      },
      {
        type: "LoadBalancerBackendAddressPool",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          loadBalancer: {
            type: "LoadBalancer",
            group: "Network",
            name: "loadBalancerName",
          },
          virtualNetworks: {
            type: "VirtualNetwork",
            group: "Network",
            createOnly: true,
            list: true,
          },
        },
        pickProperties: [],
        // findDependencies: ({ live, lives }) => [
        //   findDependenciesResourceGroup({ live, lives, config }),
        //   {
        //     type: "VirtualNetwork",
        //     group: "Network",
        //     ids: pipe([
        //       () => live,
        //       get("properties.loadBalancerBackendAddresses"),
        //       pluck("properties"),
        //       pluck("virtualNetwork"),
        //       flatten,
        //       pluck("id"),
        //     ])(),
        //   },
        // ],
        filterLive: () =>
          pipe([
            pick(["properties"]),
            assign({
              properties: pipe([
                get("properties"),
                omit([
                  "provisioningState",
                  "backendIPConfigurations",
                  "loadBalancerBackendAddresses",
                ]),
                // assign({
                //   loadBalancerBackendAddresses: pipe([
                //     get("loadBalancerBackendAddresses"),
                //     map(
                //       assign({
                //         properties: pipe([
                //           get("properties"),
                //           assign({
                //             virtualNetwork: pipe([
                //               get("virtualNetwork"),
                //               assignDependenciesId({
                //                 group: "Network",
                //                 type: "VirtualNetwork",
                //                 lives,
                //               }),
                //             ]),
                //           }),
                //         ]),
                //       })
                //     ),
                //   ]),
                // }),
              ]),
            }),
          ]),
        configDefault: ({ properties, dependencies, config, spec }) =>
          pipe([
            () => properties,
            tap((params) => {
              assert(true);
            }),
          ])(),
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/virtual-networks
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/virtualNetworks/{virtualNetworkName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/virtualNetworks?api-version=2020-05-01
        type: "VirtualNetwork",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          // "natGateway": {
          //     "type": "NatGateway",
          //     "group": "Network",
          //     "createOnly": true
          // },
          // "ddosProtectionPlan": {
          //     "type": "DdosProtectionPlan",
          //     "group": "Network",
          //     "createOnly": true
          // }
        },
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
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-security-groups
        // GET, PUT, DELETE, LIST: https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Network/networkSecurityGroups/{networkSecurityGroupName}?api-version=2020-05-01
        // LISTALL                 https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Network/networkSecurityGroups?api-version=2020-05-01
        type: "NetworkSecurityGroup",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          //TODO
          // dscpConfiguration: {
          //   type: "DscpConfiguration",
          //   group: "Network",
          //   createOnly: true,
          // },
          // workspace: {
          //   type: "Workspace",
          //   group: "OperationalInsights",
          //   createOnly: true,
          // },
        },
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
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/public-ip-addresses
        type: "PublicIPAddress",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          //TODO
          // dscpConfiguration: {
          //   type: "DscpConfiguration",
          //   group: "Network",
          //   createOnly: true,
          // },
          // workspace: {
          //   type: "Workspace",
          //   group: "OperationalInsights",
          //   createOnly: true,
          // },
          //TODO
          // ddosCustomPolicy: {
          //   type: "DdosCustomPolicy",
          //   group: "Network",
          //   createOnly: true,
          // },
          // publicIpPrefix: {
          //   type: "PublicIPPrefix",
          //   group: "Network",
          //   createOnly: true,
          // },
        },
        configDefault: ({ properties, dependencies, config, spec }) =>
          pipe([
            () => properties,
            defaultsDeep(
              configDefaultGeneric({
                properties,
                dependencies,
                config,
                spec,
              })
            ),
            defaultsDeep(
              configDefaultDependenciesId({
                properties,
                dependencies,
                config,
                spec,
              })
            ),
          ])(),
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
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-interfaces
        type: "NetworkInterface",
        includeDefaultDependencies: true,
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
            pick(["name", "tags", "properties"]),
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
      },
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/subnets
      {
        type: "Subnet",
        isDefault: () => false,
        managedByOther: () => false,
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          //TODO
          // workspace: {
          //   type: "Workspace",
          //   group: "OperationalInsights",
          //   createOnly: true,
          // },
          // ddosCustomPolicy: {
          //   type: "DdosCustomPolicy",
          //   group: "Network",
          //   createOnly: true,
          // },
          // publicIpPrefix: {
          //   type: "PublicIPPrefix",
          //   group: "Network",
          //   createOnly: true,
          // },
          virtualNetwork: {
            type: "VirtualNetwork",
            group: "Network",
            name: "virtualNetworkName",
          },
          natGateway: {
            type: "NatGateway",
            group: "Network",
            createOnly: true,
            pathId: "properties.natGateway.id",
          },
        },
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
        //TODO use filterLive in compare
        compare: compare({
          filterAll: pipe([
            tap((params) => {
              assert(true);
            }),
            omit([
              "properties.provisioningState",
              "properties.ipConfigurations",
            ]),
            omitIfEmpty(["properties.delegations"]),
            pick(["properties"]),
            assign({
              properties: pipe([
                get("properties"),
                assign({
                  serviceEndpoints: pipe([
                    get("serviceEndpoints"),
                    map(omit(["provisioningState"])),
                  ]),
                }),
              ]),
            }),
            tap((params) => {
              assert(true);
            }),
          ]),
        }),
        filterLive: ({ pickPropertiesCreate }) =>
          pipe([
            tap((params) => {
              assert(pickPropertiesCreate);
            }),
            pick(["name", ...pickPropertiesCreate]),
            assign({
              properties: pipe([
                get("properties"),
                assign({
                  serviceEndpoints: pipe([
                    get("serviceEndpoints"),
                    map(omit(["provisioningState"])),
                  ]),
                }),
                omitIfEmpty(["serviceEndpoints"]),
              ]),
            }),
          ]),
        configDefault: ({ properties, dependencies, config, spec }) =>
          pipe([
            () => properties,
            defaultsDeep({
              properties: {},
            }),
            defaultsDeep(
              configDefaultDependenciesId({
                properties,
                dependencies,
                config,
                spec,
              })
            ),
          ])(),
      },
      // {
      //   group: "Network",
      //   type: "NatRule",
      //   dependencies: {
      //     resourceGroup: {
      //       type: "ResourceGroup",
      //       group: "Resources",
      //       name: "resourceGroupName",
      //     },
      //     gateway: {
      //       type: "VpnGateway",
      //       group: "Compute",
      //       createOnly: true,
      //       optional: true,
      //     },
      //   },
      // },
      {
        group: "Network",
        type: "NetworkWatcher",
        ignoreResource: () => () => true,
        managedByOther: () => true,
        cannotBeDeleted: () => true,
      },
      {
        type: "NatGateway",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
          },
          publicIpAddresses: {
            type: "PublicIPAddress",
            group: "Network",
            list: true,
            createOnly: true,
          },
        },
        pickPropertiesCreate: [
          "sku.name",
          "properties.idleTimeoutInMinutes",
          "properties.publicIpPrefixes",
          "zones",
        ],
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
          {
            type: "PublicIPAddress",
            group: "Network",
            ids: pipe([
              () => live,
              get("properties.publicIpAddresses"),
              pluck("id"),
            ])(),
          },
        ],
        configDefault: ({ properties, dependencies, config, spec }) =>
          pipe([
            () => properties,
            defaultsDeep(
              configDefaultGeneric({
                properties,
                dependencies,
                config,
                spec,
              })
            ),
            when(
              () => dependencies.publicIpAddresses,
              defaultsDeep({
                properties: {
                  publicIpAddresses: pipe([
                    () => dependencies.publicIpAddresses,
                    map((ipAddress) => ({ id: getField(ipAddress, "id") })),
                  ])(),
                },
              })
            ),
          ])(),
      },
    ],
    map(defaultsDeep({ group })),
  ])();
};
