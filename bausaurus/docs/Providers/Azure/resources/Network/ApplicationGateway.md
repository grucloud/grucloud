---
id: ApplicationGateway
title: ApplicationGateway
---
Provides a **ApplicationGateway** from the **Network** group
## Examples
### Create Application Gateway
```js
exports.createResources = () => [
  {
    type: "ApplicationGateway",
    group: "Network",
    name: "myApplicationGateway",
    properties: () => ({
      identity: {
        type: "UserAssigned",
        userAssignedIdentities: {
          "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
            {},
        },
      },
      location: "eastus",
      properties: {
        sku: { name: "Standard_v2", tier: "Standard_v2", capacity: 3 },
        gatewayIPConfigurations: [
          {
            name: "appgwipc",
            properties: {
              subnet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet/subnets/appgwsubnet",
              },
            },
          },
        ],
        sslCertificates: [
          { name: "sslcert", properties: { data: "****", password: "****" } },
          {
            name: "sslcert2",
            properties: { keyVaultSecretId: "https://kv/secret" },
          },
        ],
        trustedRootCertificates: [
          { name: "rootcert", properties: { data: "****" } },
          {
            name: "rootcert1",
            properties: { keyVaultSecretId: "https://kv/secret" },
          },
        ],
        trustedClientCertificates: [
          { name: "clientcert", properties: { data: "****" } },
        ],
        frontendIPConfigurations: [
          {
            name: "appgwfip",
            properties: {
              publicIPAddress: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/appgwpip",
              },
            },
          },
        ],
        frontendPorts: [
          { name: "appgwfp", properties: { port: 443 } },
          { name: "appgwfp80", properties: { port: 80 } },
        ],
        backendAddressPools: [
          {
            name: "appgwpool",
            properties: {
              backendAddresses: [
                { ipAddress: "10.0.1.1" },
                { ipAddress: "10.0.1.2" },
              ],
            },
          },
          {
            name: "appgwpool1",
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendAddressPools/appgwpool1",
            properties: { backendAddresses: ["10.0.0.1", "10.0.0.2"] },
          },
        ],
        backendHttpSettingsCollection: [
          {
            name: "appgwbhs",
            properties: {
              port: 80,
              protocol: "Http",
              cookieBasedAffinity: "Disabled",
              requestTimeout: 30,
            },
          },
        ],
        sslProfiles: [
          {
            name: "sslProfile1",
            properties: {
              sslPolicy: {
                policyType: "Custom",
                minProtocolVersion: "TLSv1_1",
                cipherSuites: ["TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256"],
              },
              clientAuthConfiguration: { verifyClientCertIssuerDN: true },
              trustedClientCertificates: [
                {
                  id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/trustedClientCertificates/clientcert",
                },
              ],
            },
          },
        ],
        httpListeners: [
          {
            name: "appgwhl",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/frontendIPConfigurations/appgwfip",
              },
              frontendPort: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/frontendPorts/appgwfp",
              },
              protocol: "Https",
              sslCertificate: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/sslCertificates/sslcert",
              },
              sslProfile: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/sslProfiles/sslProfile1",
              },
              requireServerNameIndication: false,
            },
          },
          {
            name: "appgwhttplistener",
            properties: {
              frontendIPConfiguration: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/frontendIPConfigurations/appgwfip",
              },
              frontendPort: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/frontendPorts/appgwfp80",
              },
              protocol: "Http",
            },
          },
        ],
        urlPathMaps: [
          {
            name: "pathMap1",
            properties: {
              defaultBackendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendAddressPools/appgwpool",
              },
              defaultBackendHttpSettings: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendHttpSettingsCollection/appgwbhs",
              },
              defaultRewriteRuleSet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/rewriteRuleSets/rewriteRuleSet1",
              },
              defaultLoadDistributionPolicy: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/loadDistributionPolicies/ldp1",
              },
              pathRules: [
                {
                  name: "apiPaths",
                  properties: {
                    paths: ["/api", "/v1/api"],
                    backendAddressPool: {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendAddressPools/appgwpool",
                    },
                    backendHttpSettings: {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendHttpSettingsCollection/appgwbhs",
                    },
                    rewriteRuleSet: {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/rewriteRuleSets/rewriteRuleSet1",
                    },
                    loadDistributionPolicy: {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/loadDistributionPolicies/ldp1",
                    },
                  },
                },
              ],
            },
          },
        ],
        requestRoutingRules: [
          {
            name: "appgwrule",
            properties: {
              ruleType: "Basic",
              priority: 10,
              httpListener: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/httpListeners/appgwhl",
              },
              backendAddressPool: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendAddressPools/appgwpool",
              },
              backendHttpSettings: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendHttpSettingsCollection/appgwbhs",
              },
              rewriteRuleSet: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/rewriteRuleSets/rewriteRuleSet1",
              },
              loadDistributionPolicy: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/loadDistributionPolicies/ldp1",
              },
            },
          },
          {
            name: "appgwPathBasedRule",
            properties: {
              ruleType: "PathBasedRouting",
              priority: 20,
              httpListener: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/httpListeners/appgwhttplistener",
              },
              urlPathMap: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/urlPathMaps/pathMap1",
              },
            },
          },
        ],
        rewriteRuleSets: [
          {
            name: "rewriteRuleSet1",
            properties: {
              rewriteRules: [
                {
                  name: "Set X-Forwarded-For",
                  ruleSequence: 102,
                  conditions: [
                    {
                      variable: "http_req_Authorization",
                      pattern: "^Bearer",
                      ignoreCase: true,
                      negate: false,
                    },
                  ],
                  actionSet: {
                    requestHeaderConfigurations: [
                      {
                        headerName: "X-Forwarded-For",
                        headerValue: "{var_add_x_forwarded_for_proxy}",
                      },
                    ],
                    responseHeaderConfigurations: [
                      {
                        headerName: "Strict-Transport-Security",
                        headerValue: "max-age=31536000",
                      },
                    ],
                    urlConfiguration: { modifiedPath: "/abc" },
                  },
                },
              ],
            },
          },
        ],
        loadDistributionPolicies: [
          {
            name: "ldp1",
            properties: {
              loadDistributionAlgorithm: "RoundRobin",
              loadDistributionTargets: [
                {
                  name: "ld11",
                  properties: {
                    weightPerServer: 40,
                    backendAddressPool: {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendAddressPools/appgwpool",
                    },
                  },
                },
                {
                  name: "ld11",
                  properties: {
                    weightPerServer: 60,
                    backendAddressPool: {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/applicationGateways/appgw/backendAddressPools/appgwpool1",
                    },
                  },
                },
              ],
            },
          },
        ],
        globalConfiguration: {
          enableRequestBuffering: true,
          enableResponseBuffering: true,
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      managedIdentities: ["myUserAssignedIdentity"],
      subnets: ["mySubnet"],
      publicIpAddresses: ["myPublicIPAddress"],
      firewallPolicy: "myFirewallPolicy",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [UserAssignedIdentity](../ManagedIdentity/UserAssignedIdentity.md)
- [Subnet](../Network/Subnet.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
- [FirewallPolicy](../Network/FirewallPolicy.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the application gateway.',
      properties: {
        sku: {
          description: 'SKU of the application gateway resource.',
          properties: {
            name: {
              type: 'string',
              description: 'Name of an application gateway SKU.',
              enum: [
                'Standard_Small',
                'Standard_Medium',
                'Standard_Large',
                'WAF_Medium',
                'WAF_Large',
                'Standard_v2',
                'WAF_v2'
              ],
              'x-ms-enum': {
                name: 'ApplicationGatewaySkuName',
                modelAsString: true
              }
            },
            tier: {
              type: 'string',
              description: 'Tier of an application gateway.',
              enum: [ 'Standard', 'WAF', 'Standard_v2', 'WAF_v2' ],
              'x-ms-enum': { name: 'ApplicationGatewayTier', modelAsString: true }
            },
            capacity: {
              type: 'integer',
              format: 'int32',
              description: 'Capacity (instance count) of an application gateway.'
            }
          }
        },
        sslPolicy: {
          description: 'SSL policy of the application gateway resource.',
          properties: {
            disabledSslProtocols: {
              type: 'array',
              description: 'Ssl protocols to be disabled on application gateway.',
              items: {
                type: 'string',
                description: 'Ssl protocol enums.',
                enum: [ 'TLSv1_0', 'TLSv1_1', 'TLSv1_2', 'TLSv1_3' ],
                'x-ms-enum': {
                  name: 'ApplicationGatewaySslProtocol',
                  modelAsString: true
                }
              }
            },
            policyType: {
              type: 'string',
              description: 'Type of Ssl Policy.',
              enum: [ 'Predefined', 'Custom', 'CustomV2' ],
              'x-ms-enum': {
                name: 'ApplicationGatewaySslPolicyType',
                modelAsString: true
              }
            },
            policyName: {
              description: 'Name of Ssl predefined policy.',
              type: 'string',
              enum: [
                'AppGwSslPolicy20150501',
                'AppGwSslPolicy20170401',
                'AppGwSslPolicy20170401S',
                'AppGwSslPolicy20220101',
                'AppGwSslPolicy20220101S'
              ],
              'x-ms-enum': {
                name: 'ApplicationGatewaySslPolicyName',
                modelAsString: true
              }
            },
            cipherSuites: {
              type: 'array',
              items: {
                type: 'string',
                description: 'Ssl cipher suites enums.',
                enum: [
                  'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384',
                  'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
                  'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
                  'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
                  'TLS_DHE_RSA_WITH_AES_256_GCM_SHA384',
                  'TLS_DHE_RSA_WITH_AES_128_GCM_SHA256',
                  'TLS_DHE_RSA_WITH_AES_256_CBC_SHA',
                  'TLS_DHE_RSA_WITH_AES_128_CBC_SHA',
                  'TLS_RSA_WITH_AES_256_GCM_SHA384',
                  'TLS_RSA_WITH_AES_128_GCM_SHA256',
                  'TLS_RSA_WITH_AES_256_CBC_SHA256',
                  'TLS_RSA_WITH_AES_128_CBC_SHA256',
                  'TLS_RSA_WITH_AES_256_CBC_SHA',
                  'TLS_RSA_WITH_AES_128_CBC_SHA',
                  'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
                  'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
                  'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',
                  'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256',
                  'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA',
                  'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA',
                  'TLS_DHE_DSS_WITH_AES_256_CBC_SHA256',
                  'TLS_DHE_DSS_WITH_AES_128_CBC_SHA256',
                  'TLS_DHE_DSS_WITH_AES_256_CBC_SHA',
                  'TLS_DHE_DSS_WITH_AES_128_CBC_SHA',
                  'TLS_RSA_WITH_3DES_EDE_CBC_SHA',
                  'TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA',
                  'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
                  'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384'
                ],
                'x-ms-enum': {
                  name: 'ApplicationGatewaySslCipherSuite',
                  modelAsString: true
                }
              },
              description: 'Ssl cipher suites to be enabled in the specified order to application gateway.'
            },
            minProtocolVersion: {
              description: 'Minimum version of Ssl protocol to be supported on application gateway.',
              type: 'string',
              enum: [ 'TLSv1_0', 'TLSv1_1', 'TLSv1_2', 'TLSv1_3' ],
              'x-ms-enum': {
                name: 'ApplicationGatewaySslProtocol',
                modelAsString: true
              }
            }
          }
        },
        operationalState: {
          readOnly: true,
          type: 'string',
          description: 'Operational state of the application gateway resource.',
          enum: [ 'Stopped', 'Starting', 'Running', 'Stopping' ],
          'x-ms-enum': {
            name: 'ApplicationGatewayOperationalState',
            modelAsString: true
          }
        },
        gatewayIPConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway IP configuration.',
                properties: {
                  subnet: {
                    description: 'Reference to the subnet resource. A subnet from where application gateway gets its private address.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the application gateway IP configuration resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the IP configuration that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'IP configuration of an application gateway. Currently 1 public and 1 private IP configuration is allowed.'
          },
          description: 'Subnets of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        authenticationCertificates: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway authentication certificate.',
                properties: {
                  data: {
                    type: 'string',
                    description: 'Certificate public data.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the authentication certificate resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the authentication certificate that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Authentication certificates of an application gateway.'
          },
          description: 'Authentication certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        trustedRootCertificates: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway trusted root certificate.',
                properties: {
                  data: {
                    type: 'string',
                    description: 'Certificate public data.'
                  },
                  keyVaultSecretId: {
                    type: 'string',
                    description: "Secret Id of (base-64 encoded unencrypted pfx) 'Secret' or 'Certificate' object stored in KeyVault."
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the trusted root certificate resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the trusted root certificate that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Trusted Root certificates of an application gateway.'
          },
          description: 'Trusted Root certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        trustedClientCertificates: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway trusted client certificate.',
                properties: {
                  data: {
                    type: 'string',
                    description: 'Certificate public data.'
                  },
                  validatedCertData: {
                    readOnly: true,
                    type: 'string',
                    description: 'Validated certificate data.'
                  },
                  clientCertIssuerDN: {
                    readOnly: true,
                    type: 'string',
                    description: 'Distinguished name of client certificate issuer.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the trusted client certificate resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the trusted client certificate that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Trusted client certificates of an application gateway.'
          },
          description: 'Trusted client certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        sslCertificates: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway SSL certificate.',
                properties: {
                  data: {
                    type: 'string',
                    description: 'Base-64 encoded pfx certificate. Only applicable in PUT Request.'
                  },
                  password: {
                    type: 'string',
                    description: 'Password for the pfx file specified in data. Only applicable in PUT request.'
                  },
                  publicCertData: {
                    readOnly: true,
                    type: 'string',
                    description: 'Base-64 encoded Public cert data corresponding to pfx specified in data. Only applicable in GET request.'
                  },
                  keyVaultSecretId: {
                    type: 'string',
                    description: "Secret Id of (base-64 encoded unencrypted pfx) 'Secret' or 'Certificate' object stored in KeyVault."
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the SSL certificate resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the SSL certificate that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'SSL certificates of an application gateway.'
          },
          description: 'SSL certificates of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        frontendIPConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway frontend IP configuration.',
                properties: {
                  privateIPAddress: {
                    type: 'string',
                    description: 'PrivateIPAddress of the network interface IP Configuration.'
                  },
                  privateIPAllocationMethod: {
                    description: 'The private IP address allocation method.',
                    type: 'string',
                    enum: [ 'Static', 'Dynamic' ],
                    'x-ms-enum': { name: 'IPAllocationMethod', modelAsString: true }
                  },
                  subnet: {
                    description: 'Reference to the subnet resource.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  publicIPAddress: {
                    description: 'Reference to the PublicIP resource.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  privateLinkConfiguration: {
                    description: 'Reference to the application gateway private link configuration.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the frontend IP configuration resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the frontend IP configuration that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Frontend IP configuration of an application gateway.'
          },
          description: 'Frontend IP addresses of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        frontendPorts: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway frontend port.',
                properties: {
                  port: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Frontend port.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the frontend port resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the frontend port that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Frontend port of an application gateway.'
          },
          description: 'Frontend ports of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        probes: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway probe.',
                properties: {
                  protocol: {
                    description: 'The protocol used for the probe.',
                    type: 'string',
                    enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayProtocol',
                      modelAsString: true
                    }
                  },
                  host: {
                    type: 'string',
                    description: 'Host name to send the probe to.'
                  },
                  path: {
                    type: 'string',
                    description: "Relative path of probe. Valid path starts from '/'. Probe is sent to <Protocol>://<host>:<port><path>."
                  },
                  interval: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The probing interval in seconds. This is the time interval between two consecutive probes. Acceptable values are from 1 second to 86400 seconds.'
                  },
                  timeout: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The probe timeout in seconds. Probe marked as failed if valid response is not received with this timeout period. Acceptable values are from 1 second to 86400 seconds.'
                  },
                  unhealthyThreshold: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The probe retry count. Backend server is marked down after consecutive probe failure count reaches UnhealthyThreshold. Acceptable values are from 1 second to 20.'
                  },
                  pickHostNameFromBackendHttpSettings: {
                    type: 'boolean',
                    description: 'Whether the host header should be picked from the backend http settings. Default value is false.'
                  },
                  pickHostNameFromBackendSettings: {
                    type: 'boolean',
                    description: 'Whether the server name indication should be picked from the backend settings for Tls protocol. Default value is false.'
                  },
                  minServers: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Minimum number of servers that are always marked healthy. Default value is 0.'
                  },
                  match: {
                    description: 'Criterion for classifying a healthy probe response.',
                    properties: {
                      body: {
                        type: 'string',
                        description: 'Body that must be contained in the health response. Default value is empty.'
                      },
                      statusCodes: {
                        type: 'array',
                        items: { type: 'string' },
                        description: 'Allowed ranges of healthy status codes. Default range of healthy status codes is 200-399.'
                      }
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the probe resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  port: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Custom port which will be used for probing the backend servers. The valid value ranges from 1 to 65535. In case not set, port from http settings will be used. This property is valid for Standard_v2 and WAF_v2 only.',
                    minimum: 1,
                    maximum: 65535
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the probe that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Probe of the application gateway.'
          },
          description: 'Probes of the application gateway resource.'
        },
        backendAddressPools: {
          type: 'array',
          items: <ref *3> {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway backend address pool.',
                properties: {
                  backendIPConfigurations: {
                    readOnly: true,
                    type: 'array',
                    items: <ref *4> {
                      properties: <ref *2> {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Network interface IP configuration properties.',
                          properties: {
                            gatewayLoadBalancer: {
                              description: 'The reference to gateway load balancer frontend IP.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            },
                            virtualNetworkTaps: {
                              type: 'array',
                              items: {
                                properties: <ref *1> {
                                  properties: {
                                    'x-ms-client-flatten': true,
                                    description: 'Virtual Network Tap Properties.',
                                    properties: {
                                      networkInterfaceTapConfigurations: {
                                        readOnly: true,
                                        type: 'array',
                                        items: {
                                          description: 'The reference to the Network Interface.',
                                          properties: {
                                            properties: {
                                              'x-ms-client-flatten': true,
                                              description: 'Properties of the Virtual Network Tap configuration.',
                                              properties: {
                                                virtualNetworkTap: {
                                                  description: 'The reference to the Virtual Network Tap resource.',
                                                  properties: [Circular *1],
                                                  allOf: [Array]
                                                },
                                                provisioningState: {
                                                  readOnly: true,
                                                  description: 'The provisioning state of the network interface tap configuration resource.',
                                                  type: 'string',
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                }
                                              }
                                            },
                                            name: {
                                              type: 'string',
                                              description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                            },
                                            etag: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'A unique read-only string that changes whenever the resource is updated.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Sub Resource type.'
                                            }
                                          },
                                          allOf: [
                                            {
                                              properties: {
                                                id: {
                                                  type: 'string',
                                                  description: 'Resource ID.'
                                                }
                                              },
                                              description: 'Reference to another subresource.',
                                              'x-ms-azure-resource': true
                                            }
                                          ]
                                        },
                                        description: 'Specifies the list of resource IDs for the network interface IP configuration that needs to be tapped.'
                                      },
                                      resourceGuid: {
                                        type: 'string',
                                        readOnly: true,
                                        description: 'The resource GUID property of the virtual network tap resource.'
                                      },
                                      provisioningState: {
                                        readOnly: true,
                                        description: 'The provisioning state of the virtual network tap resource.',
                                        type: 'string',
                                        enum: [
                                          'Succeeded',
                                          'Updating',
                                          'Deleting',
                                          'Failed'
                                        ],
                                        'x-ms-enum': {
                                          name: 'ProvisioningState',
                                          modelAsString: true
                                        }
                                      },
                                      destinationNetworkInterfaceIPConfiguration: {
                                        description: 'The reference to the private IP Address of the collector nic that will receive the tap.',
                                        properties: [Circular *2],
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ]
                                      },
                                      destinationLoadBalancerFrontEndIPConfiguration: {
                                        description: 'The reference to the private IP address on the internal Load Balancer that will receive the tap.',
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Properties of the load balancer probe.',
                                            properties: {
                                              inboundNatRules: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                },
                                                description: 'An array of references to inbound rules that use this frontend IP.'
                                              },
                                              inboundNatPools: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                },
                                                description: 'An array of references to inbound pools that use this frontend IP.'
                                              },
                                              outboundRules: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                },
                                                description: 'An array of references to outbound rules that use this frontend IP.'
                                              },
                                              loadBalancingRules: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                },
                                                description: 'An array of references to load balancing rules that use this frontend IP.'
                                              },
                                              privateIPAddress: {
                                                type: 'string',
                                                description: 'The private IP address of the IP configuration.'
                                              },
                                              privateIPAllocationMethod: {
                                                description: 'The Private IP allocation method.',
                                                type: 'string',
                                                enum: [ 'Static', 'Dynamic' ],
                                                'x-ms-enum': {
                                                  name: 'IPAllocationMethod',
                                                  modelAsString: true
                                                }
                                              },
                                              privateIPAddressVersion: {
                                                description: 'Whether the specific ipconfiguration is IPv4 or IPv6. Default is taken as IPv4.',
                                                type: 'string',
                                                enum: [ 'IPv4', 'IPv6' ],
                                                'x-ms-enum': {
                                                  name: 'IPVersion',
                                                  modelAsString: true
                                                }
                                              },
                                              subnet: {
                                                description: 'The reference to the subnet resource.',
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ]
                                              },
                                              publicIPAddress: {
                                                description: 'The reference to the Public IP resource.',
                                                properties: {
                                                  extendedLocation: [Object],
                                                  sku: [Object],
                                                  properties: [Object],
                                                  etag: [Object],
                                                  zones: [Object]
                                                },
                                                allOf: [ [Object] ]
                                              },
                                              publicIPPrefix: {
                                                description: 'The reference to the Public IP Prefix resource.',
                                                properties: { id: [Object] },
                                                'x-ms-azure-resource': true
                                              },
                                              gatewayLoadBalancer: {
                                                description: 'The reference to gateway load balancer frontend IP.',
                                                properties: { id: [Object] },
                                                'x-ms-azure-resource': true
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the frontend IP configuration resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'The name of the resource that is unique within the set of frontend IP configurations used by the load balancer. This name can be used to access the resource.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          },
                                          type: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Type of the resource.'
                                          },
                                          zones: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ]
                                      },
                                      destinationPort: {
                                        type: 'integer',
                                        description: 'The VXLAN destination port that will receive the tapped traffic.'
                                      }
                                    }
                                  },
                                  etag: {
                                    readOnly: true,
                                    type: 'string',
                                    description: 'A unique read-only string that changes whenever the resource is updated.'
                                  }
                                },
                                allOf: [
                                  {
                                    properties: {
                                      id: {
                                        type: 'string',
                                        description: 'Resource ID.'
                                      },
                                      name: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Resource name.'
                                      },
                                      type: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Resource type.'
                                      },
                                      location: {
                                        type: 'string',
                                        description: 'Resource location.'
                                      },
                                      tags: {
                                        type: 'object',
                                        additionalProperties: { type: 'string' },
                                        description: 'Resource tags.'
                                      }
                                    },
                                    description: 'Common resource representation.',
                                    'x-ms-azure-resource': true
                                  }
                                ],
                                description: 'Virtual Network Tap resource.'
                              },
                              description: 'The reference to Virtual Network Taps.'
                            },
                            applicationGatewayBackendAddressPools: {
                              type: 'array',
                              items: [Circular *3],
                              description: 'The reference to ApplicationGatewayBackendAddressPool resource.'
                            },
                            loadBalancerBackendAddressPools: {
                              type: 'array',
                              items: {
                                properties: {
                                  properties: {
                                    'x-ms-client-flatten': true,
                                    description: 'Properties of load balancer backend address pool.',
                                    properties: {
                                      location: {
                                        type: 'string',
                                        description: 'The location of the backend address pool.'
                                      },
                                      tunnelInterfaces: {
                                        type: 'array',
                                        items: {
                                          properties: {
                                            port: {
                                              type: 'integer',
                                              format: 'int32',
                                              description: 'Port of gateway load balancer tunnel interface.'
                                            },
                                            identifier: {
                                              type: 'integer',
                                              format: 'int32',
                                              description: 'Identifier of gateway load balancer tunnel interface.'
                                            },
                                            protocol: {
                                              type: 'string',
                                              description: 'Protocol of gateway load balancer tunnel interface.',
                                              enum: [
                                                'None',
                                                'Native',
                                                'VXLAN'
                                              ],
                                              'x-ms-enum': {
                                                name: 'GatewayLoadBalancerTunnelProtocol',
                                                modelAsString: true
                                              }
                                            },
                                            type: {
                                              type: 'string',
                                              description: 'Traffic type of gateway load balancer tunnel interface.',
                                              enum: [
                                                'None',
                                                'Internal',
                                                'External'
                                              ],
                                              'x-ms-enum': {
                                                name: 'GatewayLoadBalancerTunnelInterfaceType',
                                                modelAsString: true
                                              }
                                            }
                                          },
                                          description: 'Gateway load balancer tunnel interface of a load balancer backend address pool.'
                                        },
                                        description: 'An array of gateway load balancer tunnel interfaces.'
                                      },
                                      loadBalancerBackendAddresses: {
                                        type: 'array',
                                        items: {
                                          properties: {
                                            properties: {
                                              'x-ms-client-flatten': true,
                                              description: 'Properties of load balancer backend address pool.',
                                              properties: {
                                                virtualNetwork: {
                                                  description: 'Reference to an existing virtual network.',
                                                  properties: [Object],
                                                  'x-ms-azure-resource': true
                                                },
                                                subnet: {
                                                  description: 'Reference to an existing subnet.',
                                                  properties: [Object],
                                                  'x-ms-azure-resource': true
                                                },
                                                ipAddress: {
                                                  type: 'string',
                                                  description: 'IP Address belonging to the referenced virtual network.',
                                                  'x-ms-azure-resource': false
                                                },
                                                networkInterfaceIPConfiguration: {
                                                  readOnly: true,
                                                  description: 'Reference to IP address defined in network interfaces.',
                                                  properties: [Object],
                                                  'x-ms-azure-resource': true
                                                },
                                                loadBalancerFrontendIPConfiguration: {
                                                  readOnly: false,
                                                  description: 'Reference to the frontend ip address configuration defined in regional loadbalancer.',
                                                  properties: [Object],
                                                  'x-ms-azure-resource': true
                                                },
                                                inboundNatRulesPortMapping: {
                                                  readOnly: true,
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'Collection of inbound NAT rule port mappings.'
                                                },
                                                adminState: {
                                                  type: 'string',
                                                  description: 'A list of administrative states which once set can override health probe so that Load Balancer will always forward new connections to backend, or deny new connections and reset existing connections.',
                                                  enum: [Array],
                                                  'x-ms-enum': [Object]
                                                }
                                              }
                                            },
                                            name: {
                                              type: 'string',
                                              description: 'Name of the backend address.'
                                            }
                                          },
                                          description: 'Load balancer backend addresses.'
                                        },
                                        description: 'An array of backend addresses.'
                                      },
                                      backendIPConfigurations: {
                                        readOnly: true,
                                        type: 'array',
                                        items: [Circular *4],
                                        description: 'An array of references to IP addresses defined in network interfaces.'
                                      },
                                      loadBalancingRules: {
                                        readOnly: true,
                                        type: 'array',
                                        items: {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        },
                                        description: 'An array of references to load balancing rules that use this backend address pool.'
                                      },
                                      outboundRule: {
                                        readOnly: true,
                                        description: 'A reference to an outbound rule that uses this backend address pool.',
                                        properties: {
                                          id: {
                                            type: 'string',
                                            description: 'Resource ID.'
                                          }
                                        },
                                        'x-ms-azure-resource': true
                                      },
                                      outboundRules: {
                                        readOnly: true,
                                        type: 'array',
                                        items: {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        },
                                        description: 'An array of references to outbound rules that use this backend address pool.'
                                      },
                                      inboundNatRules: {
                                        readOnly: true,
                                        type: 'array',
                                        items: {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        },
                                        description: 'An array of references to inbound NAT rules that use this backend address pool.'
                                      },
                                      provisioningState: {
                                        readOnly: true,
                                        description: 'The provisioning state of the backend address pool resource.',
                                        type: 'string',
                                        enum: [
                                          'Succeeded',
                                          'Updating',
                                          'Deleting',
                                          'Failed'
                                        ],
                                        'x-ms-enum': {
                                          name: 'ProvisioningState',
                                          modelAsString: true
                                        }
                                      },
                                      drainPeriodInSeconds: {
                                        type: 'integer',
                                        format: 'int32',
                                        description: 'Amount of seconds Load Balancer waits for before sending RESET to client and backend address.'
                                      }
                                    }
                                  },
                                  name: {
                                    type: 'string',
                                    description: 'The name of the resource that is unique within the set of backend address pools used by the load balancer. This name can be used to access the resource.'
                                  },
                                  etag: {
                                    readOnly: true,
                                    type: 'string',
                                    description: 'A unique read-only string that changes whenever the resource is updated.'
                                  },
                                  type: {
                                    readOnly: true,
                                    type: 'string',
                                    description: 'Type of the resource.'
                                  }
                                },
                                allOf: [
                                  {
                                    properties: {
                                      id: {
                                        type: 'string',
                                        description: 'Resource ID.'
                                      }
                                    },
                                    description: 'Reference to another subresource.',
                                    'x-ms-azure-resource': true
                                  }
                                ],
                                description: 'Pool of backend IP addresses.'
                              },
                              description: 'The reference to LoadBalancerBackendAddressPool resource.'
                            },
                            loadBalancerInboundNatRules: {
                              type: 'array',
                              items: {
                                properties: {
                                  properties: {
                                    'x-ms-client-flatten': true,
                                    description: 'Properties of load balancer inbound NAT rule.',
                                    properties: {
                                      frontendIPConfiguration: {
                                        description: 'A reference to frontend IP addresses.',
                                        properties: {
                                          id: {
                                            type: 'string',
                                            description: 'Resource ID.'
                                          }
                                        },
                                        'x-ms-azure-resource': true
                                      },
                                      backendIPConfiguration: {
                                        readOnly: true,
                                        description: 'A reference to a private IP address defined on a network interface of a VM. Traffic sent to the frontend port of each of the frontend IP configurations is forwarded to the backend IP.',
                                        properties: [Circular *2],
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ]
                                      },
                                      protocol: {
                                        description: 'The reference to the transport protocol used by the load balancing rule.',
                                        type: 'string',
                                        enum: [ 'Udp', 'Tcp', 'All' ],
                                        'x-ms-enum': {
                                          name: 'TransportProtocol',
                                          modelAsString: true
                                        }
                                      },
                                      frontendPort: {
                                        type: 'integer',
                                        format: 'int32',
                                        description: 'The port for the external endpoint. Port numbers for each rule must be unique within the Load Balancer. Acceptable values range from 1 to 65534.'
                                      },
                                      backendPort: {
                                        type: 'integer',
                                        format: 'int32',
                                        description: 'The port used for the internal endpoint. Acceptable values range from 1 to 65535.'
                                      },
                                      idleTimeoutInMinutes: {
                                        type: 'integer',
                                        format: 'int32',
                                        description: 'The timeout for the TCP idle connection. The value can be set between 4 and 30 minutes. The default value is 4 minutes. This element is only used when the protocol is set to TCP.'
                                      },
                                      enableFloatingIP: {
                                        type: 'boolean',
                                        description: "Configures a virtual machine's endpoint for the floating IP capability required to configure a SQL AlwaysOn Availability Group. This setting is required when using the SQL AlwaysOn Availability Groups in SQL server. This setting can't be changed after you create the endpoint."
                                      },
                                      enableTcpReset: {
                                        type: 'boolean',
                                        description: 'Receive bidirectional TCP Reset on TCP flow idle timeout or unexpected connection termination. This element is only used when the protocol is set to TCP.'
                                      },
                                      frontendPortRangeStart: {
                                        type: 'integer',
                                        format: 'int32',
                                        description: 'The port range start for the external endpoint. This property is used together with BackendAddressPool and FrontendPortRangeEnd. Individual inbound NAT rule port mappings will be created for each backend address from BackendAddressPool. Acceptable values range from 1 to 65534.'
                                      },
                                      frontendPortRangeEnd: {
                                        type: 'integer',
                                        format: 'int32',
                                        description: 'The port range end for the external endpoint. This property is used together with BackendAddressPool and FrontendPortRangeStart. Individual inbound NAT rule port mappings will be created for each backend address from BackendAddressPool. Acceptable values range from 1 to 65534.'
                                      },
                                      backendAddressPool: {
                                        description: 'A reference to backendAddressPool resource.',
                                        properties: {
                                          id: {
                                            type: 'string',
                                            description: 'Resource ID.'
                                          }
                                        },
                                        'x-ms-azure-resource': true
                                      },
                                      provisioningState: {
                                        readOnly: true,
                                        description: 'The provisioning state of the inbound NAT rule resource.',
                                        type: 'string',
                                        enum: [
                                          'Succeeded',
                                          'Updating',
                                          'Deleting',
                                          'Failed'
                                        ],
                                        'x-ms-enum': {
                                          name: 'ProvisioningState',
                                          modelAsString: true
                                        }
                                      }
                                    }
                                  },
                                  name: {
                                    type: 'string',
                                    description: 'The name of the resource that is unique within the set of inbound NAT rules used by the load balancer. This name can be used to access the resource.'
                                  },
                                  etag: {
                                    readOnly: true,
                                    type: 'string',
                                    description: 'A unique read-only string that changes whenever the resource is updated.'
                                  },
                                  type: {
                                    readOnly: true,
                                    type: 'string',
                                    description: 'Type of the resource.'
                                  }
                                },
                                allOf: [
                                  {
                                    properties: {
                                      id: {
                                        type: 'string',
                                        description: 'Resource ID.'
                                      }
                                    },
                                    description: 'Reference to another subresource.',
                                    'x-ms-azure-resource': true
                                  }
                                ],
                                description: 'Inbound NAT rule of the load balancer.'
                              },
                              description: 'A list of references of LoadBalancerInboundNatRules.'
                            },
                            privateIPAddress: {
                              type: 'string',
                              description: 'Private IP address of the IP configuration.'
                            },
                            privateIPAllocationMethod: {
                              description: 'The private IP address allocation method.',
                              type: 'string',
                              enum: [ 'Static', 'Dynamic' ],
                              'x-ms-enum': {
                                name: 'IPAllocationMethod',
                                modelAsString: true
                              }
                            },
                            privateIPAddressVersion: {
                              description: 'Whether the specific IP configuration is IPv4 or IPv6. Default is IPv4.',
                              type: 'string',
                              enum: [ 'IPv4', 'IPv6' ],
                              'x-ms-enum': {
                                name: 'IPVersion',
                                modelAsString: true
                              }
                            },
                            subnet: {
                              description: 'Subnet bound to the IP configuration.',
                              properties: <ref *5> {
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Properties of the subnet.',
                                  properties: {
                                    addressPrefix: {
                                      type: 'string',
                                      description: 'The address prefix for the subnet.'
                                    },
                                    addressPrefixes: {
                                      type: 'array',
                                      items: { type: 'string' },
                                      description: 'List of address prefixes for the subnet.'
                                    },
                                    networkSecurityGroup: {
                                      description: 'The reference to the NetworkSecurityGroup resource.',
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the network security group.',
                                          properties: {
                                            flushConnection: {
                                              type: 'boolean',
                                              description: 'When enabled, flows created from Network Security Group connections will be re-evaluated when rules are updates. Initial enablement will trigger re-evaluation.'
                                            },
                                            securityRules: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Network security rule.'
                                              },
                                              description: 'A collection of security rules of the network security group.'
                                            },
                                            defaultSecurityRules: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Network security rule.'
                                              },
                                              description: 'The default security rules of network security group.'
                                            },
                                            networkInterfaces: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  extendedLocation: [Object],
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'A network interface in a resource group.'
                                              },
                                              description: 'A collection of references to network interfaces.'
                                            },
                                            subnets: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: [Circular *5],
                                                allOf: [ [Object] ],
                                                description: 'Subnet in a virtual network resource.'
                                              },
                                              description: 'A collection of references to subnets.'
                                            },
                                            flowLogs: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'A flow log resource.'
                                              },
                                              description: 'A collection of references to flow log resources.'
                                            },
                                            resourceGuid: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'The resource GUID property of the network security group resource.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the network security group resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    routeTable: {
                                      description: 'The reference to the RouteTable resource.',
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the route table.',
                                          properties: {
                                            routes: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Route resource.'
                                              },
                                              description: 'Collection of routes contained within a route table.'
                                            },
                                            subnets: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: [Circular *5],
                                                allOf: [ [Object] ],
                                                description: 'Subnet in a virtual network resource.'
                                              },
                                              description: 'A collection of references to subnets.'
                                            },
                                            disableBgpRoutePropagation: {
                                              type: 'boolean',
                                              description: 'Whether to disable the routes learned by BGP on that route table. True means disable.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the route table resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            },
                                            resourceGuid: {
                                              type: 'string',
                                              readOnly: true,
                                              description: 'The resource GUID property of the route table.'
                                            }
                                          }
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    natGateway: {
                                      description: 'Nat gateway associated with this subnet.',
                                      properties: {
                                        id: {
                                          type: 'string',
                                          description: 'Resource ID.'
                                        }
                                      },
                                      'x-ms-azure-resource': true
                                    },
                                    serviceEndpoints: {
                                      type: 'array',
                                      items: {
                                        properties: {
                                          service: {
                                            type: 'string',
                                            description: 'The type of the endpoint service.'
                                          },
                                          locations: {
                                            type: 'array',
                                            items: { type: 'string' },
                                            description: 'A list of locations.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the service endpoint resource.',
                                            type: 'string',
                                            enum: [
                                              'Succeeded',
                                              'Updating',
                                              'Deleting',
                                              'Failed'
                                            ],
                                            'x-ms-enum': {
                                              name: 'ProvisioningState',
                                              modelAsString: true
                                            }
                                          }
                                        },
                                        description: 'The service endpoint properties.'
                                      },
                                      description: 'An array of service endpoints.'
                                    },
                                    serviceEndpointPolicies: {
                                      type: 'array',
                                      items: {
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Properties of the service end point policy.',
                                            properties: {
                                              serviceEndpointPolicyDefinitions: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'Service Endpoint policy definitions.'
                                                },
                                                description: 'A collection of service endpoint policy definitions of the service endpoint policy.'
                                              },
                                              subnets: {
                                                readOnly: true,
                                                type: 'array',
                                                items: {
                                                  properties: [Circular *5],
                                                  allOf: [Array],
                                                  description: 'Subnet in a virtual network resource.'
                                                },
                                                description: 'A collection of references to subnets.'
                                              },
                                              resourceGuid: {
                                                type: 'string',
                                                readOnly: true,
                                                description: 'The resource GUID property of the service endpoint policy resource.'
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the service endpoint policy resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              },
                                              serviceAlias: {
                                                type: 'string',
                                                description: 'The alias indicating if the policy belongs to a service'
                                              },
                                              contextualServiceEndpointPolicies: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                description: 'A collection of contextual service endpoint policy.'
                                              }
                                            }
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          },
                                          kind: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Kind of service endpoint policy. This is metadata used for the Azure portal experience.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              },
                                              name: {
                                                readOnly: true,
                                                type: 'string',
                                                description: 'Resource name.'
                                              },
                                              type: {
                                                readOnly: true,
                                                type: 'string',
                                                description: 'Resource type.'
                                              },
                                              location: {
                                                type: 'string',
                                                description: 'Resource location.'
                                              },
                                              tags: {
                                                type: 'object',
                                                additionalProperties: { type: 'string' },
                                                description: 'Resource tags.'
                                              }
                                            },
                                            description: 'Common resource representation.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'Service End point policy resource.'
                                      },
                                      description: 'An array of service endpoint policies.'
                                    },
                                    privateEndpoints: {
                                      readOnly: true,
                                      type: 'array',
                                      items: {
                                        properties: {
                                          extendedLocation: {
                                            description: 'The extended location of the load balancer.',
                                            properties: {
                                              name: {
                                                type: 'string',
                                                description: 'The name of the extended location.'
                                              },
                                              type: {
                                                description: 'The type of the extended location.',
                                                type: 'string',
                                                enum: [ 'EdgeZone' ],
                                                'x-ms-enum': {
                                                  name: 'ExtendedLocationTypes',
                                                  modelAsString: true
                                                }
                                              }
                                            }
                                          },
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Properties of the private endpoint.',
                                            properties: {
                                              subnet: {
                                                description: 'The ID of the subnet from which the private IP will be allocated.',
                                                properties: [Circular *5],
                                                allOf: [ [Object] ]
                                              },
                                              networkInterfaces: {
                                                type: 'array',
                                                readOnly: true,
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'A network interface in a resource group.'
                                                },
                                                description: 'An array of references to the network interfaces created for this private endpoint.'
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the private endpoint resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              },
                                              privateLinkServiceConnections: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'PrivateLinkServiceConnection resource.'
                                                },
                                                description: 'A grouping of information about the connection to the remote resource.'
                                              },
                                              manualPrivateLinkServiceConnections: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'PrivateLinkServiceConnection resource.'
                                                },
                                                description: 'A grouping of information about the connection to the remote resource. Used when the network admin does not have access to approve connections to the remote resource.'
                                              },
                                              customDnsConfigs: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  description: 'Contains custom Dns resolution configuration from customer.'
                                                },
                                                description: 'An array of custom dns configurations.'
                                              },
                                              applicationSecurityGroups: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'An application security group in a resource group.'
                                                },
                                                description: 'Application security groups in which the private endpoint IP configuration is included.'
                                              },
                                              ipConfigurations: {
                                                type: 'array',
                                                items: {
                                                  type: 'object',
                                                  properties: [Object],
                                                  description: 'An IP Configuration of the private endpoint.'
                                                },
                                                description: "A list of IP configurations of the private endpoint. This will be used to map to the First Party Service's endpoints."
                                              },
                                              customNetworkInterfaceName: {
                                                type: 'string',
                                                description: 'The custom name of the network interface attached to the private endpoint.'
                                              }
                                            }
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              },
                                              name: {
                                                readOnly: true,
                                                type: 'string',
                                                description: 'Resource name.'
                                              },
                                              type: {
                                                readOnly: true,
                                                type: 'string',
                                                description: 'Resource type.'
                                              },
                                              location: {
                                                type: 'string',
                                                description: 'Resource location.'
                                              },
                                              tags: {
                                                type: 'object',
                                                additionalProperties: { type: 'string' },
                                                description: 'Resource tags.'
                                              }
                                            },
                                            description: 'Common resource representation.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'Private endpoint resource.'
                                      },
                                      description: 'An array of references to private endpoints.'
                                    },
                                    ipConfigurations: {
                                      readOnly: true,
                                      type: 'array',
                                      items: {
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Properties of the IP configuration.',
                                            properties: {
                                              privateIPAddress: {
                                                type: 'string',
                                                description: 'The private IP address of the IP configuration.'
                                              },
                                              privateIPAllocationMethod: {
                                                description: 'The private IP address allocation method.',
                                                default: 'Dynamic',
                                                type: 'string',
                                                enum: [ 'Static', 'Dynamic' ],
                                                'x-ms-enum': {
                                                  name: 'IPAllocationMethod',
                                                  modelAsString: true
                                                }
                                              },
                                              subnet: {
                                                description: 'The reference to the subnet resource.',
                                                properties: [Circular *5],
                                                allOf: [ [Object] ]
                                              },
                                              publicIPAddress: {
                                                description: 'The reference to the public IP resource.',
                                                properties: {
                                                  extendedLocation: [Object],
                                                  sku: [Object],
                                                  properties: [Object],
                                                  etag: [Object],
                                                  zones: [Object]
                                                },
                                                allOf: [ [Object] ]
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the IP configuration resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'IP configuration.'
                                      },
                                      description: 'An array of references to the network interface IP configurations using subnet.'
                                    },
                                    ipConfigurationProfiles: {
                                      readOnly: true,
                                      type: 'array',
                                      items: {
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Properties of the IP configuration profile.',
                                            properties: {
                                              subnet: {
                                                description: 'The reference to the subnet resource to create a container network interface ip configuration.',
                                                properties: [Circular *5],
                                                allOf: [ [Object] ]
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the IP configuration profile resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'The name of the resource. This name can be used to access the resource.'
                                          },
                                          type: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Sub Resource type.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'IP configuration profile child resource.'
                                      },
                                      description: 'Array of IP configuration profiles which reference this subnet.'
                                    },
                                    ipAllocations: {
                                      type: 'array',
                                      items: {
                                        properties: {
                                          id: {
                                            type: 'string',
                                            description: 'Resource ID.'
                                          }
                                        },
                                        description: 'Reference to another subresource.',
                                        'x-ms-azure-resource': true
                                      },
                                      description: 'Array of IpAllocation which reference this subnet.'
                                    },
                                    resourceNavigationLinks: {
                                      readOnly: true,
                                      type: 'array',
                                      items: {
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Resource navigation link properties format.',
                                            properties: {
                                              linkedResourceType: {
                                                type: 'string',
                                                description: 'Resource type of the linked resource.'
                                              },
                                              link: {
                                                type: 'string',
                                                description: 'Link to the external resource.'
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the resource navigation link resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                          },
                                          id: {
                                            type: 'string',
                                            readOnly: true,
                                            description: 'Resource navigation link identifier.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          },
                                          type: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Resource type.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'ResourceNavigationLink resource.'
                                      },
                                      description: 'An array of references to the external resources using subnet.'
                                    },
                                    serviceAssociationLinks: {
                                      readOnly: true,
                                      type: 'array',
                                      items: {
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Resource navigation link properties format.',
                                            properties: {
                                              linkedResourceType: {
                                                type: 'string',
                                                description: 'Resource type of the linked resource.'
                                              },
                                              link: {
                                                type: 'string',
                                                description: 'Link to the external resource.'
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the service association link resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              },
                                              allowDelete: {
                                                type: 'boolean',
                                                description: 'If true, the resource can be deleted.'
                                              },
                                              locations: {
                                                type: 'array',
                                                items: { type: 'string' },
                                                description: 'A list of locations.'
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          },
                                          type: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Resource type.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'ServiceAssociationLink resource.'
                                      },
                                      description: 'An array of references to services injecting into this subnet.'
                                    },
                                    delegations: {
                                      type: 'array',
                                      items: {
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Properties of the subnet.',
                                            properties: {
                                              serviceName: {
                                                type: 'string',
                                                description: 'The name of the service to whom the subnet should be delegated (e.g. Microsoft.Sql/servers).'
                                              },
                                              actions: {
                                                readOnly: true,
                                                type: 'array',
                                                items: { type: 'string' },
                                                description: 'The actions permitted to the service upon delegation.'
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the service delegation resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'The name of the resource that is unique within a subnet. This name can be used to access the resource.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          },
                                          type: {
                                            type: 'string',
                                            description: 'Resource type.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'Details the service to which the subnet is delegated.'
                                      },
                                      description: 'An array of references to the delegations on the subnet.'
                                    },
                                    purpose: {
                                      type: 'string',
                                      readOnly: true,
                                      description: 'A read-only string identifying the intention of use for this subnet based on delegations and other user-defined properties.'
                                    },
                                    provisioningState: {
                                      readOnly: true,
                                      description: 'The provisioning state of the subnet resource.',
                                      type: 'string',
                                      enum: [
                                        'Succeeded',
                                        'Updating',
                                        'Deleting',
                                        'Failed'
                                      ],
                                      'x-ms-enum': {
                                        name: 'ProvisioningState',
                                        modelAsString: true
                                      }
                                    },
                                    privateEndpointNetworkPolicies: {
                                      type: 'string',
                                      default: 'Disabled',
                                      description: 'Enable or Disable apply network policies on private end point in the subnet.',
                                      enum: [ 'Enabled', 'Disabled' ],
                                      'x-ms-enum': {
                                        name: 'VirtualNetworkPrivateEndpointNetworkPolicies',
                                        modelAsString: true
                                      }
                                    },
                                    privateLinkServiceNetworkPolicies: {
                                      type: 'string',
                                      default: 'Enabled',
                                      description: 'Enable or Disable apply network policies on private link service in the subnet.',
                                      enum: [ 'Enabled', 'Disabled' ],
                                      'x-ms-enum': {
                                        name: 'VirtualNetworkPrivateLinkServiceNetworkPolicies',
                                        modelAsString: true
                                      }
                                    },
                                    applicationGatewayIpConfigurations: {
                                      type: 'array',
                                      items: {
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Properties of the application gateway IP configuration.',
                                            properties: {
                                              subnet: {
                                                description: 'Reference to the subnet resource. A subnet from where application gateway gets its private address.',
                                                properties: { id: [Object] },
                                                'x-ms-azure-resource': true
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the application gateway IP configuration resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'Name of the IP configuration that is unique within an Application Gateway.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          },
                                          type: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Type of the resource.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'IP configuration of an application gateway. Currently 1 public and 1 private IP configuration is allowed.'
                                      },
                                      description: 'Application gateway IP configurations of virtual network resource.'
                                    }
                                  }
                                },
                                name: {
                                  type: 'string',
                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                },
                                etag: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                },
                                type: {
                                  type: 'string',
                                  description: 'Resource type.'
                                }
                              },
                              allOf: [
                                {
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    }
                                  },
                                  description: 'Reference to another subresource.',
                                  'x-ms-azure-resource': true
                                }
                              ]
                            },
                            primary: {
                              type: 'boolean',
                              description: 'Whether this is a primary customer address on the network interface.'
                            },
                            publicIPAddress: {
                              description: 'Public IP address bound to the IP configuration.',
                              properties: <ref *6> {
                                extendedLocation: {
                                  description: 'The extended location of the public ip address.',
                                  properties: {
                                    name: {
                                      type: 'string',
                                      description: 'The name of the extended location.'
                                    },
                                    type: {
                                      description: 'The type of the extended location.',
                                      type: 'string',
                                      enum: [ 'EdgeZone' ],
                                      'x-ms-enum': {
                                        name: 'ExtendedLocationTypes',
                                        modelAsString: true
                                      }
                                    }
                                  }
                                },
                                sku: {
                                  description: 'The public IP address SKU.',
                                  properties: {
                                    name: {
                                      type: 'string',
                                      description: 'Name of a public IP address SKU.',
                                      enum: [ 'Basic', 'Standard' ],
                                      'x-ms-enum': {
                                        name: 'PublicIPAddressSkuName',
                                        modelAsString: true
                                      }
                                    },
                                    tier: {
                                      type: 'string',
                                      description: 'Tier of a public IP address SKU.',
                                      enum: [ 'Regional', 'Global' ],
                                      'x-ms-enum': {
                                        name: 'PublicIPAddressSkuTier',
                                        modelAsString: true
                                      }
                                    }
                                  }
                                },
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Public IP address properties.',
                                  properties: {
                                    publicIPAllocationMethod: {
                                      description: 'The public IP address allocation method.',
                                      type: 'string',
                                      enum: [ 'Static', 'Dynamic' ],
                                      'x-ms-enum': {
                                        name: 'IPAllocationMethod',
                                        modelAsString: true
                                      }
                                    },
                                    publicIPAddressVersion: {
                                      description: 'The public IP address version.',
                                      type: 'string',
                                      enum: [ 'IPv4', 'IPv6' ],
                                      'x-ms-enum': {
                                        name: 'IPVersion',
                                        modelAsString: true
                                      }
                                    },
                                    ipConfiguration: {
                                      readOnly: true,
                                      description: 'The IP configuration associated with the public IP address.',
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the IP configuration.',
                                          properties: {
                                            privateIPAddress: {
                                              type: 'string',
                                              description: 'The private IP address of the IP configuration.'
                                            },
                                            privateIPAllocationMethod: {
                                              description: 'The private IP address allocation method.',
                                              default: 'Dynamic',
                                              type: 'string',
                                              enum: [ 'Static', 'Dynamic' ],
                                              'x-ms-enum': {
                                                name: 'IPAllocationMethod',
                                                modelAsString: true
                                              }
                                            },
                                            subnet: {
                                              description: 'The reference to the subnet resource.',
                                              properties: <ref *5> {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the subnet.',
                                                  properties: [Object]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                },
                                                type: {
                                                  type: 'string',
                                                  description: 'Resource type.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ]
                                            },
                                            publicIPAddress: {
                                              description: 'The reference to the public IP resource.',
                                              properties: [Circular *6],
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Common resource representation.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ]
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the IP configuration resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        name: {
                                          type: 'string',
                                          description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    dnsSettings: {
                                      description: 'The FQDN of the DNS record associated with the public IP address.',
                                      properties: {
                                        domainNameLabel: {
                                          type: 'string',
                                          description: 'The domain name label. The concatenation of the domain name label and the regionalized DNS zone make up the fully qualified domain name associated with the public IP address. If a domain name label is specified, an A DNS record is created for the public IP in the Microsoft Azure DNS system.'
                                        },
                                        fqdn: {
                                          type: 'string',
                                          description: 'The Fully Qualified Domain Name of the A DNS record associated with the public IP. This is the concatenation of the domainNameLabel and the regionalized DNS zone.'
                                        },
                                        reverseFqdn: {
                                          type: 'string',
                                          description: 'The reverse FQDN. A user-visible, fully qualified domain name that resolves to this public IP address. If the reverseFqdn is specified, then a PTR DNS record is created pointing from the IP address in the in-addr.arpa domain to the reverse FQDN.'
                                        }
                                      }
                                    },
                                    ddosSettings: {
                                      description: 'The DDoS protection custom policy associated with the public IP address.',
                                      properties: {
                                        ddosCustomPolicy: {
                                          readOnly: false,
                                          description: 'The DDoS custom policy associated with the public IP.',
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          'x-ms-azure-resource': true
                                        },
                                        protectionCoverage: {
                                          readOnly: false,
                                          type: 'string',
                                          enum: [ 'Basic', 'Standard' ],
                                          'x-ms-enum': {
                                            name: 'DdosSettingsProtectionCoverage',
                                            modelAsString: true
                                          },
                                          description: 'The DDoS protection policy customizability of the public IP. Only standard coverage will have the ability to be customized.'
                                        },
                                        protectedIP: {
                                          readOnly: false,
                                          type: 'boolean',
                                          description: 'Enables DDoS protection on the public IP.'
                                        }
                                      }
                                    },
                                    ipTags: {
                                      type: 'array',
                                      items: {
                                        properties: {
                                          ipTagType: {
                                            type: 'string',
                                            description: 'The IP tag type. Example: FirstPartyUsage.'
                                          },
                                          tag: {
                                            type: 'string',
                                            description: 'The value of the IP tag associated with the public IP. Example: SQL.'
                                          }
                                        },
                                        description: 'Contains the IpTag associated with the object.'
                                      },
                                      description: 'The list of tags associated with the public IP address.'
                                    },
                                    ipAddress: {
                                      type: 'string',
                                      description: 'The IP address associated with the public IP address resource.'
                                    },
                                    publicIPPrefix: {
                                      description: 'The Public IP Prefix this Public IP Address should be allocated from.',
                                      properties: {
                                        id: {
                                          type: 'string',
                                          description: 'Resource ID.'
                                        }
                                      },
                                      'x-ms-azure-resource': true
                                    },
                                    idleTimeoutInMinutes: {
                                      type: 'integer',
                                      format: 'int32',
                                      description: 'The idle timeout of the public IP address.'
                                    },
                                    resourceGuid: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'The resource GUID property of the public IP address resource.'
                                    },
                                    provisioningState: {
                                      readOnly: true,
                                      description: 'The provisioning state of the public IP address resource.',
                                      type: 'string',
                                      enum: [
                                        'Succeeded',
                                        'Updating',
                                        'Deleting',
                                        'Failed'
                                      ],
                                      'x-ms-enum': {
                                        name: 'ProvisioningState',
                                        modelAsString: true
                                      }
                                    },
                                    servicePublicIPAddress: {
                                      description: 'The service public IP address of the public IP address resource.',
                                      properties: [Circular *6],
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    natGateway: {
                                      description: 'The NatGateway for the Public IP address.',
                                      properties: {
                                        sku: {
                                          description: 'The nat gateway SKU.',
                                          properties: {
                                            name: {
                                              type: 'string',
                                              description: 'Name of Nat Gateway SKU.',
                                              enum: [ 'Standard' ],
                                              'x-ms-enum': {
                                                name: 'NatGatewaySkuName',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Nat Gateway properties.',
                                          properties: {
                                            idleTimeoutInMinutes: {
                                              type: 'integer',
                                              format: 'int32',
                                              description: 'The idle timeout of the nat gateway.'
                                            },
                                            publicIpAddresses: {
                                              type: 'array',
                                              items: {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              },
                                              description: 'An array of public ip addresses associated with the nat gateway resource.'
                                            },
                                            publicIpPrefixes: {
                                              type: 'array',
                                              items: {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              },
                                              description: 'An array of public ip prefixes associated with the nat gateway resource.'
                                            },
                                            subnets: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: { id: [Object] },
                                                description: 'Reference to another subresource.',
                                                'x-ms-azure-resource': true
                                              },
                                              description: 'An array of references to the subnets using this nat gateway resource.'
                                            },
                                            resourceGuid: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'The resource GUID property of the NAT gateway resource.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the NAT gateway resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        zones: {
                                          type: 'array',
                                          items: { type: 'string' },
                                          description: 'A list of availability zones denoting the zone in which Nat Gateway should be deployed.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    migrationPhase: {
                                      type: 'string',
                                      description: 'Migration phase of Public IP Address.',
                                      enum: [
                                        'None',
                                        'Prepare',
                                        'Commit',
                                        'Abort',
                                        'Committed'
                                      ],
                                      'x-ms-enum': {
                                        name: 'PublicIPAddressMigrationPhase',
                                        modelAsString: true
                                      }
                                    },
                                    linkedPublicIPAddress: {
                                      description: 'The linked public IP address of the public IP address resource.',
                                      properties: [Circular *6],
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    deleteOption: {
                                      type: 'string',
                                      description: 'Specify what happens to the public IP address when the VM using it is deleted',
                                      enum: [ 'Delete', 'Detach' ],
                                      'x-ms-enum': {
                                        name: 'DeleteOptions',
                                        modelAsString: true
                                      }
                                    }
                                  }
                                },
                                etag: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                },
                                zones: {
                                  type: 'array',
                                  items: { type: 'string' },
                                  description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
                                }
                              },
                              allOf: [
                                {
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    },
                                    name: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'Resource name.'
                                    },
                                    type: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'Resource type.'
                                    },
                                    location: {
                                      type: 'string',
                                      description: 'Resource location.'
                                    },
                                    tags: {
                                      type: 'object',
                                      additionalProperties: { type: 'string' },
                                      description: 'Resource tags.'
                                    }
                                  },
                                  description: 'Common resource representation.',
                                  'x-ms-azure-resource': true
                                }
                              ]
                            },
                            applicationSecurityGroups: {
                              type: 'array',
                              items: {
                                properties: {
                                  properties: {
                                    'x-ms-client-flatten': true,
                                    description: 'Properties of the application security group.',
                                    properties: {
                                      resourceGuid: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'The resource GUID property of the application security group resource. It uniquely identifies a resource, even if the user changes its name or migrate the resource across subscriptions or resource groups.'
                                      },
                                      provisioningState: {
                                        readOnly: true,
                                        description: 'The provisioning state of the application security group resource.',
                                        type: 'string',
                                        enum: [
                                          'Succeeded',
                                          'Updating',
                                          'Deleting',
                                          'Failed'
                                        ],
                                        'x-ms-enum': {
                                          name: 'ProvisioningState',
                                          modelAsString: true
                                        }
                                      }
                                    }
                                  },
                                  etag: {
                                    readOnly: true,
                                    type: 'string',
                                    description: 'A unique read-only string that changes whenever the resource is updated.'
                                  }
                                },
                                allOf: [
                                  {
                                    properties: {
                                      id: {
                                        type: 'string',
                                        description: 'Resource ID.'
                                      },
                                      name: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Resource name.'
                                      },
                                      type: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'Resource type.'
                                      },
                                      location: {
                                        type: 'string',
                                        description: 'Resource location.'
                                      },
                                      tags: {
                                        type: 'object',
                                        additionalProperties: { type: 'string' },
                                        description: 'Resource tags.'
                                      }
                                    },
                                    description: 'Common resource representation.',
                                    'x-ms-azure-resource': true
                                  }
                                ],
                                description: 'An application security group in a resource group.'
                              },
                              description: 'Application security groups in which the IP configuration is included.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the network interface IP configuration.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            },
                            privateLinkConnectionProperties: {
                              description: 'PrivateLinkConnection properties for the network interface.',
                              readOnly: true,
                              properties: {
                                groupId: {
                                  type: 'string',
                                  readOnly: true,
                                  description: 'The group ID for current private link connection.'
                                },
                                requiredMemberName: {
                                  type: 'string',
                                  readOnly: true,
                                  description: 'The required member name for current private link connection.'
                                },
                                fqdns: {
                                  type: 'array',
                                  items: { type: 'string' },
                                  readOnly: true,
                                  description: 'List of FQDNs for current private link connection.'
                                }
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          type: 'string',
                          description: 'Resource type.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'IPConfiguration in a network interface.'
                    },
                    description: 'Collection of references to IPs defined in network interfaces.'
                  },
                  backendAddresses: {
                    type: 'array',
                    items: {
                      properties: {
                        fqdn: {
                          type: 'string',
                          description: 'Fully qualified domain name (FQDN).'
                        },
                        ipAddress: { type: 'string', description: 'IP address.' }
                      },
                      description: 'Backend address of an application gateway.'
                    },
                    description: 'Backend addresses.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the backend address pool resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the backend address pool that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Backend Address Pool of an application gateway.'
          },
          description: 'Backend address pool of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        backendHttpSettingsCollection: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway backend HTTP settings.',
                properties: {
                  port: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The destination port on the backend.'
                  },
                  protocol: {
                    description: 'The protocol used to communicate with the backend.',
                    type: 'string',
                    enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayProtocol',
                      modelAsString: true
                    }
                  },
                  cookieBasedAffinity: {
                    type: 'string',
                    description: 'Cookie based affinity.',
                    enum: [ 'Enabled', 'Disabled' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayCookieBasedAffinity',
                      modelAsString: true
                    }
                  },
                  requestTimeout: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Request timeout in seconds. Application Gateway will fail the request if response is not received within RequestTimeout. Acceptable values are from 1 second to 86400 seconds.'
                  },
                  probe: {
                    description: 'Probe resource of an application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  authenticationCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'Array of references to application gateway authentication certificates.'
                  },
                  trustedRootCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'Array of references to application gateway trusted root certificates.'
                  },
                  connectionDraining: {
                    description: 'Connection draining of the backend http settings resource.',
                    properties: {
                      enabled: {
                        type: 'boolean',
                        description: 'Whether connection draining is enabled or not.'
                      },
                      drainTimeoutInSec: {
                        type: 'integer',
                        format: 'int32',
                        maximum: 3600,
                        exclusiveMaximum: false,
                        minimum: 1,
                        exclusiveMinimum: false,
                        description: 'The number of seconds connection draining is active. Acceptable values are from 1 second to 3600 seconds.'
                      }
                    },
                    required: [ 'enabled', 'drainTimeoutInSec' ]
                  },
                  hostName: {
                    type: 'string',
                    description: 'Host header to be sent to the backend servers.'
                  },
                  pickHostNameFromBackendAddress: {
                    type: 'boolean',
                    description: 'Whether to pick host header should be picked from the host name of the backend server. Default value is false.'
                  },
                  affinityCookieName: {
                    type: 'string',
                    description: 'Cookie name to use for the affinity cookie.'
                  },
                  probeEnabled: {
                    type: 'boolean',
                    description: 'Whether the probe is enabled. Default value is false.'
                  },
                  path: {
                    type: 'string',
                    description: 'Path which should be used as a prefix for all HTTP requests. Null means no path will be prefixed. Default value is null.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the backend HTTP settings resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the backend http settings that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Backend address pool settings of an application gateway.'
          },
          description: 'Backend http settings of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        backendSettingsCollection: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway backend settings.',
                type: 'object',
                properties: {
                  port: {
                    type: 'integer',
                    format: 'int32',
                    description: 'The destination port on the backend.'
                  },
                  protocol: {
                    description: 'The protocol used to communicate with the backend.',
                    type: 'string',
                    enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayProtocol',
                      modelAsString: true
                    }
                  },
                  timeout: {
                    type: 'integer',
                    format: 'int32',
                    description: 'Connection timeout in seconds. Application Gateway will fail the request if response is not received within ConnectionTimeout. Acceptable values are from 1 second to 86400 seconds.'
                  },
                  probe: {
                    description: 'Probe resource of an application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  trustedRootCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'Array of references to application gateway trusted root certificates.'
                  },
                  hostName: {
                    type: 'string',
                    description: 'Server name indication to be sent to the backend servers for Tls protocol.'
                  },
                  pickHostNameFromBackendAddress: {
                    type: 'boolean',
                    description: 'Whether to pick server name indication from the host name of the backend server for Tls protocol. Default value is false.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the backend HTTP settings resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the backend settings that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Backend address pool settings of an application gateway.'
          },
          description: 'Backend settings of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        httpListeners: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway HTTP listener.',
                properties: {
                  frontendIPConfiguration: {
                    description: 'Frontend IP configuration resource of an application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  frontendPort: {
                    description: 'Frontend port resource of an application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  protocol: {
                    description: 'Protocol of the HTTP listener.',
                    type: 'string',
                    enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayProtocol',
                      modelAsString: true
                    }
                  },
                  hostName: {
                    type: 'string',
                    description: 'Host name of HTTP listener.'
                  },
                  sslCertificate: {
                    description: 'SSL certificate resource of an application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  sslProfile: {
                    description: 'SSL profile resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  requireServerNameIndication: {
                    type: 'boolean',
                    description: 'Applicable only if protocol is https. Enables SNI for multi-hosting.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the HTTP listener resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  customErrorConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        statusCode: {
                          type: 'string',
                          description: 'Status code of the application gateway customer error.',
                          enum: [ 'HttpStatus403', 'HttpStatus502' ],
                          'x-ms-enum': {
                            name: 'ApplicationGatewayCustomErrorStatusCode',
                            modelAsString: true
                          }
                        },
                        customErrorPageUrl: {
                          type: 'string',
                          description: 'Error page URL of the application gateway customer error.'
                        }
                      },
                      description: 'Customer error of an application gateway.'
                    },
                    description: 'Custom error configurations of the HTTP listener.'
                  },
                  firewallPolicy: {
                    description: 'Reference to the FirewallPolicy resource.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  hostNames: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'List of Host names for HTTP Listener that allows special wildcard characters as well.'
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the HTTP listener that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Http listener of an application gateway.'
          },
          description: 'Http listeners of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        listeners: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway listener.',
                type: 'object',
                properties: {
                  frontendIPConfiguration: {
                    description: 'Frontend IP configuration resource of an application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  frontendPort: {
                    description: 'Frontend port resource of an application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  protocol: {
                    description: 'Protocol of the listener.',
                    type: 'string',
                    enum: [ 'Http', 'Https', 'Tcp', 'Tls' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayProtocol',
                      modelAsString: true
                    }
                  },
                  sslCertificate: {
                    description: 'SSL certificate resource of an application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  sslProfile: {
                    description: 'SSL profile resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the listener resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the listener that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Listener of an application gateway.'
          },
          description: 'Listeners of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        sslProfiles: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway SSL profile.',
                properties: {
                  trustedClientCertificates: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'Array of references to application gateway trusted client certificates.'
                  },
                  sslPolicy: {
                    description: 'SSL policy of the application gateway resource.',
                    properties: {
                      disabledSslProtocols: {
                        type: 'array',
                        description: 'Ssl protocols to be disabled on application gateway.',
                        items: {
                          type: 'string',
                          description: 'Ssl protocol enums.',
                          enum: [
                            'TLSv1_0',
                            'TLSv1_1',
                            'TLSv1_2',
                            'TLSv1_3'
                          ],
                          'x-ms-enum': {
                            name: 'ApplicationGatewaySslProtocol',
                            modelAsString: true
                          }
                        }
                      },
                      policyType: {
                        type: 'string',
                        description: 'Type of Ssl Policy.',
                        enum: [ 'Predefined', 'Custom', 'CustomV2' ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewaySslPolicyType',
                          modelAsString: true
                        }
                      },
                      policyName: {
                        description: 'Name of Ssl predefined policy.',
                        type: 'string',
                        enum: [
                          'AppGwSslPolicy20150501',
                          'AppGwSslPolicy20170401',
                          'AppGwSslPolicy20170401S',
                          'AppGwSslPolicy20220101',
                          'AppGwSslPolicy20220101S'
                        ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewaySslPolicyName',
                          modelAsString: true
                        }
                      },
                      cipherSuites: {
                        type: 'array',
                        items: {
                          type: 'string',
                          description: 'Ssl cipher suites enums.',
                          enum: [
                            'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384',
                            'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256',
                            'TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA',
                            'TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA',
                            'TLS_DHE_RSA_WITH_AES_256_GCM_SHA384',
                            'TLS_DHE_RSA_WITH_AES_128_GCM_SHA256',
                            'TLS_DHE_RSA_WITH_AES_256_CBC_SHA',
                            'TLS_DHE_RSA_WITH_AES_128_CBC_SHA',
                            'TLS_RSA_WITH_AES_256_GCM_SHA384',
                            'TLS_RSA_WITH_AES_128_GCM_SHA256',
                            'TLS_RSA_WITH_AES_256_CBC_SHA256',
                            'TLS_RSA_WITH_AES_128_CBC_SHA256',
                            'TLS_RSA_WITH_AES_256_CBC_SHA',
                            'TLS_RSA_WITH_AES_128_CBC_SHA',
                            'TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',
                            'TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256',
                            'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',
                            'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256',
                            'TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA',
                            'TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA',
                            'TLS_DHE_DSS_WITH_AES_256_CBC_SHA256',
                            'TLS_DHE_DSS_WITH_AES_128_CBC_SHA256',
                            'TLS_DHE_DSS_WITH_AES_256_CBC_SHA',
                            'TLS_DHE_DSS_WITH_AES_128_CBC_SHA',
                            'TLS_RSA_WITH_3DES_EDE_CBC_SHA',
                            'TLS_DHE_DSS_WITH_3DES_EDE_CBC_SHA',
                            'TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256',
                            'TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384'
                          ],
                          'x-ms-enum': {
                            name: 'ApplicationGatewaySslCipherSuite',
                            modelAsString: true
                          }
                        },
                        description: 'Ssl cipher suites to be enabled in the specified order to application gateway.'
                      },
                      minProtocolVersion: {
                        description: 'Minimum version of Ssl protocol to be supported on application gateway.',
                        type: 'string',
                        enum: [ 'TLSv1_0', 'TLSv1_1', 'TLSv1_2', 'TLSv1_3' ],
                        'x-ms-enum': {
                          name: 'ApplicationGatewaySslProtocol',
                          modelAsString: true
                        }
                      }
                    }
                  },
                  clientAuthConfiguration: {
                    description: 'Client authentication configuration of the application gateway resource.',
                    properties: {
                      verifyClientCertIssuerDN: {
                        type: 'boolean',
                        description: 'Verify client certificate issuer name on the application gateway.'
                      }
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the HTTP listener resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the SSL profile that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'SSL profile of an application gateway.'
          },
          description: 'SSL profiles of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        urlPathMaps: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway URL path map.',
                properties: {
                  defaultBackendAddressPool: {
                    description: 'Default backend address pool resource of URL path map.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  defaultBackendHttpSettings: {
                    description: 'Default backend http settings resource of URL path map.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  defaultRewriteRuleSet: {
                    description: 'Default Rewrite rule set resource of URL path map.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  defaultRedirectConfiguration: {
                    description: 'Default redirect configuration resource of URL path map.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  defaultLoadDistributionPolicy: {
                    description: 'Default Load Distribution Policy resource of URL path map.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  pathRules: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway path rule.',
                          properties: {
                            paths: {
                              type: 'array',
                              items: { type: 'string' },
                              description: 'Path rules of URL path map.'
                            },
                            backendAddressPool: {
                              description: 'Backend address pool resource of URL path map path rule.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            },
                            backendHttpSettings: {
                              description: 'Backend http settings resource of URL path map path rule.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            },
                            redirectConfiguration: {
                              description: 'Redirect configuration resource of URL path map path rule.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            },
                            rewriteRuleSet: {
                              description: 'Rewrite rule set resource of URL path map path rule.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            },
                            loadDistributionPolicy: {
                              description: 'Load Distribution Policy resource of URL path map path rule.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the path rule resource.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            },
                            firewallPolicy: {
                              description: 'Reference to the FirewallPolicy resource.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the path rule that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Path rule of URL path map of an application gateway.'
                    },
                    description: 'Path rule of URL path map resource.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the URL path map resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the URL path map that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'UrlPathMaps give a url path to the backend mapping information for PathBasedRouting.'
          },
          description: 'URL path map of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        requestRoutingRules: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway request routing rule.',
                properties: {
                  ruleType: {
                    type: 'string',
                    description: 'Rule type.',
                    enum: [ 'Basic', 'PathBasedRouting' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayRequestRoutingRuleType',
                      modelAsString: true
                    }
                  },
                  priority: {
                    type: 'integer',
                    format: 'int32',
                    minimum: 1,
                    exclusiveMinimum: false,
                    maximum: 20000,
                    exclusiveMaximum: false,
                    description: 'Priority of the request routing rule.'
                  },
                  backendAddressPool: {
                    description: 'Backend address pool resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  backendHttpSettings: {
                    description: 'Backend http settings resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  httpListener: {
                    description: 'Http listener resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  urlPathMap: {
                    description: 'URL path map resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  rewriteRuleSet: {
                    description: 'Rewrite Rule Set resource in Basic rule of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  redirectConfiguration: {
                    description: 'Redirect configuration resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  loadDistributionPolicy: {
                    description: 'Load Distribution Policy resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the request routing rule resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the request routing rule that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Request routing rule of an application gateway.'
          },
          description: 'Request routing rules of the application gateway resource.'
        },
        routingRules: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway routing rule.',
                type: 'object',
                properties: {
                  ruleType: {
                    type: 'string',
                    description: 'Rule type.',
                    enum: [ 'Basic', 'PathBasedRouting' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayRequestRoutingRuleType',
                      modelAsString: true
                    }
                  },
                  priority: {
                    type: 'integer',
                    format: 'int32',
                    minimum: 1,
                    exclusiveMinimum: false,
                    maximum: 20000,
                    exclusiveMaximum: false,
                    description: 'Priority of the routing rule.'
                  },
                  backendAddressPool: {
                    description: 'Backend address pool resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  backendSettings: {
                    description: 'Backend settings resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  listener: {
                    description: 'Listener resource of the application gateway.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the request routing rule resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                },
                required: [ 'priority' ]
              },
              name: {
                type: 'string',
                description: 'Name of the routing rule that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Routing rule of an application gateway.'
          },
          description: 'Routing rules of the application gateway resource.'
        },
        rewriteRuleSets: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway rewrite rule set.',
                properties: {
                  rewriteRules: {
                    type: 'array',
                    items: {
                      properties: {
                        name: {
                          type: 'string',
                          description: 'Name of the rewrite rule that is unique within an Application Gateway.'
                        },
                        ruleSequence: {
                          type: 'integer',
                          description: 'Rule Sequence of the rewrite rule that determines the order of execution of a particular rule in a RewriteRuleSet.'
                        },
                        conditions: {
                          type: 'array',
                          items: {
                            properties: {
                              variable: {
                                type: 'string',
                                description: 'The condition parameter of the RewriteRuleCondition.'
                              },
                              pattern: {
                                type: 'string',
                                description: 'The pattern, either fixed string or regular expression, that evaluates the truthfulness of the condition.'
                              },
                              ignoreCase: {
                                type: 'boolean',
                                description: 'Setting this parameter to truth value with force the pattern to do a case in-sensitive comparison.'
                              },
                              negate: {
                                type: 'boolean',
                                description: 'Setting this value as truth will force to check the negation of the condition given by the user.'
                              }
                            },
                            description: 'Set of conditions in the Rewrite Rule in Application Gateway.'
                          },
                          description: 'Conditions based on which the action set execution will be evaluated.'
                        },
                        actionSet: {
                          type: 'object',
                          description: 'Set of actions to be done as part of the rewrite Rule.',
                          properties: {
                            requestHeaderConfigurations: {
                              type: 'array',
                              items: {
                                properties: {
                                  headerName: {
                                    type: 'string',
                                    description: 'Header name of the header configuration.'
                                  },
                                  headerValue: {
                                    type: 'string',
                                    description: 'Header value of the header configuration.'
                                  }
                                },
                                description: 'Header configuration of the Actions set in Application Gateway.'
                              },
                              description: 'Request Header Actions in the Action Set.'
                            },
                            responseHeaderConfigurations: {
                              type: 'array',
                              items: {
                                properties: {
                                  headerName: {
                                    type: 'string',
                                    description: 'Header name of the header configuration.'
                                  },
                                  headerValue: {
                                    type: 'string',
                                    description: 'Header value of the header configuration.'
                                  }
                                },
                                description: 'Header configuration of the Actions set in Application Gateway.'
                              },
                              description: 'Response Header Actions in the Action Set.'
                            },
                            urlConfiguration: {
                              description: 'Url Configuration Action in the Action Set.',
                              properties: {
                                modifiedPath: {
                                  type: 'string',
                                  description: 'Url path which user has provided for url rewrite. Null means no path will be updated. Default value is null.'
                                },
                                modifiedQueryString: {
                                  type: 'string',
                                  description: 'Query string which user has provided for url rewrite. Null means no query string will be updated. Default value is null.'
                                },
                                reroute: {
                                  type: 'boolean',
                                  description: 'If set as true, it will re-evaluate the url path map provided in path based request routing rules using modified path. Default value is false.'
                                }
                              }
                            }
                          }
                        }
                      },
                      description: 'Rewrite rule of an application gateway.'
                    },
                    description: 'Rewrite rules in the rewrite rule set.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the rewrite rule set resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the rewrite rule set that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Rewrite rule set of an application gateway.'
          },
          description: 'Rewrite rules for the application gateway resource.'
        },
        redirectConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway redirect configuration.',
                properties: {
                  redirectType: {
                    type: 'string',
                    description: 'HTTP redirection type.',
                    enum: [ 'Permanent', 'Found', 'SeeOther', 'Temporary' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayRedirectType',
                      modelAsString: true
                    }
                  },
                  targetListener: {
                    description: 'Reference to a listener to redirect the request to.',
                    properties: {
                      id: { type: 'string', description: 'Resource ID.' }
                    },
                    'x-ms-azure-resource': true
                  },
                  targetUrl: {
                    type: 'string',
                    description: 'Url to redirect the request to.'
                  },
                  includePath: {
                    type: 'boolean',
                    description: 'Include path in the redirected url.'
                  },
                  includeQueryString: {
                    type: 'boolean',
                    description: 'Include query string in the redirected url.'
                  },
                  requestRoutingRules: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'Request routing specifying redirect configuration.'
                  },
                  urlPathMaps: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'Url path maps specifying default redirect configuration.'
                  },
                  pathRules: {
                    type: 'array',
                    items: {
                      properties: {
                        id: { type: 'string', description: 'Resource ID.' }
                      },
                      description: 'Reference to another subresource.',
                      'x-ms-azure-resource': true
                    },
                    description: 'Path rules specifying redirect configuration.'
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the redirect configuration that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Redirect configuration of an application gateway.'
          },
          description: 'Redirect configurations of the application gateway resource. For default limits, see [Application Gateway limits](https://docs.microsoft.com/azure/azure-subscription-service-limits#application-gateway-limits).'
        },
        webApplicationFirewallConfiguration: {
          description: 'Web application firewall configuration.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Whether the web application firewall is enabled or not.'
            },
            firewallMode: {
              type: 'string',
              description: 'Web application firewall mode.',
              enum: [ 'Detection', 'Prevention' ],
              'x-ms-enum': {
                name: 'ApplicationGatewayFirewallMode',
                modelAsString: true
              }
            },
            ruleSetType: {
              type: 'string',
              description: "The type of the web application firewall rule set. Possible values are: 'OWASP'."
            },
            ruleSetVersion: {
              type: 'string',
              description: 'The version of the rule set type.'
            },
            disabledRuleGroups: {
              type: 'array',
              items: {
                properties: {
                  ruleGroupName: {
                    type: 'string',
                    description: 'The name of the rule group that will be disabled.'
                  },
                  rules: {
                    type: 'array',
                    items: {
                      type: 'integer',
                      format: 'int32',
                      'x-nullable': false
                    },
                    description: 'The list of rules that will be disabled. If null, all rules of the rule group will be disabled.'
                  }
                },
                required: [ 'ruleGroupName' ],
                description: 'Allows to disable rules within a rule group or an entire rule group.'
              },
              description: 'The disabled rule groups.'
            },
            requestBodyCheck: {
              type: 'boolean',
              description: 'Whether allow WAF to check request Body.'
            },
            maxRequestBodySize: {
              type: 'integer',
              format: 'int32',
              maximum: 128,
              exclusiveMaximum: false,
              minimum: 8,
              exclusiveMinimum: false,
              description: 'Maximum request body size for WAF.'
            },
            maxRequestBodySizeInKb: {
              type: 'integer',
              format: 'int32',
              maximum: 128,
              exclusiveMaximum: false,
              minimum: 8,
              exclusiveMinimum: false,
              description: 'Maximum request body size in Kb for WAF.'
            },
            fileUploadLimitInMb: {
              type: 'integer',
              format: 'int32',
              minimum: 0,
              exclusiveMinimum: false,
              description: 'Maximum file upload size in Mb for WAF.'
            },
            exclusions: {
              type: 'array',
              items: {
                properties: {
                  matchVariable: {
                    type: 'string',
                    description: 'The variable to be excluded.'
                  },
                  selectorMatchOperator: {
                    type: 'string',
                    description: 'When matchVariable is a collection, operate on the selector to specify which elements in the collection this exclusion applies to.'
                  },
                  selector: {
                    type: 'string',
                    description: 'When matchVariable is a collection, operator used to specify which elements in the collection this exclusion applies to.'
                  }
                },
                required: [
                  'matchVariable',
                  'selectorMatchOperator',
                  'selector'
                ],
                description: 'Allow to exclude some variable satisfy the condition for the WAF check.'
              },
              description: 'The exclusion list.'
            }
          },
          required: [
            'enabled',
            'firewallMode',
            'ruleSetType',
            'ruleSetVersion'
          ]
        },
        firewallPolicy: {
          description: 'Reference to the FirewallPolicy resource.',
          properties: { id: { type: 'string', description: 'Resource ID.' } },
          'x-ms-azure-resource': true
        },
        enableHttp2: {
          type: 'boolean',
          description: 'Whether HTTP2 is enabled on the application gateway resource.'
        },
        enableFips: {
          type: 'boolean',
          description: 'Whether FIPS is enabled on the application gateway resource.'
        },
        autoscaleConfiguration: {
          description: 'Autoscale Configuration.',
          properties: {
            minCapacity: {
              type: 'integer',
              format: 'int32',
              minimum: 0,
              exclusiveMinimum: false,
              description: 'Lower bound on number of Application Gateway capacity.'
            },
            maxCapacity: {
              type: 'integer',
              format: 'int32',
              minimum: 2,
              exclusiveMinimum: false,
              description: 'Upper bound on number of Application Gateway capacity.'
            }
          },
          required: [ 'minCapacity' ]
        },
        privateLinkConfigurations: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway private link configuration.',
                properties: {
                  ipConfigurations: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of an application gateway private link ip configuration.',
                          properties: {
                            privateIPAddress: {
                              type: 'string',
                              description: 'The private IP address of the IP configuration.'
                            },
                            privateIPAllocationMethod: {
                              description: 'The private IP address allocation method.',
                              type: 'string',
                              enum: [ 'Static', 'Dynamic' ],
                              'x-ms-enum': {
                                name: 'IPAllocationMethod',
                                modelAsString: true
                              }
                            },
                            subnet: {
                              description: 'Reference to the subnet resource.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            },
                            primary: {
                              type: 'boolean',
                              description: 'Whether the ip configuration is primary or not.'
                            },
                            provisioningState: {
                              readOnly: true,
                              description: 'The provisioning state of the application gateway private link IP configuration.',
                              type: 'string',
                              enum: [
                                'Succeeded',
                                'Updating',
                                'Deleting',
                                'Failed'
                              ],
                              'x-ms-enum': {
                                name: 'ProvisioningState',
                                modelAsString: true
                              }
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'The name of application gateway private link ip configuration.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'The resource type.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'The application gateway private link ip configuration.'
                    },
                    description: 'An array of application gateway private link ip configurations.'
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the application gateway private link configuration.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the private link configuration that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Private Link Configuration on an application gateway.'
          },
          description: 'PrivateLink configurations on application gateway.'
        },
        privateEndpointConnections: {
          readOnly: true,
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway private endpoint connection.',
                properties: {
                  privateEndpoint: {
                    readOnly: true,
                    description: 'The resource of private end point.',
                    properties: <ref *7> {
                      extendedLocation: {
                        description: 'The extended location of the load balancer.',
                        properties: {
                          name: {
                            type: 'string',
                            description: 'The name of the extended location.'
                          },
                          type: {
                            description: 'The type of the extended location.',
                            type: 'string',
                            enum: [ 'EdgeZone' ],
                            'x-ms-enum': {
                              name: 'ExtendedLocationTypes',
                              modelAsString: true
                            }
                          }
                        }
                      },
                      properties: {
                        'x-ms-client-flatten': true,
                        description: 'Properties of the private endpoint.',
                        properties: {
                          subnet: {
                            description: 'The ID of the subnet from which the private IP will be allocated.',
                            properties: <ref *5> {
                              properties: {
                                'x-ms-client-flatten': true,
                                description: 'Properties of the subnet.',
                                properties: {
                                  addressPrefix: {
                                    type: 'string',
                                    description: 'The address prefix for the subnet.'
                                  },
                                  addressPrefixes: {
                                    type: 'array',
                                    items: { type: 'string' },
                                    description: 'List of address prefixes for the subnet.'
                                  },
                                  networkSecurityGroup: {
                                    description: 'The reference to the NetworkSecurityGroup resource.',
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the network security group.',
                                        properties: {
                                          flushConnection: {
                                            type: 'boolean',
                                            description: 'When enabled, flows created from Network Security Group connections will be re-evaluated when rules are updates. Initial enablement will trigger re-evaluation.'
                                          },
                                          securityRules: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the security rule.',
                                                  properties: [Object],
                                                  required: [Array]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                },
                                                type: {
                                                  type: 'string',
                                                  description: 'The type of the resource.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Network security rule.'
                                            },
                                            description: 'A collection of security rules of the network security group.'
                                          },
                                          defaultSecurityRules: {
                                            readOnly: true,
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the security rule.',
                                                  properties: [Object],
                                                  required: [Array]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                },
                                                type: {
                                                  type: 'string',
                                                  description: 'The type of the resource.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Network security rule.'
                                            },
                                            description: 'The default security rules of network security group.'
                                          },
                                          networkInterfaces: {
                                            readOnly: true,
                                            type: 'array',
                                            items: {
                                              properties: {
                                                extendedLocation: {
                                                  description: 'The extended location of the network interface.',
                                                  properties: [Object]
                                                },
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the network interface.',
                                                  properties: [Object]
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Common resource representation.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'A network interface in a resource group.'
                                            },
                                            description: 'A collection of references to network interfaces.'
                                          },
                                          subnets: {
                                            readOnly: true,
                                            type: 'array',
                                            items: {
                                              properties: [Circular *5],
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Subnet in a virtual network resource.'
                                            },
                                            description: 'A collection of references to subnets.'
                                          },
                                          flowLogs: {
                                            readOnly: true,
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the flow log.',
                                                  required: [Array],
                                                  properties: [Object]
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Common resource representation.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'A flow log resource.'
                                            },
                                            description: 'A collection of references to flow log resources.'
                                          },
                                          resourceGuid: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'The resource GUID property of the network security group resource.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the network security group resource.',
                                            type: 'string',
                                            enum: [
                                              'Succeeded',
                                              'Updating',
                                              'Deleting',
                                              'Failed'
                                            ],
                                            'x-ms-enum': {
                                              name: 'ProvisioningState',
                                              modelAsString: true
                                            }
                                          }
                                        }
                                      },
                                      etag: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'A unique read-only string that changes whenever the resource is updated.'
                                      }
                                    },
                                    allOf: [
                                      {
                                        properties: {
                                          id: {
                                            type: 'string',
                                            description: 'Resource ID.'
                                          },
                                          name: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Resource name.'
                                          },
                                          type: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Resource type.'
                                          },
                                          location: {
                                            type: 'string',
                                            description: 'Resource location.'
                                          },
                                          tags: {
                                            type: 'object',
                                            additionalProperties: { type: 'string' },
                                            description: 'Resource tags.'
                                          }
                                        },
                                        description: 'Common resource representation.',
                                        'x-ms-azure-resource': true
                                      }
                                    ]
                                  },
                                  routeTable: {
                                    description: 'The reference to the RouteTable resource.',
                                    properties: {
                                      properties: {
                                        'x-ms-client-flatten': true,
                                        description: 'Properties of the route table.',
                                        properties: {
                                          routes: {
                                            type: 'array',
                                            items: {
                                              properties: {
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Properties of the route.',
                                                  properties: [Object],
                                                  required: [Array]
                                                },
                                                name: {
                                                  type: 'string',
                                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                },
                                                type: {
                                                  type: 'string',
                                                  description: 'The type of the resource.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Route resource.'
                                            },
                                            description: 'Collection of routes contained within a route table.'
                                          },
                                          subnets: {
                                            readOnly: true,
                                            type: 'array',
                                            items: {
                                              properties: [Circular *5],
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ],
                                              description: 'Subnet in a virtual network resource.'
                                            },
                                            description: 'A collection of references to subnets.'
                                          },
                                          disableBgpRoutePropagation: {
                                            type: 'boolean',
                                            description: 'Whether to disable the routes learned by BGP on that route table. True means disable.'
                                          },
                                          provisioningState: {
                                            readOnly: true,
                                            description: 'The provisioning state of the route table resource.',
                                            type: 'string',
                                            enum: [
                                              'Succeeded',
                                              'Updating',
                                              'Deleting',
                                              'Failed'
                                            ],
                                            'x-ms-enum': {
                                              name: 'ProvisioningState',
                                              modelAsString: true
                                            }
                                          },
                                          resourceGuid: {
                                            type: 'string',
                                            readOnly: true,
                                            description: 'The resource GUID property of the route table.'
                                          }
                                        }
                                      },
                                      etag: {
                                        readOnly: true,
                                        type: 'string',
                                        description: 'A unique read-only string that changes whenever the resource is updated.'
                                      }
                                    },
                                    allOf: [
                                      {
                                        properties: {
                                          id: {
                                            type: 'string',
                                            description: 'Resource ID.'
                                          },
                                          name: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Resource name.'
                                          },
                                          type: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Resource type.'
                                          },
                                          location: {
                                            type: 'string',
                                            description: 'Resource location.'
                                          },
                                          tags: {
                                            type: 'object',
                                            additionalProperties: { type: 'string' },
                                            description: 'Resource tags.'
                                          }
                                        },
                                        description: 'Common resource representation.',
                                        'x-ms-azure-resource': true
                                      }
                                    ]
                                  },
                                  natGateway: {
                                    description: 'Nat gateway associated with this subnet.',
                                    properties: {
                                      id: {
                                        type: 'string',
                                        description: 'Resource ID.'
                                      }
                                    },
                                    'x-ms-azure-resource': true
                                  },
                                  serviceEndpoints: {
                                    type: 'array',
                                    items: {
                                      properties: {
                                        service: {
                                          type: 'string',
                                          description: 'The type of the endpoint service.'
                                        },
                                        locations: {
                                          type: 'array',
                                          items: { type: 'string' },
                                          description: 'A list of locations.'
                                        },
                                        provisioningState: {
                                          readOnly: true,
                                          description: 'The provisioning state of the service endpoint resource.',
                                          type: 'string',
                                          enum: [
                                            'Succeeded',
                                            'Updating',
                                            'Deleting',
                                            'Failed'
                                          ],
                                          'x-ms-enum': {
                                            name: 'ProvisioningState',
                                            modelAsString: true
                                          }
                                        }
                                      },
                                      description: 'The service endpoint properties.'
                                    },
                                    description: 'An array of service endpoints.'
                                  },
                                  serviceEndpointPolicies: {
                                    type: 'array',
                                    items: {
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the service end point policy.',
                                          properties: {
                                            serviceEndpointPolicyDefinitions: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Service Endpoint policy definitions.'
                                              },
                                              description: 'A collection of service endpoint policy definitions of the service endpoint policy.'
                                            },
                                            subnets: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: [Circular *5],
                                                allOf: [ [Object] ],
                                                description: 'Subnet in a virtual network resource.'
                                              },
                                              description: 'A collection of references to subnets.'
                                            },
                                            resourceGuid: {
                                              type: 'string',
                                              readOnly: true,
                                              description: 'The resource GUID property of the service endpoint policy resource.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the service endpoint policy resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            },
                                            serviceAlias: {
                                              type: 'string',
                                              description: 'The alias indicating if the policy belongs to a service'
                                            },
                                            contextualServiceEndpointPolicies: {
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'A collection of contextual service endpoint policy.'
                                            }
                                          }
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        },
                                        kind: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'Kind of service endpoint policy. This is metadata used for the Azure portal experience.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'Service End point policy resource.'
                                    },
                                    description: 'An array of service endpoint policies.'
                                  },
                                  privateEndpoints: {
                                    readOnly: true,
                                    type: 'array',
                                    items: {
                                      properties: [Circular *7],
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'Private endpoint resource.'
                                    },
                                    description: 'An array of references to private endpoints.'
                                  },
                                  ipConfigurations: {
                                    readOnly: true,
                                    type: 'array',
                                    items: {
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the IP configuration.',
                                          properties: {
                                            privateIPAddress: {
                                              type: 'string',
                                              description: 'The private IP address of the IP configuration.'
                                            },
                                            privateIPAllocationMethod: {
                                              description: 'The private IP address allocation method.',
                                              default: 'Dynamic',
                                              type: 'string',
                                              enum: [ 'Static', 'Dynamic' ],
                                              'x-ms-enum': {
                                                name: 'IPAllocationMethod',
                                                modelAsString: true
                                              }
                                            },
                                            subnet: {
                                              description: 'The reference to the subnet resource.',
                                              properties: [Circular *5],
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ]
                                            },
                                            publicIPAddress: {
                                              description: 'The reference to the public IP resource.',
                                              properties: <ref *6> {
                                                extendedLocation: {
                                                  description: 'The extended location of the public ip address.',
                                                  properties: [Object]
                                                },
                                                sku: {
                                                  description: 'The public IP address SKU.',
                                                  properties: [Object]
                                                },
                                                properties: {
                                                  'x-ms-client-flatten': true,
                                                  description: 'Public IP address properties.',
                                                  properties: [Object]
                                                },
                                                etag: {
                                                  readOnly: true,
                                                  type: 'string',
                                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                                },
                                                zones: {
                                                  type: 'array',
                                                  items: [Object],
                                                  description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'
                                                }
                                              },
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Common resource representation.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ]
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the IP configuration resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        name: {
                                          type: 'string',
                                          description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'IP configuration.'
                                    },
                                    description: 'An array of references to the network interface IP configurations using subnet.'
                                  },
                                  ipConfigurationProfiles: {
                                    readOnly: true,
                                    type: 'array',
                                    items: {
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the IP configuration profile.',
                                          properties: {
                                            subnet: {
                                              description: 'The reference to the subnet resource to create a container network interface ip configuration.',
                                              properties: [Circular *5],
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'Reference to another subresource.',
                                                  'x-ms-azure-resource': true
                                                }
                                              ]
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the IP configuration profile resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        name: {
                                          type: 'string',
                                          description: 'The name of the resource. This name can be used to access the resource.'
                                        },
                                        type: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'Sub Resource type.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'IP configuration profile child resource.'
                                    },
                                    description: 'Array of IP configuration profiles which reference this subnet.'
                                  },
                                  ipAllocations: {
                                    type: 'array',
                                    items: {
                                      properties: {
                                        id: {
                                          type: 'string',
                                          description: 'Resource ID.'
                                        }
                                      },
                                      description: 'Reference to another subresource.',
                                      'x-ms-azure-resource': true
                                    },
                                    description: 'Array of IpAllocation which reference this subnet.'
                                  },
                                  resourceNavigationLinks: {
                                    readOnly: true,
                                    type: 'array',
                                    items: {
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Resource navigation link properties format.',
                                          properties: {
                                            linkedResourceType: {
                                              type: 'string',
                                              description: 'Resource type of the linked resource.'
                                            },
                                            link: {
                                              type: 'string',
                                              description: 'Link to the external resource.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the resource navigation link resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        name: {
                                          type: 'string',
                                          description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                        },
                                        id: {
                                          type: 'string',
                                          readOnly: true,
                                          description: 'Resource navigation link identifier.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        },
                                        type: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'Resource type.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'ResourceNavigationLink resource.'
                                    },
                                    description: 'An array of references to the external resources using subnet.'
                                  },
                                  serviceAssociationLinks: {
                                    readOnly: true,
                                    type: 'array',
                                    items: {
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Resource navigation link properties format.',
                                          properties: {
                                            linkedResourceType: {
                                              type: 'string',
                                              description: 'Resource type of the linked resource.'
                                            },
                                            link: {
                                              type: 'string',
                                              description: 'Link to the external resource.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the service association link resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            },
                                            allowDelete: {
                                              type: 'boolean',
                                              description: 'If true, the resource can be deleted.'
                                            },
                                            locations: {
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'A list of locations.'
                                            }
                                          }
                                        },
                                        name: {
                                          type: 'string',
                                          description: 'Name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        },
                                        type: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'Resource type.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'ServiceAssociationLink resource.'
                                    },
                                    description: 'An array of references to services injecting into this subnet.'
                                  },
                                  delegations: {
                                    type: 'array',
                                    items: {
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the subnet.',
                                          properties: {
                                            serviceName: {
                                              type: 'string',
                                              description: 'The name of the service to whom the subnet should be delegated (e.g. Microsoft.Sql/servers).'
                                            },
                                            actions: {
                                              readOnly: true,
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'The actions permitted to the service upon delegation.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the service delegation resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        name: {
                                          type: 'string',
                                          description: 'The name of the resource that is unique within a subnet. This name can be used to access the resource.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        },
                                        type: {
                                          type: 'string',
                                          description: 'Resource type.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'Details the service to which the subnet is delegated.'
                                    },
                                    description: 'An array of references to the delegations on the subnet.'
                                  },
                                  purpose: {
                                    type: 'string',
                                    readOnly: true,
                                    description: 'A read-only string identifying the intention of use for this subnet based on delegations and other user-defined properties.'
                                  },
                                  provisioningState: {
                                    readOnly: true,
                                    description: 'The provisioning state of the subnet resource.',
                                    type: 'string',
                                    enum: [
                                      'Succeeded',
                                      'Updating',
                                      'Deleting',
                                      'Failed'
                                    ],
                                    'x-ms-enum': {
                                      name: 'ProvisioningState',
                                      modelAsString: true
                                    }
                                  },
                                  privateEndpointNetworkPolicies: {
                                    type: 'string',
                                    default: 'Disabled',
                                    description: 'Enable or Disable apply network policies on private end point in the subnet.',
                                    enum: [ 'Enabled', 'Disabled' ],
                                    'x-ms-enum': {
                                      name: 'VirtualNetworkPrivateEndpointNetworkPolicies',
                                      modelAsString: true
                                    }
                                  },
                                  privateLinkServiceNetworkPolicies: {
                                    type: 'string',
                                    default: 'Enabled',
                                    description: 'Enable or Disable apply network policies on private link service in the subnet.',
                                    enum: [ 'Enabled', 'Disabled' ],
                                    'x-ms-enum': {
                                      name: 'VirtualNetworkPrivateLinkServiceNetworkPolicies',
                                      modelAsString: true
                                    }
                                  },
                                  applicationGatewayIpConfigurations: {
                                    type: 'array',
                                    items: {
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the application gateway IP configuration.',
                                          properties: {
                                            subnet: {
                                              description: 'Reference to the subnet resource. A subnet from where application gateway gets its private address.',
                                              properties: {
                                                id: {
                                                  type: 'string',
                                                  description: 'Resource ID.'
                                                }
                                              },
                                              'x-ms-azure-resource': true
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the application gateway IP configuration resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        name: {
                                          type: 'string',
                                          description: 'Name of the IP configuration that is unique within an Application Gateway.'
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        },
                                        type: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'Type of the resource.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            }
                                          },
                                          description: 'Reference to another subresource.',
                                          'x-ms-azure-resource': true
                                        }
                                      ],
                                      description: 'IP configuration of an application gateway. Currently 1 public and 1 private IP configuration is allowed.'
                                    },
                                    description: 'Application gateway IP configurations of virtual network resource.'
                                  }
                                }
                              },
                              name: {
                                type: 'string',
                                description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                              },
                              etag: {
                                readOnly: true,
                                type: 'string',
                                description: 'A unique read-only string that changes whenever the resource is updated.'
                              },
                              type: {
                                type: 'string',
                                description: 'Resource type.'
                              }
                            },
                            allOf: [
                              {
                                properties: {
                                  id: {
                                    type: 'string',
                                    description: 'Resource ID.'
                                  }
                                },
                                description: 'Reference to another subresource.',
                                'x-ms-azure-resource': true
                              }
                            ]
                          },
                          networkInterfaces: {
                            type: 'array',
                            readOnly: true,
                            items: <ref *8> {
                              properties: {
                                extendedLocation: {
                                  description: 'The extended location of the network interface.',
                                  properties: {
                                    name: {
                                      type: 'string',
                                      description: 'The name of the extended location.'
                                    },
                                    type: {
                                      description: 'The type of the extended location.',
                                      type: 'string',
                                      enum: [ 'EdgeZone' ],
                                      'x-ms-enum': {
                                        name: 'ExtendedLocationTypes',
                                        modelAsString: true
                                      }
                                    }
                                  }
                                },
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Properties of the network interface.',
                                  properties: {
                                    virtualMachine: {
                                      description: 'The reference to a virtual machine.',
                                      readOnly: true,
                                      properties: {
                                        id: {
                                          type: 'string',
                                          description: 'Resource ID.'
                                        }
                                      },
                                      'x-ms-azure-resource': true
                                    },
                                    networkSecurityGroup: {
                                      description: 'The reference to the NetworkSecurityGroup resource.',
                                      properties: {
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the network security group.',
                                          properties: {
                                            flushConnection: {
                                              type: 'boolean',
                                              description: 'When enabled, flows created from Network Security Group connections will be re-evaluated when rules are updates. Initial enablement will trigger re-evaluation.'
                                            },
                                            securityRules: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Network security rule.'
                                              },
                                              description: 'A collection of security rules of the network security group.'
                                            },
                                            defaultSecurityRules: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Network security rule.'
                                              },
                                              description: 'The default security rules of network security group.'
                                            },
                                            networkInterfaces: {
                                              readOnly: true,
                                              type: 'array',
                                              items: [Circular *8],
                                              description: 'A collection of references to network interfaces.'
                                            },
                                            subnets: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: <ref *5> {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Subnet in a virtual network resource.'
                                              },
                                              description: 'A collection of references to subnets.'
                                            },
                                            flowLogs: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'A flow log resource.'
                                              },
                                              description: 'A collection of references to flow log resources.'
                                            },
                                            resourceGuid: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'The resource GUID property of the network security group resource.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the network security group resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    privateEndpoint: {
                                      readOnly: true,
                                      description: 'A reference to the private endpoint to which the network interface is linked.',
                                      properties: [Circular *7],
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    ipConfigurations: {
                                      type: 'array',
                                      items: <ref *4> {
                                        properties: <ref *2> {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Network interface IP configuration properties.',
                                            properties: {
                                              gatewayLoadBalancer: {
                                                description: 'The reference to gateway load balancer frontend IP.',
                                                properties: { id: [Object] },
                                                'x-ms-azure-resource': true
                                              },
                                              virtualNetworkTaps: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'Virtual Network Tap resource.'
                                                },
                                                description: 'The reference to Virtual Network Taps.'
                                              },
                                              applicationGatewayBackendAddressPools: {
                                                type: 'array',
                                                items: <ref *3> {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'Backend Address Pool of an application gateway.'
                                                },
                                                description: 'The reference to ApplicationGatewayBackendAddressPool resource.'
                                              },
                                              loadBalancerBackendAddressPools: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'Pool of backend IP addresses.'
                                                },
                                                description: 'The reference to LoadBalancerBackendAddressPool resource.'
                                              },
                                              loadBalancerInboundNatRules: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'Inbound NAT rule of the load balancer.'
                                                },
                                                description: 'A list of references of LoadBalancerInboundNatRules.'
                                              },
                                              privateIPAddress: {
                                                type: 'string',
                                                description: 'Private IP address of the IP configuration.'
                                              },
                                              privateIPAllocationMethod: {
                                                description: 'The private IP address allocation method.',
                                                type: 'string',
                                                enum: [ 'Static', 'Dynamic' ],
                                                'x-ms-enum': {
                                                  name: 'IPAllocationMethod',
                                                  modelAsString: true
                                                }
                                              },
                                              privateIPAddressVersion: {
                                                description: 'Whether the specific IP configuration is IPv4 or IPv6. Default is IPv4.',
                                                type: 'string',
                                                enum: [ 'IPv4', 'IPv6' ],
                                                'x-ms-enum': {
                                                  name: 'IPVersion',
                                                  modelAsString: true
                                                }
                                              },
                                              subnet: {
                                                description: 'Subnet bound to the IP configuration.',
                                                properties: <ref *5> {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ]
                                              },
                                              primary: {
                                                type: 'boolean',
                                                description: 'Whether this is a primary customer address on the network interface.'
                                              },
                                              publicIPAddress: {
                                                description: 'Public IP address bound to the IP configuration.',
                                                properties: <ref *6> {
                                                  extendedLocation: [Object],
                                                  sku: [Object],
                                                  properties: [Object],
                                                  etag: [Object],
                                                  zones: [Object]
                                                },
                                                allOf: [ [Object] ]
                                              },
                                              applicationSecurityGroups: {
                                                type: 'array',
                                                items: {
                                                  properties: [Object],
                                                  allOf: [Array],
                                                  description: 'An application security group in a resource group.'
                                                },
                                                description: 'Application security groups in which the IP configuration is included.'
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the network interface IP configuration.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              },
                                              privateLinkConnectionProperties: {
                                                description: 'PrivateLinkConnection properties for the network interface.',
                                                readOnly: true,
                                                properties: {
                                                  groupId: [Object],
                                                  requiredMemberName: [Object],
                                                  fqdns: [Object]
                                                }
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          },
                                          type: {
                                            type: 'string',
                                            description: 'Resource type.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'IPConfiguration in a network interface.'
                                      },
                                      description: 'A list of IPConfigurations of the network interface.'
                                    },
                                    tapConfigurations: {
                                      readOnly: true,
                                      type: 'array',
                                      items: {
                                        properties: {
                                          properties: {
                                            'x-ms-client-flatten': true,
                                            description: 'Properties of the Virtual Network Tap configuration.',
                                            properties: {
                                              virtualNetworkTap: {
                                                description: 'The reference to the Virtual Network Tap resource.',
                                                properties: <ref *1> {
                                                  properties: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ]
                                              },
                                              provisioningState: {
                                                readOnly: true,
                                                description: 'The provisioning state of the network interface tap configuration resource.',
                                                type: 'string',
                                                enum: [
                                                  'Succeeded',
                                                  'Updating',
                                                  'Deleting',
                                                  'Failed'
                                                ],
                                                'x-ms-enum': {
                                                  name: 'ProvisioningState',
                                                  modelAsString: true
                                                }
                                              }
                                            }
                                          },
                                          name: {
                                            type: 'string',
                                            description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                          },
                                          etag: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'A unique read-only string that changes whenever the resource is updated.'
                                          },
                                          type: {
                                            readOnly: true,
                                            type: 'string',
                                            description: 'Sub Resource type.'
                                          }
                                        },
                                        allOf: [
                                          {
                                            properties: {
                                              id: {
                                                type: 'string',
                                                description: 'Resource ID.'
                                              }
                                            },
                                            description: 'Reference to another subresource.',
                                            'x-ms-azure-resource': true
                                          }
                                        ],
                                        description: 'Tap configuration in a Network Interface.'
                                      },
                                      description: 'A list of TapConfigurations of the network interface.'
                                    },
                                    dnsSettings: {
                                      description: 'The DNS settings in network interface.',
                                      properties: {
                                        dnsServers: {
                                          type: 'array',
                                          items: { type: 'string' },
                                          description: "List of DNS servers IP addresses. Use 'AzureProvidedDNS' to switch to azure provided DNS resolution. 'AzureProvidedDNS' value cannot be combined with other IPs, it must be the only value in dnsServers collection."
                                        },
                                        appliedDnsServers: {
                                          readOnly: true,
                                          type: 'array',
                                          items: { type: 'string' },
                                          description: 'If the VM that uses this NIC is part of an Availability Set, then this list will have the union of all DNS servers from all NICs that are part of the Availability Set. This property is what is configured on each of those VMs.'
                                        },
                                        internalDnsNameLabel: {
                                          type: 'string',
                                          description: 'Relative DNS name for this NIC used for internal communications between VMs in the same virtual network.'
                                        },
                                        internalFqdn: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'Fully qualified DNS name supporting internal communications between VMs in the same virtual network.'
                                        },
                                        internalDomainNameSuffix: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'Even if internalDnsNameLabel is not specified, a DNS entry is created for the primary NIC of the VM. This DNS name can be constructed by concatenating the VM name with the value of internalDomainNameSuffix.'
                                        }
                                      }
                                    },
                                    macAddress: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'The MAC address of the network interface.'
                                    },
                                    primary: {
                                      readOnly: true,
                                      type: 'boolean',
                                      description: 'Whether this is a primary network interface on a virtual machine.'
                                    },
                                    vnetEncryptionSupported: {
                                      readOnly: true,
                                      type: 'boolean',
                                      description: 'Whether the virtual machine this nic is attached to supports encryption.'
                                    },
                                    enableAcceleratedNetworking: {
                                      type: 'boolean',
                                      description: 'If the network interface is configured for accelerated networking. Not applicable to VM sizes which require accelerated networking.'
                                    },
                                    enableIPForwarding: {
                                      type: 'boolean',
                                      description: 'Indicates whether IP forwarding is enabled on this network interface.'
                                    },
                                    hostedWorkloads: {
                                      type: 'array',
                                      items: { type: 'string' },
                                      readOnly: true,
                                      description: 'A list of references to linked BareMetal resources.'
                                    },
                                    dscpConfiguration: {
                                      description: 'A reference to the dscp configuration to which the network interface is linked.',
                                      readOnly: true,
                                      properties: {
                                        id: {
                                          type: 'string',
                                          description: 'Resource ID.'
                                        }
                                      },
                                      'x-ms-azure-resource': true
                                    },
                                    resourceGuid: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'The resource GUID property of the network interface resource.'
                                    },
                                    provisioningState: {
                                      readOnly: true,
                                      description: 'The provisioning state of the network interface resource.',
                                      type: 'string',
                                      enum: [
                                        'Succeeded',
                                        'Updating',
                                        'Deleting',
                                        'Failed'
                                      ],
                                      'x-ms-enum': {
                                        name: 'ProvisioningState',
                                        modelAsString: true
                                      }
                                    },
                                    workloadType: {
                                      type: 'string',
                                      description: 'WorkloadType of the NetworkInterface for BareMetal resources'
                                    },
                                    nicType: {
                                      type: 'string',
                                      description: 'Type of Network Interface resource.',
                                      enum: [ 'Standard', 'Elastic' ],
                                      'x-ms-enum': {
                                        name: 'NetworkInterfaceNicType',
                                        modelAsString: true
                                      }
                                    },
                                    privateLinkService: {
                                      description: 'Privatelinkservice of the network interface resource.',
                                      properties: {
                                        extendedLocation: {
                                          description: 'The extended location of the load balancer.',
                                          properties: {
                                            name: {
                                              type: 'string',
                                              description: 'The name of the extended location.'
                                            },
                                            type: {
                                              description: 'The type of the extended location.',
                                              type: 'string',
                                              enum: [ 'EdgeZone' ],
                                              'x-ms-enum': {
                                                name: 'ExtendedLocationTypes',
                                                modelAsString: true
                                              }
                                            }
                                          }
                                        },
                                        properties: {
                                          'x-ms-client-flatten': true,
                                          description: 'Properties of the private link service.',
                                          properties: {
                                            loadBalancerFrontendIpConfigurations: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object],
                                                  zones: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'Frontend IP address of the load balancer.'
                                              },
                                              description: 'An array of references to the load balancer IP configurations.'
                                            },
                                            ipConfigurations: {
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  etag: [Object],
                                                  type: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'The private link service ip configuration.'
                                              },
                                              description: 'An array of private link service IP configurations.'
                                            },
                                            networkInterfaces: {
                                              type: 'array',
                                              readOnly: true,
                                              items: [Circular *8],
                                              description: 'An array of references to the network interfaces created for this private link service.'
                                            },
                                            provisioningState: {
                                              readOnly: true,
                                              description: 'The provisioning state of the private link service resource.',
                                              type: 'string',
                                              enum: [
                                                'Succeeded',
                                                'Updating',
                                                'Deleting',
                                                'Failed'
                                              ],
                                              'x-ms-enum': {
                                                name: 'ProvisioningState',
                                                modelAsString: true
                                              }
                                            },
                                            privateEndpointConnections: {
                                              readOnly: true,
                                              type: 'array',
                                              items: {
                                                properties: {
                                                  properties: [Object],
                                                  name: [Object],
                                                  type: [Object],
                                                  etag: [Object]
                                                },
                                                allOf: [ [Object] ],
                                                description: 'PrivateEndpointConnection resource.'
                                              },
                                              description: 'An array of list about connections to the private endpoint.'
                                            },
                                            visibility: {
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'The base resource set for visibility and auto-approval.'
                                                }
                                              ],
                                              description: 'The visibility list of the private link service.'
                                            },
                                            autoApproval: {
                                              allOf: [
                                                {
                                                  properties: [Object],
                                                  description: 'The base resource set for visibility and auto-approval.'
                                                }
                                              ],
                                              description: 'The auto-approval list of the private link service.'
                                            },
                                            fqdns: {
                                              type: 'array',
                                              items: { type: 'string' },
                                              description: 'The list of Fqdn.'
                                            },
                                            alias: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'The alias of the private link service.'
                                            },
                                            enableProxyProtocol: {
                                              type: 'boolean',
                                              description: 'Whether the private link service is enabled for proxy protocol or not.'
                                            }
                                          }
                                        },
                                        etag: {
                                          readOnly: true,
                                          type: 'string',
                                          description: 'A unique read-only string that changes whenever the resource is updated.'
                                        }
                                      },
                                      allOf: [
                                        {
                                          properties: {
                                            id: {
                                              type: 'string',
                                              description: 'Resource ID.'
                                            },
                                            name: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource name.'
                                            },
                                            type: {
                                              readOnly: true,
                                              type: 'string',
                                              description: 'Resource type.'
                                            },
                                            location: {
                                              type: 'string',
                                              description: 'Resource location.'
                                            },
                                            tags: {
                                              type: 'object',
                                              additionalProperties: { type: 'string' },
                                              description: 'Resource tags.'
                                            }
                                          },
                                          description: 'Common resource representation.',
                                          'x-ms-azure-resource': true
                                        }
                                      ]
                                    },
                                    migrationPhase: {
                                      type: 'string',
                                      description: 'Migration phase of Network Interface resource.',
                                      enum: [
                                        'None',
                                        'Prepare',
                                        'Commit',
                                        'Abort',
                                        'Committed'
                                      ],
                                      'x-ms-enum': {
                                        name: 'NetworkInterfaceMigrationPhase',
                                        modelAsString: true
                                      }
                                    },
                                    auxiliaryMode: {
                                      type: 'string',
                                      description: 'Auxiliary mode of Network Interface resource.',
                                      enum: [
                                        'None',
                                        'MaxConnections',
                                        'Floating'
                                      ],
                                      'x-ms-enum': {
                                        name: 'NetworkInterfaceAuxiliaryMode',
                                        modelAsString: true
                                      }
                                    }
                                  }
                                },
                                etag: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                }
                              },
                              allOf: [
                                {
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    },
                                    name: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'Resource name.'
                                    },
                                    type: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'Resource type.'
                                    },
                                    location: {
                                      type: 'string',
                                      description: 'Resource location.'
                                    },
                                    tags: {
                                      type: 'object',
                                      additionalProperties: { type: 'string' },
                                      description: 'Resource tags.'
                                    }
                                  },
                                  description: 'Common resource representation.',
                                  'x-ms-azure-resource': true
                                }
                              ],
                              description: 'A network interface in a resource group.'
                            },
                            description: 'An array of references to the network interfaces created for this private endpoint.'
                          },
                          provisioningState: {
                            readOnly: true,
                            description: 'The provisioning state of the private endpoint resource.',
                            type: 'string',
                            enum: [
                              'Succeeded',
                              'Updating',
                              'Deleting',
                              'Failed'
                            ],
                            'x-ms-enum': {
                              name: 'ProvisioningState',
                              modelAsString: true
                            }
                          },
                          privateLinkServiceConnections: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Properties of the private link service connection.',
                                  properties: {
                                    provisioningState: {
                                      readOnly: true,
                                      description: 'The provisioning state of the private link service connection resource.',
                                      type: 'string',
                                      enum: [
                                        'Succeeded',
                                        'Updating',
                                        'Deleting',
                                        'Failed'
                                      ],
                                      'x-ms-enum': {
                                        name: 'ProvisioningState',
                                        modelAsString: true
                                      }
                                    },
                                    privateLinkServiceId: {
                                      type: 'string',
                                      description: 'The resource id of private link service.'
                                    },
                                    groupIds: {
                                      type: 'array',
                                      items: { type: 'string' },
                                      description: 'The ID(s) of the group(s) obtained from the remote resource that this private endpoint should connect to.'
                                    },
                                    requestMessage: {
                                      type: 'string',
                                      description: 'A message passed to the owner of the remote resource with this connection request. Restricted to 140 chars.'
                                    },
                                    privateLinkServiceConnectionState: {
                                      description: 'A collection of read-only information about the state of the connection to the remote resource.',
                                      properties: {
                                        status: {
                                          type: 'string',
                                          description: 'Indicates whether the connection has been Approved/Rejected/Removed by the owner of the service.'
                                        },
                                        description: {
                                          type: 'string',
                                          description: 'The reason for approval/rejection of the connection.'
                                        },
                                        actionsRequired: {
                                          type: 'string',
                                          description: 'A message indicating if changes on the service provider require any updates on the consumer.'
                                        }
                                      }
                                    }
                                  }
                                },
                                name: {
                                  type: 'string',
                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                },
                                type: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'The resource type.'
                                },
                                etag: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                }
                              },
                              allOf: [
                                {
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    }
                                  },
                                  description: 'Reference to another subresource.',
                                  'x-ms-azure-resource': true
                                }
                              ],
                              description: 'PrivateLinkServiceConnection resource.'
                            },
                            description: 'A grouping of information about the connection to the remote resource.'
                          },
                          manualPrivateLinkServiceConnections: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Properties of the private link service connection.',
                                  properties: {
                                    provisioningState: {
                                      readOnly: true,
                                      description: 'The provisioning state of the private link service connection resource.',
                                      type: 'string',
                                      enum: [
                                        'Succeeded',
                                        'Updating',
                                        'Deleting',
                                        'Failed'
                                      ],
                                      'x-ms-enum': {
                                        name: 'ProvisioningState',
                                        modelAsString: true
                                      }
                                    },
                                    privateLinkServiceId: {
                                      type: 'string',
                                      description: 'The resource id of private link service.'
                                    },
                                    groupIds: {
                                      type: 'array',
                                      items: { type: 'string' },
                                      description: 'The ID(s) of the group(s) obtained from the remote resource that this private endpoint should connect to.'
                                    },
                                    requestMessage: {
                                      type: 'string',
                                      description: 'A message passed to the owner of the remote resource with this connection request. Restricted to 140 chars.'
                                    },
                                    privateLinkServiceConnectionState: {
                                      description: 'A collection of read-only information about the state of the connection to the remote resource.',
                                      properties: {
                                        status: {
                                          type: 'string',
                                          description: 'Indicates whether the connection has been Approved/Rejected/Removed by the owner of the service.'
                                        },
                                        description: {
                                          type: 'string',
                                          description: 'The reason for approval/rejection of the connection.'
                                        },
                                        actionsRequired: {
                                          type: 'string',
                                          description: 'A message indicating if changes on the service provider require any updates on the consumer.'
                                        }
                                      }
                                    }
                                  }
                                },
                                name: {
                                  type: 'string',
                                  description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
                                },
                                type: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'The resource type.'
                                },
                                etag: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                }
                              },
                              allOf: [
                                {
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    }
                                  },
                                  description: 'Reference to another subresource.',
                                  'x-ms-azure-resource': true
                                }
                              ],
                              description: 'PrivateLinkServiceConnection resource.'
                            },
                            description: 'A grouping of information about the connection to the remote resource. Used when the network admin does not have access to approve connections to the remote resource.'
                          },
                          customDnsConfigs: {
                            type: 'array',
                            items: {
                              properties: {
                                fqdn: {
                                  type: 'string',
                                  description: 'Fqdn that resolves to private endpoint ip address.'
                                },
                                ipAddresses: {
                                  type: 'array',
                                  items: { type: 'string' },
                                  description: 'A list of private ip addresses of the private endpoint.'
                                }
                              },
                              description: 'Contains custom Dns resolution configuration from customer.'
                            },
                            description: 'An array of custom dns configurations.'
                          },
                          applicationSecurityGroups: {
                            type: 'array',
                            items: {
                              properties: {
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Properties of the application security group.',
                                  properties: {
                                    resourceGuid: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'The resource GUID property of the application security group resource. It uniquely identifies a resource, even if the user changes its name or migrate the resource across subscriptions or resource groups.'
                                    },
                                    provisioningState: {
                                      readOnly: true,
                                      description: 'The provisioning state of the application security group resource.',
                                      type: 'string',
                                      enum: [
                                        'Succeeded',
                                        'Updating',
                                        'Deleting',
                                        'Failed'
                                      ],
                                      'x-ms-enum': {
                                        name: 'ProvisioningState',
                                        modelAsString: true
                                      }
                                    }
                                  }
                                },
                                etag: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                }
                              },
                              allOf: [
                                {
                                  properties: {
                                    id: {
                                      type: 'string',
                                      description: 'Resource ID.'
                                    },
                                    name: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'Resource name.'
                                    },
                                    type: {
                                      readOnly: true,
                                      type: 'string',
                                      description: 'Resource type.'
                                    },
                                    location: {
                                      type: 'string',
                                      description: 'Resource location.'
                                    },
                                    tags: {
                                      type: 'object',
                                      additionalProperties: { type: 'string' },
                                      description: 'Resource tags.'
                                    }
                                  },
                                  description: 'Common resource representation.',
                                  'x-ms-azure-resource': true
                                }
                              ],
                              description: 'An application security group in a resource group.'
                            },
                            description: 'Application security groups in which the private endpoint IP configuration is included.'
                          },
                          ipConfigurations: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                properties: {
                                  'x-ms-client-flatten': true,
                                  description: 'Properties of private endpoint IP configurations.',
                                  type: 'object',
                                  properties: {
                                    groupId: {
                                      type: 'string',
                                      description: 'The ID of a group obtained from the remote resource that this private endpoint should connect to.'
                                    },
                                    memberName: {
                                      type: 'string',
                                      description: 'The member name of a group obtained from the remote resource that this private endpoint should connect to.'
                                    },
                                    privateIPAddress: {
                                      type: 'string',
                                      description: "A private ip address obtained from the private endpoint's subnet."
                                    }
                                  }
                                },
                                name: {
                                  type: 'string',
                                  description: 'The name of the resource that is unique within a resource group.'
                                },
                                type: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'The resource type.'
                                },
                                etag: {
                                  readOnly: true,
                                  type: 'string',
                                  description: 'A unique read-only string that changes whenever the resource is updated.'
                                }
                              },
                              description: 'An IP Configuration of the private endpoint.'
                            },
                            description: "A list of IP configurations of the private endpoint. This will be used to map to the First Party Service's endpoints."
                          },
                          customNetworkInterfaceName: {
                            type: 'string',
                            description: 'The custom name of the network interface attached to the private endpoint.'
                          }
                        }
                      },
                      etag: {
                        readOnly: true,
                        type: 'string',
                        description: 'A unique read-only string that changes whenever the resource is updated.'
                      }
                    },
                    allOf: [
                      {
                        properties: {
                          id: {
                            type: 'string',
                            description: 'Resource ID.'
                          },
                          name: {
                            readOnly: true,
                            type: 'string',
                            description: 'Resource name.'
                          },
                          type: {
                            readOnly: true,
                            type: 'string',
                            description: 'Resource type.'
                          },
                          location: {
                            type: 'string',
                            description: 'Resource location.'
                          },
                          tags: {
                            type: 'object',
                            additionalProperties: { type: 'string' },
                            description: 'Resource tags.'
                          }
                        },
                        description: 'Common resource representation.',
                        'x-ms-azure-resource': true
                      }
                    ]
                  },
                  privateLinkServiceConnectionState: {
                    description: 'A collection of information about the state of the connection between service consumer and provider.',
                    properties: {
                      status: {
                        type: 'string',
                        description: 'Indicates whether the connection has been Approved/Rejected/Removed by the owner of the service.'
                      },
                      description: {
                        type: 'string',
                        description: 'The reason for approval/rejection of the connection.'
                      },
                      actionsRequired: {
                        type: 'string',
                        description: 'A message indicating if changes on the service provider require any updates on the consumer.'
                      }
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the application gateway private endpoint connection resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  },
                  linkIdentifier: {
                    readOnly: true,
                    type: 'string',
                    description: 'The consumer link id.'
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the private endpoint connection on an application gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Private Endpoint connection on an application gateway.'
          },
          description: 'Private Endpoint connections on application gateway.'
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the application gateway resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the application gateway resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        customErrorConfigurations: {
          type: 'array',
          items: {
            properties: {
              statusCode: {
                type: 'string',
                description: 'Status code of the application gateway customer error.',
                enum: [ 'HttpStatus403', 'HttpStatus502' ],
                'x-ms-enum': {
                  name: 'ApplicationGatewayCustomErrorStatusCode',
                  modelAsString: true
                }
              },
              customErrorPageUrl: {
                type: 'string',
                description: 'Error page URL of the application gateway customer error.'
              }
            },
            description: 'Customer error of an application gateway.'
          },
          description: 'Custom error configurations of the application gateway resource.'
        },
        forceFirewallPolicyAssociation: {
          type: 'boolean',
          description: 'If true, associates a firewall policy with an application gateway regardless whether the policy differs from the WAF Config.'
        },
        loadDistributionPolicies: {
          type: 'array',
          items: {
            properties: {
              properties: {
                'x-ms-client-flatten': true,
                description: 'Properties of the application gateway load distribution policy.',
                properties: {
                  loadDistributionTargets: {
                    type: 'array',
                    items: {
                      properties: {
                        properties: {
                          'x-ms-client-flatten': true,
                          description: 'Properties of the application gateway load distribution target.',
                          properties: {
                            weightPerServer: {
                              type: 'integer',
                              format: 'int32',
                              maximum: 100,
                              exclusiveMaximum: false,
                              minimum: 1,
                              exclusiveMinimum: false,
                              description: 'Weight per server. Range between 1 and 100.'
                            },
                            backendAddressPool: {
                              description: 'Backend address pool resource of the application gateway.',
                              properties: {
                                id: {
                                  type: 'string',
                                  description: 'Resource ID.'
                                }
                              },
                              'x-ms-azure-resource': true
                            }
                          }
                        },
                        name: {
                          type: 'string',
                          description: 'Name of the load distribution policy that is unique within an Application Gateway.'
                        },
                        etag: {
                          readOnly: true,
                          type: 'string',
                          description: 'A unique read-only string that changes whenever the resource is updated.'
                        },
                        type: {
                          readOnly: true,
                          type: 'string',
                          description: 'Type of the resource.'
                        }
                      },
                      allOf: [
                        {
                          properties: {
                            id: {
                              type: 'string',
                              description: 'Resource ID.'
                            }
                          },
                          description: 'Reference to another subresource.',
                          'x-ms-azure-resource': true
                        }
                      ],
                      description: 'Load Distribution Target of an application gateway.'
                    },
                    description: 'Load Distribution Targets resource of an application gateway.'
                  },
                  loadDistributionAlgorithm: {
                    description: 'Load Distribution Targets resource of an application gateway.',
                    type: 'string',
                    enum: [ 'RoundRobin', 'LeastConnections', 'IpHash' ],
                    'x-ms-enum': {
                      name: 'ApplicationGatewayLoadDistributionAlgorithm',
                      modelAsString: true
                    }
                  },
                  provisioningState: {
                    readOnly: true,
                    description: 'The provisioning state of the Load Distribution Policy resource.',
                    type: 'string',
                    enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
                  }
                }
              },
              name: {
                type: 'string',
                description: 'Name of the load distribution policy that is unique within an Application Gateway.'
              },
              etag: {
                readOnly: true,
                type: 'string',
                description: 'A unique read-only string that changes whenever the resource is updated.'
              },
              type: {
                readOnly: true,
                type: 'string',
                description: 'Type of the resource.'
              }
            },
            allOf: [
              {
                properties: { id: { type: 'string', description: 'Resource ID.' } },
                description: 'Reference to another subresource.',
                'x-ms-azure-resource': true
              }
            ],
            description: 'Load Distribution Policy of an application gateway.'
          },
          description: 'Load distribution policies of the application gateway resource.'
        },
        globalConfiguration: {
          description: 'Global Configuration.',
          properties: {
            enableRequestBuffering: {
              type: 'boolean',
              description: 'Enable request buffering.'
            },
            enableResponseBuffering: {
              type: 'boolean',
              description: 'Enable response buffering.'
            }
          }
        }
      }
    },
    etag: {
      readOnly: true,
      type: 'string',
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'A list of availability zones denoting where the resource needs to come from.'
    },
    identity: {
      description: 'The identity of the application gateway, if configured.',
      properties: {
        principalId: {
          readOnly: true,
          type: 'string',
          description: 'The principal id of the system assigned identity. This property will only be provided for a system assigned identity.'
        },
        tenantId: {
          readOnly: true,
          type: 'string',
          description: 'The tenant id of the system assigned identity. This property will only be provided for a system assigned identity.'
        },
        type: {
          type: 'string',
          description: "The type of identity used for the resource. The type 'SystemAssigned, UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the virtual machine.",
          enum: [
            'SystemAssigned',
            'UserAssigned',
            'SystemAssigned, UserAssigned',
            'None'
          ],
          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }
        },
        userAssignedIdentities: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              principalId: {
                readOnly: true,
                type: 'string',
                description: 'The principal id of user assigned identity.'
              },
              clientId: {
                readOnly: true,
                type: 'string',
                description: 'The client id of user assigned identity.'
              }
            }
          },
          description: "The list of user identities associated with resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'."
        }
      }
    }
  },
  allOf: [
    {
      properties: {
        id: { type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type.'
        },
        location: { type: 'string', description: 'Resource location.' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags.'
        }
      },
      description: 'Common resource representation.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Application gateway resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/applicationGateway.json).
