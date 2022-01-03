---
id: Database
title: Database
---
Provides a **Database** from the **DBforPostgreSQL** group
## Examples
### Create a database
```js
provider.DBforPostgreSQL.makeDatabase({
  name: "myDatabase",
  properties: () => ({
    properties: { charset: "utf8", collation: "en_US.utf8" },
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2021-06-01/Databases.json).
