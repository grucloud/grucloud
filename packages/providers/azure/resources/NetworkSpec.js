const assert = require("assert");
const { pipe, eq, get, tap, pick, map, assign, omit } = require("rubico");
const {
  defaultsDeep,
  pluck,
  isObject,
  when,
  isEmpty,
  unless,
  callProp,
} = require("rubico/x");

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

const pickSubProps = pipe([
  pick(["properties"]),
  omit(["properties.provisioningState"]),
]);

const assignApplicationGatewayDependencyId = ({ config }) =>
  assign({
    id: pipe([
      get("id"),
      tap((id) => {
        assert(id);
      }),
      callProp("replace", config.subscriptionId, "${config.subscriptionId}"),
      (id) => () => "`" + id + "`",
    ]),
  });

const applicationGatewayOmitIfEmpty = omitIfEmpty([
  "sslCertificates",
  "trustedRootCertificates",
  "trustedClientCertificates",
  "sslProfiles",
  "loadDistributionPolicies",
  "urlPathMaps",
  "probes",
  "rewriteRuleSets",
  "redirectConfigurations",
  "privateLinkConfigurations",
  "privateEndpointConnections",
]);

exports.fnSpecs = ({ config }) => {
  const { location } = config;

  return pipe([
    () => [
      {
        type: "ApplicationGateway",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          managedIdentities: {
            type: "UserAssignedIdentity",
            group: "ManagedIdentity",
            createOnly: true,
            list: true,
          },
          subnets: {
            type: "Subnet",
            group: "Network",
            createOnly: true,
            list: true,
          },
          publicIpAddresses: {
            type: "PublicIPAddress",
            group: "Network",
            createOnly: true,
            list: true,
          },
          firewallPolicy: {
            type: "FirewallPolicy",
            group: "Network",
            createOnly: true,
            pathId: "properties.firewallPolicy.id",
          },
        },
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
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
          {
            type: "Subnet",
            group: "Network",
            ids: pipe([
              () => live,
              get("properties.gatewayIPConfigurations"),
              pluck("properties.subnet.id"),
              tap((params) => {
                assert(true);
              }),
            ])(),
          },
        ],
        // propertiesDefault: {
        //   sslCertificates: [],
        //   trustedRootCertificates: [],
        //   trustedClientCertificates: [],
        //   sslProfiles: [],
        //   loadDistributionPolicies: [],
        //   urlPathMaps: [],
        //   probes: [],
        //   rewriteRuleSets: [],
        //   redirectConfigurations: [],
        //   privateLinkConfigurations: [],
        //   privateEndpointConnections: [],
        // },
        filterLive: ({ lives }) =>
          pipe([
            pick(["name", "sku", "tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                omit(["provisioningState", "resourceGuid", "operationalState"]),
                applicationGatewayOmitIfEmpty,
                assign({
                  gatewayIPConfigurations: pipe([
                    get("gatewayIPConfigurations"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            pick(["subnet"]),
                            assign({
                              subnet: pipe([
                                get("subnet"),
                                assignDependenciesId({
                                  group: "Network",
                                  type: "Subnet",
                                  lives,
                                }),
                              ]),
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  frontendIPConfigurations: pipe([
                    get("frontendIPConfigurations"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            pick(["publicIPAddress"]),
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
                  frontendPorts: pipe([
                    get("frontendPorts"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([get("properties"), pick(["port"])]),
                        }),
                      ])
                    ),
                  ]),
                  backendAddressPools: pipe([
                    get("backendAddressPools"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            omit([
                              "provisioningState",
                              "backendAddresses",
                              "backendIPConfigurations",
                              "requestRoutingRules",
                            ]),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  backendHttpSettingsCollection: pipe([
                    get("backendHttpSettingsCollection"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            omit(["provisioningState", "requestRoutingRules"]),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  httpListeners: pipe([
                    get("httpListeners"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            omit(["provisioningState", "requestRoutingRules"]),
                            assign({
                              frontendIPConfiguration: pipe([
                                get("frontendIPConfiguration"),
                                assignApplicationGatewayDependencyId({
                                  config,
                                }),
                              ]),
                            }),
                            assign({
                              frontendPort: pipe([
                                get("frontendPort"),
                                assignApplicationGatewayDependencyId({
                                  config,
                                }),
                              ]),
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  requestRoutingRules: pipe([
                    get("requestRoutingRules"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            omit(["provisioningState"]),
                            assign({
                              httpListener: pipe([
                                get("httpListener"),
                                assignApplicationGatewayDependencyId({
                                  config,
                                }),
                              ]),
                            }),
                            assign({
                              backendAddressPool: pipe([
                                get("backendAddressPool"),
                                assignApplicationGatewayDependencyId({
                                  config,
                                }),
                              ]),
                            }),
                            assign({
                              backendHttpSettings: pipe([
                                get("backendHttpSettings"),
                                assignApplicationGatewayDependencyId({
                                  config,
                                }),
                              ]),
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                }),
              ]),
            }),
          ]),
        compare: compare({
          filterAll: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              pick(["properties"]),
              assign({
                properties: pipe([
                  get("properties"),
                  omit([
                    "provisioningState",
                    "resourceGuid",
                    "operationalState",
                  ]),
                  applicationGatewayOmitIfEmpty,
                  assign({
                    gatewayIPConfigurations: pickSubProps,
                    frontendIPConfigurations: pickSubProps,
                    frontendPorts: pickSubProps,
                    backendAddressPools: pickSubProps,
                    backendHttpSettingsCollection: pickSubProps,
                    httpListeners: pickSubProps,
                    requestRoutingRules: pickSubProps,
                  }),
                ]),
              }),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
      },
      {
        type: "RouteTable",
        omitProperties: ["properties.routes"],
        filterLive: ({ pickPropertiesCreate }) =>
          pipe([
            tap((params) => {
              assert(pickPropertiesCreate);
            }),
            pick(pickPropertiesCreate),
            omit(["properties.routes"]),
          ]),
      },
      {
        type: "Route",
        configDefault: ({ properties, dependencies, config, spec }) =>
          pipe([() => properties])(),
      },
      {
        type: "LoadBalancer",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
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
        //TODO
        // omitProperties: [
        //   "properties.frontendIPConfigurations",
        //   "properties.backendAddressPools",
        // ],
        compare: compare({
          filterAll: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              omit([
                "properties.frontendIPConfigurations",
                "properties.backendAddressPools",
              ]),
              pick(["properties"]),
              assign({
                properties: pipe([
                  get("properties"),
                  omit(["provisioningState", "resourceGuid"]),
                  assign({
                    outboundRules: pipe([
                      get("outboundRules"),
                      map(
                        pipe([
                          omit(["properties.provisioningState"]),
                          pick(["properties"]),
                        ])
                      ),
                    ]),
                  }),
                ]),
              }),
              tap((params) => {
                assert(true);
              }),
            ]),
        }),
        filterLive: ({ lives }) =>
          pipe([
            pick(["name", "sku", "tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                omit([
                  "provisioningState",
                  "resourceGuid",
                  "backendAddressPools",
                ]),
                assign({
                  frontendIPConfigurations: pipe([
                    get("frontendIPConfigurations"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            pick(["publicIPAddress"]),
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
                  loadBalancingRules: pipe([
                    get("loadBalancingRules"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            omit(["provisioningState", "backendAddressPool"]),
                            assign({
                              backendAddressPools: pipe([
                                get("backendAddressPools"),
                                map(
                                  assignDependenciesId({
                                    group: "Network",
                                    type: "LoadBalancerBackendAddressPool",
                                    lives,
                                  })
                                ),
                              ]),
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  probes: pipe([
                    get("probes"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            pick([
                              "protocol",
                              "port",
                              "requestPath",
                              "intervalInSeconds",
                              "numberOfProbes",
                            ]),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  outboundRules: pipe([
                    get("outboundRules"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            pick([
                              "allocatedOutboundPorts",
                              "protocol",
                              "enableTcpReset",
                              "idleTimeoutInMinutes",
                              "backendAddressPool",
                              "frontendIPConfigurations",
                            ]),
                            assign({
                              backendAddressPool: pipe([
                                get("backendAddressPool"),
                                assignDependenciesId({
                                  group: "Network",
                                  type: "LoadBalancerBackendAddressPool",
                                  lives,
                                }),
                              ]),
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  /*
                  //TODO
        inboundNatRules: [],
        inboundNatPools: [],
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
            parent: true,
          },
          loadBalancer: {
            type: "LoadBalancer",
            group: "Network",
            name: "loadBalancerName",
            parent: true,
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
            pick(["name", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                tap((params) => {
                  assert(true);
                }),
                omit([
                  "provisioningState",
                  "backendIPConfigurations",
                  "loadBalancerBackendAddresses",
                  "loadBalancingRules",
                  "outboundRules",
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
            parent: true,
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
            parent: true,
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
            pick(["name", "tags", "properties"]),
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
            parent: true,
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
        type: "AzureFirewall",
        apiVersion: "2021-05-01",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          subnets: {
            type: "Subnet",
            group: "Network",
            createOnly: true,
            list: true,
          },
          publicIpAddresses: {
            type: "PublicIPAddress",
            group: "Network",
            createOnly: true,
            list: true,
          },
          virtualHub: {
            type: "VirtualHub",
            group: "Network",
            createOnly: true,
            pathId: "properties.virtualHub.id",
          },
          firewallPolicy: {
            type: "FirewallPolicy",
            group: "Network",
            createOnly: true,
            pathId: "properties.firewallPolicy.id",
          },
        },
        findDependencies: ({ live, lives }) => [
          findDependenciesResourceGroup({ live, lives, config }),
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
          //TODO create findDependenciesDependencyId
          {
            type: "VirtualHub",
            group: "Network",
            ids: [pipe([() => live, get("properties.virtualHub.id")])()],
          },
          {
            type: "FirewallPolicy",
            group: "Network",
            ids: [pipe([() => live, get("properties.firewallPolicy.id")])()],
          },
        ],
        omitProperties: ["properties.ipConfigurations"],
        filterLive: ({ lives }) =>
          pipe([
            pick(["name", "sku", "tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                //pick(["ipConfigurations"]),
                omit(["provisioningState"]),
                assign({
                  firewallPolicy: pipe([
                    get("firewallPolicy"),
                    assignDependenciesId({
                      group: "Network",
                      type: "FirewallPolicy",
                      lives,
                    }),
                  ]),
                  ipConfigurations: pipe([
                    get("ipConfigurations"),
                    map(
                      pipe([
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            pick(["subnet", "publicIPAddress"]),
                            assign({
                              subnet: pipe([
                                get("subnet"),
                                assignDependenciesId({
                                  group: "Network",
                                  type: "Subnet",
                                  lives,
                                }),
                              ]),
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
                }),
              ]),
            }),
          ]),
      },
      {
        type: "FirewallPolicy",
        group: "Network",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          managedIdentities: {
            type: "UserAssignedIdentity",
            group: "ManagedIdentity",
            createOnly: true,
            list: true,
          },
          workspace: {
            type: "Workspace",
            group: "OperationalInsights",
            createOnly: true,
            list: true,
          },
        },
      },
      {
        // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/network-interfaces
        type: "NetworkInterface",
        includeDefaultDependencies: true,
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            parent: true,
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
            parent: true,
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
            parent: true,
          },
          natGateway: {
            type: "NatGateway",
            group: "Network",
            createOnly: true,
            pathId: "properties.natGateway.id",
          },
        },
        omitProperties: [
          "properties.routeTable",
          "properties.networkSecurityGroup",
          "properties.applicationGatewayIPConfigurations",
        ],
        pickProperties: [
          "properties.addressPrefix",
          "properties.addressPrefixes",
          "properties.serviceEndpoints",
          "properties.serviceEndpointPolicies",
          "properties.privateEndpointNetworkPolicies",
          "properties.privateLinkServiceNetworkPolicies",
        ],
        pickPropertiesCreate: [
          "properties.addressPrefix",
          "properties.addressPrefixes",
          "properties.serviceEndpoints",
          "properties.serviceEndpointPolicies",
          "properties.privateEndpointNetworkPolicies",
          "properties.privateLinkServiceNetworkPolicies",
        ],
        //TODO use filterLive in compare
        compare: compare({
          filterAll: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              omit([
                "properties.provisioningState",
                "properties.ipConfigurations",
                "properties.routeTable",
                "properties.networkSecurityGroup",
                "properties.applicationGatewayIPConfigurations",
              ]),
              omitIfEmpty(["properties.delegations"]),
              pick(["properties"]),
              assign({
                properties: pipe([
                  get("properties"),
                  unless(
                    pipe([get("serviceEndpoints"), isEmpty]),
                    assign({
                      serviceEndpoints: pipe([
                        get("serviceEndpoints"),
                        map(omit(["provisioningState"])),
                      ]),
                    })
                  ),
                  omitIfEmpty(["serviceEndpoints"]),
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
            parent: true,
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
