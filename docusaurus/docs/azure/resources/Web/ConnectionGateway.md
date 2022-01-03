---
id: ConnectionGateway
title: ConnectionGateway
---
Provides a **ConnectionGateway** from the **Web** group
## Examples
### Replace a connection gateway definition
```js
provider.Web.makeConnectionGateway({
  name: "myConnectionGateway",
  properties: () => ({
    properties: {
      connectionGatewayInstallation: {
        id: "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/providers/Microsoft.Web/locations/westus/connectionGatewayInstallations/865dccd1-5d5c-45fe-b5a0-249d4de4134c",
      },
      contactInformation: ["test123@microsoft.com"],
      displayName: "test123",
      machineName: "TEST123",
      status: "Installed",
      backendUri: "https://WABI-WEST-US-redirect.analysis.windows.net",
    },
    id: "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/testResourceGroup/providers/Microsoft.Web/connectionGateways/test123",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2016-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2016-06-01/logicAppsManagementClient.json).
