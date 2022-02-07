---
id: BuildStep
title: BuildStep
---
Provides a **BuildStep** from the **ContainerRegistry** group
## Examples
### BuildSteps_Create
```js
provider.ContainerRegistry.makeBuildStep({
  name: "myBuildStep",
  properties: () => ({
    properties: {
      type: "Docker",
      imageNames: ["azurerest:testtag"],
      dockerFilePath: "subfolder/Dockerfile",
      contextPath: "dockerfiles",
      isPushEnabled: true,
      noCache: true,
      buildArguments: [
        {
          type: "DockerBuildArgument",
          name: "mytestargument",
          value: "mytestvalue",
          isSecret: false,
        },
        {
          type: "DockerBuildArgument",
          name: "mysecrettestargument",
          value: "mysecrettestvalue",
          isSecret: true,
        },
      ],
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    registry: "myRegistry",
    buildTask: "myBuildTask",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
- [BuildTask](../ContainerRegistry/BuildTask.md)
## Swagger Schema
```js
{
  description: 'Build step resource properties',
  type: 'object',
  allOf: [
    {
      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',
      properties: {
        id: {
          description: 'The resource ID.',
          type: 'string',
          readOnly: true
        },
        name: {
          description: 'The name of the resource.',
          type: 'string',
          readOnly: true
        },
        type: {
          description: 'The type of the resource.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'The properties of a build step.',
      type: 'object',
      properties: {
        provisioningState: {
          description: 'The provisioning state of the build step.',
          enum: [
            'Creating',
            'Updating',
            'Deleting',
            'Succeeded',
            'Failed',
            'Canceled'
          ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        type: {
          description: 'The type of the step.',
          enum: [ 'Docker' ],
          type: 'string',
          readOnly: true,
          'x-ms-enum': { name: 'BuildStepType', modelAsString: true }
        }
      },
      discriminator: 'type'
    }
  }
}
```
## Misc
The resource version is `2018-02-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2018-02-01-preview/containerregistry_build.json).
