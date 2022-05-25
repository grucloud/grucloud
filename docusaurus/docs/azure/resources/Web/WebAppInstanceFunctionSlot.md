---
id: WebAppInstanceFunctionSlot
title: WebAppInstanceFunctionSlot
---
Provides a **WebAppInstanceFunctionSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
- [WebAppSlot](../Web/WebAppSlot.md)
## Swagger Schema
```js
{
  description: 'Function information.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'FunctionEnvelope resource specific properties',
      type: 'object',
      properties: {
        function_app_id: { description: 'Function App ID.', type: 'string' },
        script_root_path_href: { description: 'Script root path URI.', type: 'string' },
        script_href: { description: 'Script URI.', type: 'string' },
        config_href: { description: 'Config URI.', type: 'string' },
        test_data_href: { description: 'Test data URI.', type: 'string' },
        secrets_file_href: { description: 'Secrets file URI.', type: 'string' },
        href: { description: 'Function URI.', type: 'string' },
        config: { description: 'Config information.', type: 'object' },
        files: {
          description: 'File list.',
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        test_data: {
          description: 'Test data used when testing via the Azure Portal.',
          type: 'string'
        },
        invoke_url_template: { description: 'The invocation URL', type: 'string' },
        language: { description: 'The function language', type: 'string' },
        isDisabled: {
          description: 'Gets or sets a value indicating whether the function is disabled',
          type: 'boolean'
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json).
