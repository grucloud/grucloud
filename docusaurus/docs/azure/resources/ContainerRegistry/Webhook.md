---
id: Webhook
title: Webhook
---
Provides a **Webhook** from the **ContainerRegistry** group
## Examples
### WebhookCreate
```js
exports.createResources = () => [
  {
    type: "Webhook",
    group: "ContainerRegistry",
    name: "myWebhook",
    properties: () => ({
      location: "westus",
      tags: { key: "value" },
      properties: {
        serviceUri: "http://myservice.com",
        customHeaders: {
          Authorization:
            "Basic 000000000000000000000000000000000000000000000000000",
        },
        status: "enabled",
        scope: "myRepository",
        actions: ["push"],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      registry: "myRegistry",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
## Swagger Schema
```js
{
  description: 'The parameters for creating a webhook.',
  required: [ 'location' ],
  type: 'object',
  properties: {
    tags: {
      description: 'The tags for the webhook.',
      type: 'object',
      additionalProperties: { type: 'string' }
    },
    location: {
      description: 'The location of the webhook. This cannot be changed after the resource is created.',
      type: 'string'
    },
    properties: {
      description: 'The properties that the webhook will be created with.',
      'x-ms-client-flatten': true,
      required: [ 'serviceUri', 'actions' ],
      type: 'object',
      properties: {
        serviceUri: {
          description: 'The service URI for the webhook to post notifications.',
          type: 'string',
          'x-ms-secret': true
        },
        customHeaders: {
          description: 'Custom headers that will be added to the webhook notifications.',
          type: 'object',
          additionalProperties: { type: 'string' },
          'x-ms-secret': true
        },
        status: {
          description: 'The status of the webhook at the time the operation was called.',
          enum: [ 'enabled', 'disabled' ],
          type: 'string',
          'x-ms-enum': { name: 'WebhookStatus', modelAsString: true }
        },
        scope: {
          description: "The scope of repositories where the event can be triggered. For example, 'foo:*' means events for all tags under repository 'foo'. 'foo:bar' means events for 'foo:bar' only. 'foo' is equivalent to 'foo:latest'. Empty means all events.",
          type: 'string'
        },
        actions: {
          description: 'The list of actions that trigger the webhook to post notifications.',
          type: 'array',
          items: {
            enum: [
              'push',
              'delete',
              'quarantine',
              'chart_push',
              'chart_delete'
            ],
            type: 'string',
            'x-ms-enum': { name: 'WebhookAction', modelAsString: true }
          }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2021-12-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2021-12-01-preview/containerregistry.json).
