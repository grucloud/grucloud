---
id: Server
title: Server
---
Provides a **Server** from the **DBforPostgreSQL** group
## Examples
### Create a new server
```js
provider.DBforPostgreSQL.makeServer({
  name: "myServer",
  properties: () => ({
    location: "westus",
    sku: { tier: "GeneralPurpose", name: "Standard_D4s_v3" },
    properties: {
      administratorLogin: "cloudsa",
      administratorLoginPassword: "password",
      version: "12",
      availabilityZone: "1",
      createMode: "Create",
      storage: { storageSizeGB: 512 },
      backup: { backupRetentionDays: 7, geoRedundantBackup: "Disabled" },
      network: {
        delegatedSubnetResourceId:
          "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/testrg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/test-vnet-subnet",
        privateDnsZoneArmResourceId:
          "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourcegroups/testrg/providers/Microsoft.Network/privateDnsZones/test-private-dns-zone.postgres.database.azure.com",
      },
      highAvailability: { mode: "ZoneRedundant" },
    },
    tags: { ElasticServer: "1" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```

### Create a database as a point in time restore
```js
provider.DBforPostgreSQL.makeServer({
  name: "myServer",
  properties: () => ({
    location: "westus",
    properties: {
      createMode: "PointInTimeRestore",
      sourceServerResourceId:
        "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/testrg/providers/Microsoft.DBforPostgreSQL/flexibleServers/sourcepgservername",
      pointInTimeUTC: "2021-06-27T00:04:59.4078005+00:00",
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
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2021-06-01/postgresql.json).
