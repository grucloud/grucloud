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
  any,
  and,
  switchCase,
  fork,
} = require("rubico");
const {
  defaultsDeep,
  pluck,
  isEmpty,
  unless,
  callProp,
  findIndex,
  find,
  first,
} = require("rubico/x");

const {
  omitIfEmpty,
  compare,
  replaceWithName,
} = require("@grucloud/core/Common");

const {
  findDependenciesResourceGroup,
  buildTags,
  configDefaultDependenciesId,
  configDefaultGeneric,
  assignDependenciesId,
  replaceSubscription,
} = require("../AzureCommon");

const group = "Network";

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
  "backendSettingsCollection",
  "listeners",
  "routingRules",
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

const findEC2VpnConnectionByIp = ({ gatewayIpAddress }) =>
  find(
    and([
      eq(get("groupType"), "EC2::VpnConnection"),
      pipe([
        get("live.Options.TunnelOptions"),
        any(eq(pipe([get("OutsideIpAddress")]), gatewayIpAddress)),
      ]),
    ])
  );

const findVpnConnectionIndex = ({ gatewayIpAddress }) =>
  pipe([
    get("Options.TunnelOptions"),
    findIndex(eq(pipe([get("OutsideIpAddress")]), gatewayIpAddress)),
    tap((index) => {
      assert(index >= 0);
    }),
  ]);

