---
id: Configuration
title: Configuration
---
Provides a **Configuration** from the **DBforPostgreSQL** group
## Examples
### Update a user configuration
```js
provider.DBforPostgreSQL.makeConfiguration({
  name: "myConfiguration",
  properties: () => ({ properties: { value: "on", source: "user-override" } }),
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
