---
id: ServerSecurityAlertPolicy
title: ServerSecurityAlertPolicy
---
Provides a **ServerSecurityAlertPolicy** from the **DBforPostgreSQL** group
## Examples
### Update a server's threat detection policy with all parameters
```js
provider.DBforPostgreSQL.makeServerSecurityAlertPolicy({
  name: "myServerSecurityAlertPolicy",
  properties: () => ({
    properties: {
      state: "Enabled",
      emailAccountAdmins: true,
      emailAddresses: ["testSecurityAlert@microsoft.com"],
      disabledAlerts: ["Access_Anomaly", "Usage_Anomaly"],
      retentionDays: 5,
      storageAccountAccessKey:
        "sdlfkjabc+sdlfkjsdlkfsjdfLDKFTERLKFDFKLjsdfksjdflsdkfD2342309432849328476458/3RSD==",
      storageEndpoint: "https://mystorage.blob.core.windows.net",
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

### Update a server's threat detection policy with minimal parameters
```js
provider.DBforPostgreSQL.makeServerSecurityAlertPolicy({
  name: "myServerSecurityAlertPolicy",
  properties: () => ({
    properties: { state: "Disabled", emailAccountAdmins: true },
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

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/ServerSecurityAlertPolicies.json).