const findGcpVpnTunnelByIp = ({ gatewayIpAddress }) =>
  pipe([
    tap((params) => {
      assert(gatewayIpAddress);
    }),
    find(
      and([
        eq(get("groupType"), "compute::Address"),
        eq(get("live.address"), gatewayIpAddress),
      ])
    ),
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
        propertiesDefaultArray: [
          [
            "properties.frontendIPConfigurations[].properties.privateIPAllocationMethod",
            "Dynamic",
          ],
        ],
        filterLive: ({ lives, providerConfig }) =>
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
                                assign({
                                  id: pipe([
                                    get("id"),
                                    replaceWithName({
                                      groupType: "Network::Subnet",
                                      providerConfig,
                                      lives,
                                      path: "id",
                                    }),
                                  ]),
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
                                  providerConfig,
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
      },
      {
        type: "BastionHost",
        omitPropertiesExtra: [
          "properties.ipConfigurations[].id",
          "properties.dnsName",
        ],
      },
      {
        type: "RouteTable",
        omitPropertiesExtra: ["properties.routes"],
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
        },
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
          subnets: {
            type: "Subnet",
            group: "Network",
            createOnly: true,
            pathId:
              "properties.backendAddressPools[].properties.loadBalancerBackendAddresses[].properties.subnet.id",
            list: true,
          },
          publicIpAddresses: {
            type: "PublicIPAddress",
            group: "Network",
            createOnly: true,
            pathId:
              "properties.frontendIPConfigurations[].properties.publicIPAddress.id",
            list: true,
          },
          virtualNetworks: {
            type: "VirtualNetwork",
            group: "Network",
            createOnly: true,
            pathId:
              "properties.backendAddressPools[].properties.loadBalancerBackendAddresses[].properties.virtualNetwork.id",
            list: true,
          },
        },
        omitPropertiesExtra: ["properties.inboundNatRules"],
        propertiesDefaultArray: [
          [
            "properties.frontendIPConfigurations[].properties.privateIPAllocationMethod",
            "Dynamic",
          ],
        ],
        filterLive: ({ lives, providerConfig }) =>
          pipe([
            tap((params) => {
              assert(providerConfig);
            }),
            pick(["name", "location", "sku", "tags", "properties"]),
            assign({
              properties: pipe([
                get("properties"),
                omit(["provisioningState", "resourceGuid", "inboundNatRules"]),
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
                                  providerConfig,
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
                    map(pipe([pick(["name"])])),
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
                                  assign({
                                    id: pipe([
                                      get("id"),
                                      replaceWithName({
                                        groupType: "Network::LoadBalancer",
                                        providerConfig,
                                        lives,
                                        path: "id",
                                      }),
                                    ]),
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
                    get("outboundRules", []),
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
                                  providerConfig,
                                  lives,
                                }),
                              ]),
                            }),
                          ]),
                        }),
                      ])
                    ),
                  ]),
                  inboundNatPools: pipe([
                    get("inboundNatPools"),
                    map(
                      pipe([
                        tap((params) => {
                          assert(true);
                        }),
                        pick(["name", "properties"]),
                        assign({
                          properties: pipe([
                            get("properties"),
                            omit(["provisioningState"]),
                            assign({
                              frontendIPConfiguration: pipe([
                                get("frontendIPConfiguration"),
                                assign({
                                  id: pipe([
                                    get("id"),
                                    replaceSubscription({ providerConfig }),
                                  ]),
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
        // TODO remove
        pickPropertiesCreate: [
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
        omitPropertiesExtra: ["properties.securityRules[].type"],
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
                            // omitIfEmpty([
                            //   "destinationAddressPrefixes",
                            //   "destinationPortRanges",
                            //   "sourceAddressPrefixes",
                            //   "sourcePortRanges",
                            // ]),
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
          ddosCustomPolicy: {
            type: "DdosCustomPolicy",
            group: "Network",
            createOnly: true,
            pathId: "properties.ddosSettings.ddosCustomPolicy.id",
          },
          publicIpPrefix: {
            type: "PublicIPPrefix",
            group: "Network",
            createOnly: true,
            pathId: "properties.publicIPPrefix.id",
          },
          // TODO infinite loop
          // natGateway: {
          //   type: "NatGateway",
          //   group: "Network",
          //   createOnly: true,
          //   pathId: "properties.natGateway.id",
          // },
        },
        propertiesDefault: {
          sku: { name: "Basic", tier: "Regional" },
          properties: {
            publicIPAddressVersion: "IPv4",
            publicIPAllocationMethod: "Dynamic",
          },
        },
        pickPropertiesCreate: [
          "sku.name",
          "sku.tier",
          "zones",
          "properties.publicIPAllocationMethod",
          "properties.publicIPAddressVersion",
          "properties.dnsSettings.domainNameLabel",
        ],
      },
      {
        type: "AzureFirewall",
        apiVersion: "2021-05-01",
        omitPropertiesExtra: ["properties.ipConfigurations[].id"],
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
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          networkSecurityGroup: {
            type: "NetworkSecurityGroup",
            group: "Network",
            createOnly: true,
            pathId: "properties.networkSecurityGroup.id",
          },
          publicIpAddresses: {
            type: "PublicIPAddress",
            group: "Network",
            createOnly: true,
            pathId:
              "properties.ipConfigurations[].properties.publicIPAddress.id",
            list: true,
          },
          subnets: {
            type: "Subnet",
            group: "Network",
            createOnly: true,
            pathId: "properties.ipConfigurations[].properties.subnet.id",
            list: true,
          },
          applicationSecurityGroups: {
            type: "ApplicationSecurityGroup",
            group: "Network",
            createOnly: true,
            pathId:
              "properties.ipConfigurations[].properties.applicationSecurityGroups[].id",
            list: true,
          },
        },
        propertiesDefaultArray: [
          ["properties.ipConfigurations[].properties.primary", true],
          [
            "properties.ipConfigurations[].properties.privateIPAllocationMethod",
            "Dynamic",
          ],
          [
            "properties.ipConfigurations[].properties.privateIPAddressVersion",
            "IPv4",
          ],
        ],
        propertiesDefault: {
          kind: "Regular",
          properties: {
            nicType: "Standard",
            enableAcceleratedNetworking: false,
            enableIPForwarding: false,
            dnsSettings: { dnsServers: [] },
          },
        },
        omitPropertiesExtra: [
          "properties.ipConfigurations[].type",
          //TODO
          "properties.ipConfigurations[].properties.privateIPAddress",
        ],
      },
      // https://docs.microsoft.com/en-us/rest/api/virtualnetwork/subnets

      {
        type: "Subnet",
        isDefault: () => false,
        managedByOther: () => false,
        omitProperties: [
          "properties.routeTable",
          "properties.networkSecurityGroup",
          "properties.applicationGatewayIPConfigurations",
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
        type: "VirtualNetworkGateway",
        filterLiveExtra: () =>
          pipe([
            tap((params) => {
              assert(true);
            }),
            //OmitIfEmpty
            omit(["properties.bgpSettings.bgpPeeringAddresses"]),
          ]),
        // Refresh the ip addresses which should now contain the ip address property
        create: {
          postCreate: ({ dependencies: { publicIpAddresses = [] } }) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => publicIpAddresses,
              map(callProp("getLive")),
            ]),
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
          ])(),
      },
      {
        type: "VirtualNetworkGatewayConnection",
        group: "Network",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          localNetworkGateway: {
            type: "LocalNetworkGateway",
            group: "Network",
            createOnly: true,
            pathId: "properties.localNetworkGateway2.id",
          },
          // TODO fix azure swagger
          virtualNetworkGateway: {
            type: "VirtualNetworkGateway",
            group: "Network",
            createOnly: true,
            pathId: "properties.virtualNetworkGateway1.id",
          },
          natRules: {
            type: "NatRule",
            group: "Network",
            createOnly: true,
            pathId: "properties.egressNatRules[].id",
            list: true,
          },
        },
      },
      {
        type: "LocalNetworkGateway",
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          gatewayIpAddressAws: {
            providerType: "aws",
            type: "VpnConnection",
            group: "EC2",
            dependencyId:
              ({ lives, config }) =>
              ({ properties }) =>
                pipe([
                  tap((params) => {
                    assert(properties.gatewayIpAddress);
                  }),
                  () =>
                    lives.getByType({
                      providerType: "aws",
                      type: "VpnConnection",
                      group: "EC2",
                    }),
                  find(
                    pipe([
                      get("live.Options.TunnelOptions"),
                      any(
                        eq(get("OutsideIpAddress"), properties.gatewayIpAddress)
                      ),
                    ])
                  ),
                  get("id"),
                ])(),
          },
          gatewayIpAddressGoogle: {
            providerType: "google",
            type: "Address",
            group: "compute",
            dependencyId:
              ({ lives, config }) =>
              ({ properties }) =>
                pipe([
                  tap((params) => {
                    assert(properties.gatewayIpAddress);
                  }),
                  () =>
                    lives.getByType({
                      providerType: "google",
                      type: "Address",
                      group: "compute",
                    }),
                  find(eq(get("live.address"), properties.gatewayIpAddress)),
                  get("id"),
                ])(),
          },
        },
        filterLiveExtra: ({ lives, providerConfig }) =>
          pipe([
            assign({
              properties: pipe([
                get("properties"),
                pipe([
                  tap(({ gatewayIpAddress }) => {
                    assert(gatewayIpAddress);
                  }),
                  assign({
                    gatewayIpAddress: ({ gatewayIpAddress }) =>
                      pipe([
                        () => lives,
                        fork({
                          ec2VpnConnection: findEC2VpnConnectionByIp({
                            gatewayIpAddress,
                          }),
                          googleVpnTunnel: findGcpVpnTunnelByIp({
                            gatewayIpAddress,
                          }),
                        }),
                        switchCase([
                          get("ec2VpnConnection"),
                          ({ ec2VpnConnection: { id, live } }) =>
                            pipe([
                              () => live,
                              findVpnConnectionIndex({ gatewayIpAddress }),
                              (index) =>
                                pipe([
                                  () => id,
                                  replaceWithName({
                                    groupType: "EC2::VpnConnection",
                                    path: `live.Options.TunnelOptions[${index}].OutsideIpAddress`,
                                    providerConfig,
                                    lives,
                                  }),
                                ])(),
                            ])(),
                          get("googleVpnTunnel"),
                          ({ googleVpnTunnel: { id, live } }) =>
                            pipe([
                              () => id,
                              replaceWithName({
                                groupType: "compute::Address",
                                path: `live.address`,
                                providerConfig,
                                lives,
                              }),
                            ])(),
                          () => gatewayIpAddress,
                        ]),
                      ])(),
                  }),
                ]),
              ]),
            }),
          ]),
      },
      {
        type: "VirtualNetworkGatewayConnectionSharedKey",
        configDefault: ({ properties }) => pipe([() => properties])(),
        onResponseList: ({ path }) =>
          pipe([
            ({ value }) => [
              {
                id: pipe([() => path, callProp("split", "?"), first])(),
                value,
              },
            ],
          ]),
        environmentVariables: [{ path: "value", suffix: "SHAREDSECRET" }],
        filterLiveExtra: ({ lives, providerConfig }) =>
          pipe([
            assign({
              value: ({ value }) =>
                pipe([
                  tap((params) => {
                    assert(value);
                  }),
                  () => lives,
                  find(
                    and([
                      eq(get("groupType"), "EC2::VpnConnection"),
                      pipe([
                        get("live.Options.TunnelOptions"),
                        any(eq(get("PreSharedKey"), value)),
                      ]),
                    ])
                  ),
                  switchCase([
                    isEmpty,
                    () => value,
                    ({ id, live }) =>
                      pipe([
                        () => live,
                        get("Options.TunnelOptions"),
                        findIndex(eq(get("PreSharedKey"), value)),
                        tap((index) => {
                          assert(index >= 0);
                        }),
                        (index) =>
                          pipe([
                            () => id,
                            replaceWithName({
                              groupType: "EC2::VpnConnection",
                              path: `live.Options.TunnelOptions[${index}].PreSharedKey`,
                              providerConfig,
                              lives,
                            }),
                          ])(),
                      ])(),
                  ]),
                ])(),
            }),
          ]),
        dependencies: {
          resourceGroup: {
            type: "ResourceGroup",
            group: "Resources",
            name: "resourceGroupName",
            parent: true,
          },
          virtualNetworkGatewayConnection: {
            type: "VirtualNetworkGatewayConnection",
            group: "Network",
            name: "virtualNetworkGatewayConnectionName",
            parent: true,
          },
          vpnConnectionAws: {
            type: "VpnConnection",
            group: "EC2",
            createOnly: true,
            providerType: "aws",
            dependencyId:
              ({ lives, config }) =>
              ({ value }) =>
                pipe([
                  tap((params) => {
                    assert(value);
                  }),
                  () =>
                    lives.getByType({
                      providerType: "aws",
                      type: "VpnConnection",
                      group: "EC2",
                    }),
                  find(
                    pipe([
                      get("live.Options.TunnelOptions"),
                      any(eq(get("PreSharedKey"), value)),
                    ])
                  ),
                  get("id"),
                ])(),
          },
        },
      },
    ],
    map(defaultsDeep({ group })),
  ])();
};
