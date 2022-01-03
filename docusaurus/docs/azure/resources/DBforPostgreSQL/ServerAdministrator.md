---
id: ServerAdministrator
title: ServerAdministrator
---
Provides a **ServerAdministrator** from the **DBforPostgreSQL** group
## Examples
### ServerAdministratorCreate
```js
provider.DBforPostgreSQL.makeServerAdministrator({
  name: "myServerAdministrator",
  properties: () => ({
    properties: {
      administratorType: "ActiveDirectory",
      login: "bob@contoso.com",
      sid: "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c",
      tenantId: "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    server:
      resources.Network.P2sVpnServerConfiguration[
        "myP2sVpnServerConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [P2sVpnServerConfiguration](../Network/P2sVpnServerConfiguration.md)
## Misc
The resource version is `2017-12-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/postgresql.json).
