---
id: FirewallRule
title: FirewallRule
---
Provides a **FirewallRule** from the **DBforPostgreSQL** group
## Examples
### FirewallRuleCreate
```js
provider.DBforPostgreSQL.makeFirewallRule({
  name: "myFirewallRule",
  properties: () => ({
    properties: { startIpAddress: "0.0.0.0", endIpAddress: "255.255.255.255" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    server: resources.DBforPostgreSQL.Server["myServer"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Server](../DBforPostgreSQL/Server.md)
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2021-06-01/postgresql.json).
