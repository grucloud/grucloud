---
id: FirewallPolicyIdpsSignaturesOverride
title: FirewallPolicyIdpsSignaturesOverride
---
Provides a **FirewallPolicyIdpsSignaturesOverride** from the **Network** group
## Examples
### put signature overrides
```js
provider.Network.makeFirewallPolicyIdpsSignaturesOverride({
  name: "myFirewallPolicyIdpsSignaturesOverride",
  properties: () => ({
    id: "/subscriptions/e747cc13-97d4-4a79-b463-42d7f4e558f2/resourceGroups/rg1/providers/Microsoft.Network/firewallPolicies/firewallPolicy/signatureOverrides/default",
    name: "default",
    type: "Microsoft.Network/firewallPolicies/signatureOverrides",
    properties: { signatures: { 2000105: "Off", 2000106: "Deny" } },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    securityPartnerProvider:
      resources.Network.SecurityPartnerProvider["mySecurityPartnerProvider"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [SecurityPartnerProvider](../Network/SecurityPartnerProvider.md)
- [FirewallPolicy](../Network/FirewallPolicy.md)
## Swagger Schema
```js
{
  'x-ms-azure-resource': true,
  type: 'object',
  description: 'Contains all specific policy signatures overrides for the IDPS',
  properties: {
    name: {
      type: 'string',
      description: 'Contains the name of the resource (default)'
    },
    id: {
      description: 'Will contain the resource id of the signature override resource',
      type: 'string'
    },
    type: {
      type: 'string',
      description: 'Will contain the type of the resource: Microsoft.Network/firewallPolicies/intrusionDetectionSignaturesOverrides'
    },
    properties: {
      type: 'object',
      description: 'Will contain the properties of the resource (the actual signature overrides)',
      properties: {
        signatures: { type: 'object', additionalProperties: { type: 'string' } }
      }
    }
  }
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/firewallPolicy.json).
