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
## Swagger Schema
```js
{
  description: 'A server security alert policy.',
  type: 'object',
  allOf: [
    {
      title: 'Proxy Resource',
      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',
      type: 'object',
      allOf: [
        {
          title: 'Resource',
          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
          type: 'object',
          properties: {
            id: {
              readOnly: true,
              type: 'string',
              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
            },
            name: {
              readOnly: true,
              type: 'string',
              description: 'The name of the resource'
            },
            type: {
              readOnly: true,
              type: 'string',
              description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
            }
          },
          'x-ms-azure-resource': true
        }
      ]
    }
  ],
  properties: {
    properties: {
      description: 'Resource properties.',
      'x-ms-client-flatten': true,
      required: [ 'state' ],
      type: 'object',
      properties: {
        state: {
          description: 'Specifies the state of the policy, whether it is enabled or disabled.',
          enum: [ 'Enabled', 'Disabled' ],
          type: 'string',
          'x-ms-enum': {
            name: 'ServerSecurityAlertPolicyState',
            modelAsString: false
          }
        },
        disabledAlerts: {
          description: 'Specifies an array of alerts that are disabled. Allowed values are: Sql_Injection, Sql_Injection_Vulnerability, Access_Anomaly',
          type: 'array',
          items: { type: 'string' }
        },
        emailAddresses: {
          description: 'Specifies an array of e-mail addresses to which the alert is sent.',
          type: 'array',
          items: { type: 'string' }
        },
        emailAccountAdmins: {
          description: 'Specifies that the alert is sent to the account administrators.',
          type: 'boolean'
        },
        storageEndpoint: {
          description: 'Specifies the blob storage endpoint (e.g. https://MyAccount.blob.core.windows.net). This blob storage will hold all Threat Detection audit logs.',
          type: 'string'
        },
        storageAccountAccessKey: {
          description: 'Specifies the identifier key of the Threat Detection audit storage account.',
          type: 'string'
        },
        retentionDays: {
          format: 'int32',
          description: 'Specifies the number of days to keep in the Threat Detection audit logs.',
          type: 'integer'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2017-12-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/ServerSecurityAlertPolicies.json).
