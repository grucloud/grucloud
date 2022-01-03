---
id: WebAppFtpAllowedSlot
title: WebAppFtpAllowedSlot
---
Provides a **WebAppFtpAllowedSlot** from the **Web** group
## Examples
### Update FTP Allowed
```js
provider.Web.makeWebAppFtpAllowedSlot({
  name: "myWebAppFtpAllowedSlot",
  properties: () => ({ properties: { allow: true } }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    name: resources.Web.Site["mySite"],
    slot: resources.Web.SiteSlot["mySiteSlot"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
- [SiteSlot](../Web/SiteSlot.md)
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/WebApps.json).
