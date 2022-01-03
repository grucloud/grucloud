---
id: Task
title: Task
---
Provides a **Task** from the **ContainerRegistry** group
## Examples
### Tasks_Create
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      platform: { os: "Linux", architecture: "amd64" },
      agentConfiguration: { cpu: 2 },
      step: {
        type: "Docker",
        imageNames: ["azurerest:testtag"],
        dockerFilePath: "src/DockerFile",
        contextPath: "src",
        isPushEnabled: true,
        noCache: false,
        arguments: [
          { name: "mytestargument", value: "mytestvalue", isSecret: false },
          {
            name: "mysecrettestargument",
            value: "mysecrettestvalue",
            isSecret: true,
          },
        ],
      },
      trigger: {
        timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],
        sourceTriggers: [
          {
            name: "mySourceTrigger",
            sourceRepository: {
              sourceControlType: "Github",
              repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
              branch: "master",
              sourceControlAuthProperties: { tokenType: "PAT", token: "xxxxx" },
            },
            sourceTriggerEvents: ["commit"],
          },
        ],
        baseImageTrigger: {
          name: "myBaseImageTrigger",
          baseImageTriggerType: "Runtime",
          updateTriggerEndpoint:
            "https://user:pass@mycicd.webhook.com?token=foo",
          updateTriggerPayloadType: "Token",
        },
      },
      isSystemTask: false,
      logTemplate: "acr/tasks:{{.Run.OS}}",
    },
    location: "eastus",
    identity: { type: "SystemAssigned" },
    tags: { testkey: "value" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```

### Tasks_Create_WithSystemAndUserIdentities
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      platform: { os: "Linux", architecture: "amd64" },
      agentConfiguration: { cpu: 2 },
      step: {
        type: "Docker",
        imageNames: ["azurerest:testtag"],
        dockerFilePath: "src/DockerFile",
        contextPath: "src",
        isPushEnabled: true,
        noCache: false,
        arguments: [
          { name: "mytestargument", value: "mytestvalue", isSecret: false },
          {
            name: "mysecrettestargument",
            value: "mysecrettestvalue",
            isSecret: true,
          },
        ],
      },
      trigger: {
        timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],
        sourceTriggers: [
          {
            name: "mySourceTrigger",
            sourceRepository: {
              sourceControlType: "Github",
              repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
              branch: "master",
              sourceControlAuthProperties: { tokenType: "PAT", token: "xxxxx" },
            },
            sourceTriggerEvents: ["commit"],
          },
        ],
        baseImageTrigger: {
          name: "myBaseImageTrigger",
          baseImageTriggerType: "Runtime",
          updateTriggerEndpoint:
            "https://user:pass@mycicd.webhook.com?token=foo",
          updateTriggerPayloadType: "Default",
        },
      },
      isSystemTask: false,
      logTemplate: null,
    },
    location: "eastus",
    identity: {
      type: "SystemAssigned, UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":
          {},
      },
    },
    tags: { testkey: "value" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```

### Tasks_Create_WithUserIdentities_WithSystemIdentity
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      platform: { os: "Linux", architecture: "amd64" },
      agentConfiguration: { cpu: 2 },
      step: {
        type: "Docker",
        imageNames: ["azurerest:testtag"],
        dockerFilePath: "src/DockerFile",
        contextPath: "src",
        isPushEnabled: true,
        noCache: false,
        arguments: [
          { name: "mytestargument", value: "mytestvalue", isSecret: false },
          {
            name: "mysecrettestargument",
            value: "mysecrettestvalue",
            isSecret: true,
          },
        ],
      },
      trigger: {
        timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],
        sourceTriggers: [
          {
            name: "mySourceTrigger",
            sourceRepository: {
              sourceControlType: "Github",
              repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
              branch: "master",
              sourceControlAuthProperties: { tokenType: "PAT", token: "xxxxx" },
            },
            sourceTriggerEvents: ["commit"],
          },
        ],
        baseImageTrigger: {
          name: "myBaseImageTrigger",
          baseImageTriggerType: "Runtime",
        },
      },
      isSystemTask: false,
      logTemplate: null,
    },
    location: "eastus",
    identity: { type: "SystemAssigned" },
    tags: { testkey: "value" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```

### Tasks_Create_WithUserIdentities
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      platform: { os: "Linux", architecture: "amd64" },
      agentConfiguration: { cpu: 2 },
      step: {
        type: "Docker",
        imageNames: ["azurerest:testtag"],
        dockerFilePath: "src/DockerFile",
        contextPath: "src",
        isPushEnabled: true,
        noCache: false,
        arguments: [
          { name: "mytestargument", value: "mytestvalue", isSecret: false },
          {
            name: "mysecrettestargument",
            value: "mysecrettestvalue",
            isSecret: true,
          },
        ],
      },
      trigger: {
        timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],
        sourceTriggers: [
          {
            name: "mySourceTrigger",
            sourceRepository: {
              sourceControlType: "Github",
              repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",
              branch: "master",
              sourceControlAuthProperties: { tokenType: "PAT", token: "xxxxx" },
            },
            sourceTriggerEvents: ["commit"],
          },
        ],
        baseImageTrigger: {
          name: "myBaseImageTrigger",
          baseImageTriggerType: "Runtime",
          updateTriggerEndpoint:
            "https://user:pass@mycicd.webhook.com?token=foo",
          updateTriggerPayloadType: "Default",
        },
      },
      isSystemTask: false,
      logTemplate: null,
    },
    location: "eastus",
    identity: {
      type: "UserAssigned",
      userAssignedIdentities: {
        "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":
          {},
        "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":
          {},
      },
    },
    tags: { testkey: "value" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```

### Tasks_Create_QuickTask
```js
provider.ContainerRegistry.makeTask({
  name: "myTask",
  properties: () => ({
    properties: {
      status: "Enabled",
      isSystemTask: true,
      logTemplate: "acr/tasks:{{.Run.OS}}",
    },
    location: "eastus",
    identity: null,
    tags: { testkey: "value" },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    registry: resources.ContainerRegistry.Registry["myRegistry"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Registry](../ContainerRegistry/Registry.md)
## Misc
The resource version is `2019-06-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2019-06-01-preview/containerregistry_build.json).
