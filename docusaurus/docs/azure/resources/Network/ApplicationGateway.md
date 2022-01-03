---
id: ApplicationGateway
title: ApplicationGateway
---
Provides a **ApplicationGateway** from the **Network** group
## Examples
### Create Application Gateway
```js
provider.Network.makeApplicationGateway({
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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/applicationGateway.json).
