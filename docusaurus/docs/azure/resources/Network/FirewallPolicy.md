---
id: FirewallPolicy
title: FirewallPolicy
---
Provides a **FirewallPolicy** from the **Network** group
## Examples
### Create FirewallPolicy
```js
provider.Network.makeFirewallPolicy({
  name: "myFirewallPolicy",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    properties: {
      threatIntelMode: "Alert",
      threatIntelWhitelist: {
        ipAddresses: ["20.3.4.5"],
        fqdns: ["*.microsoft.com"],
      },
      insights: {
        isEnabled: true,
        retentionDays: 100,
        logAnalyticsResources: {
          workspaces: [
            {
              region: "westus",
              workspaceId: {
                id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/workspace1",
              },
            },
            {
              region: "eastus",
              workspaceId: {
                id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/workspace2",
              },
            },
          ],
          defaultWorkspaceId: {
            id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/defaultWorkspace",
          },
        },
      },
      snat: { privateRanges: ["IANAPrivateRanges"] },
      sql: { allowSqlRedirect: true },
      dnsSettings: {
        servers: ["30.3.4.5"],
        enableProxy: true,
        requireProxyForNetworkRules: false,
      },
      explicitProxySettings: {
        enableExplicitProxy: true,
        httpPort: 8087,
        httpsPort: 8087,
        pacFilePort: 8087,
        pacFile:
          "https://tinawstorage.file.core.windows.net/?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacuptfx&se=2021-06-04T07:01:12Z&st=2021-06-03T23:01:12Z&sip=68.65.171.11&spr=https&sig=Plsa0RRVpGbY0IETZZOT6znOHcSro71LLTTbzquYPgs%3D",
      },
      sku: { tier: "Premium" },
      intrusionDetection: {
        mode: "Alert",
        configuration: {
          signatureOverrides: [{ id: "2525004", mode: "Deny" }],
          bypassTrafficSettings: [
            {
              name: "bypassRule1",
              description: "Rule 1",
              protocol: "TCP",
              sourceAddresses: ["1.2.3.4"],
              destinationAddresses: ["5.6.7.8"],
              destinationPorts: ["*"],
            },
          ],
        },
      },
      transportSecurity: {
        certificateAuthority: {
          name: "clientcert",
          keyVaultSecretId: "https://kv/secret",
        },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    workspace: resources.OperationalInsights.Workspace["myWorkspace"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/firewallPolicy.json).
