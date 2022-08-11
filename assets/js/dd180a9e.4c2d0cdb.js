"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[83506],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>m});var r=t(67294);function s(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){s(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,s=function(e,n){if(null==e)return{};var t,r,s={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(s[t]=e[t]);return s}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var c=r.createContext({}),p=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},u=function(e){var n=p(e.components);return r.createElement(c.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},g=r.forwardRef((function(e,n){var t=e.components,s=e.mdxType,i=e.originalType,c=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),g=p(t),m=s,l=g["".concat(c,".").concat(m)]||g[m]||d[m]||i;return t?r.createElement(l,o(o({ref:n},u),{},{components:t})):r.createElement(l,o({ref:n},u))}));function m(e,n){var t=arguments,s=n&&n.mdxType;if("string"==typeof e||s){var i=t.length,o=new Array(i);o[0]=g;var a={};for(var c in n)hasOwnProperty.call(n,c)&&(a[c]=n[c]);a.originalType=e,a.mdxType="string"==typeof e?e:s,o[1]=a;for(var p=2;p<i;p++)o[p]=t[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}g.displayName="MDXCreateElement"},73164:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>a,toc:()=>p});var r=t(87462),s=(t(67294),t(3905));const i={id:"Task",title:"Task"},o=void 0,a={unversionedId:"azure/resources/ContainerRegistry/Task",id:"azure/resources/ContainerRegistry/Task",title:"Task",description:"Provides a Task from the ContainerRegistry group",source:"@site/docs/azure/resources/ContainerRegistry/Task.md",sourceDirName:"azure/resources/ContainerRegistry",slug:"/azure/resources/ContainerRegistry/Task",permalink:"/docs/azure/resources/ContainerRegistry/Task",draft:!1,tags:[],version:"current",frontMatter:{id:"Task",title:"Task"},sidebar:"docs",previous:{title:"ScopeMap",permalink:"/docs/azure/resources/ContainerRegistry/ScopeMap"},next:{title:"TaskRun",permalink:"/docs/azure/resources/ContainerRegistry/TaskRun"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"Tasks_Create",id:"tasks_create",level:3},{value:"Tasks_Create_WithSystemAndUserIdentities",id:"tasks_create_withsystemanduseridentities",level:3},{value:"Tasks_Create_WithUserIdentities_WithSystemIdentity",id:"tasks_create_withuseridentities_withsystemidentity",level:3},{value:"Tasks_Create_WithUserIdentities",id:"tasks_create_withuseridentities",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:p};function d(e){let{components:n,...t}=e;return(0,s.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provides a ",(0,s.kt)("strong",{parentName:"p"},"Task")," from the ",(0,s.kt)("strong",{parentName:"p"},"ContainerRegistry")," group"),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h3",{id:"tasks_create"},"Tasks_Create"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Task",\n    group: "ContainerRegistry",\n    name: "myTask",\n    properties: () => ({\n      properties: {\n        status: "Enabled",\n        platform: { os: "Linux", architecture: "amd64" },\n        agentConfiguration: { cpu: 2 },\n        step: {\n          type: "Docker",\n          imageNames: ["azurerest:testtag"],\n          dockerFilePath: "src/DockerFile",\n          contextPath: "src",\n          isPushEnabled: true,\n          noCache: false,\n          arguments: [\n            { name: "mytestargument", value: "mytestvalue", isSecret: false },\n            {\n              name: "mysecrettestargument",\n              value: "mysecrettestvalue",\n              isSecret: true,\n            },\n          ],\n        },\n        trigger: {\n          timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],\n          sourceTriggers: [\n            {\n              name: "mySourceTrigger",\n              sourceRepository: {\n                sourceControlType: "Github",\n                repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",\n                branch: "master",\n                sourceControlAuthProperties: {\n                  tokenType: "PAT",\n                  token: "xxxxx",\n                },\n              },\n              sourceTriggerEvents: ["commit"],\n            },\n          ],\n          baseImageTrigger: {\n            name: "myBaseImageTrigger",\n            baseImageTriggerType: "Runtime",\n          },\n        },\n      },\n      location: "eastus",\n      identity: { type: "SystemAssigned" },\n      tags: { testkey: "value" },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,s.kt)("h3",{id:"tasks_create_withsystemanduseridentities"},"Tasks_Create_WithSystemAndUserIdentities"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Task",\n    group: "ContainerRegistry",\n    name: "myTask",\n    properties: () => ({\n      properties: {\n        status: "Enabled",\n        platform: { os: "Linux", architecture: "amd64" },\n        agentConfiguration: { cpu: 2 },\n        step: {\n          type: "Docker",\n          imageNames: ["azurerest:testtag"],\n          dockerFilePath: "src/DockerFile",\n          contextPath: "src",\n          isPushEnabled: true,\n          noCache: false,\n          arguments: [\n            { name: "mytestargument", value: "mytestvalue", isSecret: false },\n            {\n              name: "mysecrettestargument",\n              value: "mysecrettestvalue",\n              isSecret: true,\n            },\n          ],\n        },\n        trigger: {\n          timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],\n          sourceTriggers: [\n            {\n              name: "mySourceTrigger",\n              sourceRepository: {\n                sourceControlType: "Github",\n                repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",\n                branch: "master",\n                sourceControlAuthProperties: {\n                  tokenType: "PAT",\n                  token: "xxxxx",\n                },\n              },\n              sourceTriggerEvents: ["commit"],\n            },\n          ],\n          baseImageTrigger: {\n            name: "myBaseImageTrigger",\n            baseImageTriggerType: "Runtime",\n          },\n        },\n      },\n      location: "eastus",\n      identity: {\n        type: "SystemAssigned, UserAssigned",\n        userAssignedIdentities: {\n          "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":\n            {},\n        },\n      },\n      tags: { testkey: "value" },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,s.kt)("h3",{id:"tasks_create_withuseridentities_withsystemidentity"},"Tasks_Create_WithUserIdentities_WithSystemIdentity"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Task",\n    group: "ContainerRegistry",\n    name: "myTask",\n    properties: () => ({\n      properties: {\n        status: "Enabled",\n        platform: { os: "Linux", architecture: "amd64" },\n        agentConfiguration: { cpu: 2 },\n        step: {\n          type: "Docker",\n          imageNames: ["azurerest:testtag"],\n          dockerFilePath: "src/DockerFile",\n          contextPath: "src",\n          isPushEnabled: true,\n          noCache: false,\n          arguments: [\n            { name: "mytestargument", value: "mytestvalue", isSecret: false },\n            {\n              name: "mysecrettestargument",\n              value: "mysecrettestvalue",\n              isSecret: true,\n            },\n          ],\n        },\n        trigger: {\n          timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],\n          sourceTriggers: [\n            {\n              name: "mySourceTrigger",\n              sourceRepository: {\n                sourceControlType: "Github",\n                repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",\n                branch: "master",\n                sourceControlAuthProperties: {\n                  tokenType: "PAT",\n                  token: "xxxxx",\n                },\n              },\n              sourceTriggerEvents: ["commit"],\n            },\n          ],\n          baseImageTrigger: {\n            name: "myBaseImageTrigger",\n            baseImageTriggerType: "Runtime",\n          },\n        },\n      },\n      location: "eastus",\n      identity: { type: "SystemAssigned" },\n      tags: { testkey: "value" },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,s.kt)("h3",{id:"tasks_create_withuseridentities"},"Tasks_Create_WithUserIdentities"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Task",\n    group: "ContainerRegistry",\n    name: "myTask",\n    properties: () => ({\n      properties: {\n        status: "Enabled",\n        platform: { os: "Linux", architecture: "amd64" },\n        agentConfiguration: { cpu: 2 },\n        step: {\n          type: "Docker",\n          imageNames: ["azurerest:testtag"],\n          dockerFilePath: "src/DockerFile",\n          contextPath: "src",\n          isPushEnabled: true,\n          noCache: false,\n          arguments: [\n            { name: "mytestargument", value: "mytestvalue", isSecret: false },\n            {\n              name: "mysecrettestargument",\n              value: "mysecrettestvalue",\n              isSecret: true,\n            },\n          ],\n        },\n        trigger: {\n          timerTriggers: [{ name: "myTimerTrigger", schedule: "30 9 * * 1-5" }],\n          sourceTriggers: [\n            {\n              name: "mySourceTrigger",\n              sourceRepository: {\n                sourceControlType: "Github",\n                repositoryUrl: "https://github.com/Azure/azure-rest-api-specs",\n                branch: "master",\n                sourceControlAuthProperties: {\n                  tokenType: "PAT",\n                  token: "xxxxx",\n                },\n              },\n              sourceTriggerEvents: ["commit"],\n            },\n          ],\n          baseImageTrigger: {\n            name: "myBaseImageTrigger",\n            baseImageTriggerType: "Runtime",\n          },\n        },\n      },\n      location: "eastus",\n      identity: {\n        type: "UserAssigned",\n        userAssignedIdentities: {\n          "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity1":\n            {},\n          "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup1/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":\n            {},\n        },\n      },\n      tags: { testkey: "value" },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/ManagedIdentity/UserAssignedIdentity"},"UserAssignedIdentity")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerRegistry/Registry"},"Registry"))),(0,s.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'The task that has the ARM resource and task properties. \\r\\n' +\n    'The task will have all information to schedule a run against it.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'An Azure resource.',\n      required: [ 'location' ],\n      properties: {\n        id: {\n          description: 'The resource ID.',\n          type: 'string',\n          readOnly: true\n        },\n        name: {\n          description: 'The name of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        type: {\n          description: 'The type of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        location: {\n          description: 'The location of the resource. This cannot be changed after the resource is created.',\n          type: 'string',\n          'x-ms-mutability': [ 'read', 'create' ]\n        },\n        tags: {\n          description: 'The tags of the resource.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    identity: {\n      description: 'Identity for the resource.',\n      type: 'object',\n      properties: {\n        principalId: {\n          description: 'The principal ID of resource identity.',\n          type: 'string'\n        },\n        tenantId: { description: 'The tenant ID of resource.', type: 'string' },\n        type: {\n          description: 'The identity type.',\n          enum: [\n            'SystemAssigned',\n            'UserAssigned',\n            'SystemAssigned, UserAssigned',\n            'None'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }\n        },\n        userAssignedIdentities: {\n          description: 'The list of user identities associated with the resource. The user identity \\r\\n' +\n            'dictionary key references will be ARM resource ids in the form: \\r\\n' +\n            \"'/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/\\r\\n\" +\n            \"    providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.\",\n          type: 'object',\n          additionalProperties: {\n            type: 'object',\n            properties: {\n              principalId: {\n                description: 'The principal id of user assigned identity.',\n                type: 'string'\n              },\n              clientId: {\n                description: 'The client id of user assigned identity.',\n                type: 'string'\n              }\n            }\n          }\n        }\n      }\n    },\n    properties: {\n      description: 'The properties of a task.',\n      'x-ms-client-flatten': true,\n      required: [ 'platform', 'step' ],\n      type: 'object',\n      properties: {\n        provisioningState: {\n          description: 'The provisioning state of the task.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        creationDate: {\n          format: 'date-time',\n          description: 'The creation date of task.',\n          type: 'string',\n          readOnly: true\n        },\n        status: {\n          description: 'The current status of task.',\n          enum: [ 'Disabled', 'Enabled' ],\n          type: 'string',\n          'x-ms-enum': { name: 'TaskStatus', modelAsString: true }\n        },\n        platform: {\n          description: 'The platform properties against which the run has to happen.',\n          required: [ 'os' ],\n          type: 'object',\n          properties: {\n            os: {\n              description: 'The operating system type required for the run.',\n              enum: [ 'Windows', 'Linux' ],\n              type: 'string',\n              'x-ms-enum': { name: 'OS', modelAsString: true }\n            },\n            architecture: {\n              description: 'The OS architecture.',\n              enum: [ 'amd64', 'x86', 'arm' ],\n              type: 'string',\n              'x-ms-enum': { name: 'Architecture', modelAsString: true }\n            },\n            variant: {\n              description: 'Variant of the CPU.',\n              enum: [ 'v6', 'v7', 'v8' ],\n              type: 'string',\n              'x-ms-enum': { name: 'Variant', modelAsString: true }\n            }\n          }\n        },\n        agentConfiguration: {\n          description: 'The machine configuration of the run agent.',\n          type: 'object',\n          properties: {\n            cpu: {\n              format: 'int32',\n              description: 'The CPU configuration in terms of number of cores required for the run.',\n              type: 'integer'\n            }\n          }\n        },\n        timeout: {\n          format: 'int32',\n          description: 'Run timeout in seconds.',\n          default: 3600,\n          maximum: 28800,\n          minimum: 300,\n          type: 'integer'\n        },\n        step: {\n          description: 'The properties of a task step.',\n          required: [ 'type' ],\n          type: 'object',\n          properties: {\n            type: {\n              description: 'The type of the step.',\n              enum: [ 'Docker', 'FileTask', 'EncodedTask' ],\n              type: 'string',\n              'x-ms-enum': { name: 'StepType', modelAsString: true }\n            },\n            baseImageDependencies: {\n              description: 'List of base image dependencies for a step.',\n              type: 'array',\n              items: {\n                description: 'Properties that describe a base image dependency.',\n                type: 'object',\n                properties: {\n                  type: {\n                    description: 'The type of the base image dependency.',\n                    enum: [ 'BuildTime', 'RunTime' ],\n                    type: 'string',\n                    'x-ms-enum': {\n                      name: 'BaseImageDependencyType',\n                      modelAsString: true\n                    }\n                  },\n                  registry: {\n                    description: 'The registry login server.',\n                    type: 'string'\n                  },\n                  repository: {\n                    description: 'The repository name.',\n                    type: 'string'\n                  },\n                  tag: { description: 'The tag name.', type: 'string' },\n                  digest: {\n                    description: 'The sha256-based digest of the image manifest.',\n                    type: 'string'\n                  }\n                }\n              },\n              readOnly: true\n            },\n            contextPath: {\n              description: 'The URL(absolute or relative) of the source context for the task step.',\n              type: 'string'\n            },\n            contextAccessToken: {\n              description: 'The token (git PAT or SAS token of storage account blob) associated with the context for a step.',\n              type: 'string'\n            }\n          },\n          discriminator: 'type'\n        },\n        trigger: {\n          description: 'The properties that describe all triggers for the task.',\n          type: 'object',\n          properties: {\n            timerTriggers: {\n              description: 'The collection of timer triggers.',\n              type: 'array',\n              items: {\n                description: 'The properties of a timer trigger.',\n                required: [ 'schedule', 'name' ],\n                type: 'object',\n                properties: {\n                  schedule: {\n                    description: 'The CRON expression for the task schedule',\n                    type: 'string'\n                  },\n                  status: {\n                    description: 'The current status of trigger.',\n                    default: 'Enabled',\n                    enum: [ 'Disabled', 'Enabled' ],\n                    type: 'string',\n                    'x-ms-enum': { name: 'TriggerStatus', modelAsString: true }\n                  },\n                  name: {\n                    description: 'The name of the trigger.',\n                    type: 'string'\n                  }\n                }\n              }\n            },\n            sourceTriggers: {\n              description: 'The collection of triggers based on source code repository.',\n              type: 'array',\n              items: {\n                description: 'The properties of a source based trigger.',\n                required: [ 'sourceRepository', 'sourceTriggerEvents', 'name' ],\n                type: 'object',\n                properties: {\n                  sourceRepository: {\n                    description: 'The properties that describes the source(code) for the task.',\n                    required: [ 'sourceControlType', 'repositoryUrl' ],\n                    type: 'object',\n                    properties: {\n                      sourceControlType: {\n                        description: 'The type of source control service.',\n                        enum: [ 'Github', 'VisualStudioTeamService' ],\n                        type: 'string',\n                        'x-ms-enum': {\n                          name: 'SourceControlType',\n                          modelAsString: true\n                        }\n                      },\n                      repositoryUrl: {\n                        description: 'The full URL to the source code repository',\n                        type: 'string'\n                      },\n                      branch: {\n                        description: 'The branch name of the source code.',\n                        type: 'string'\n                      },\n                      sourceControlAuthProperties: {\n                        description: 'The authorization properties for accessing the source code repository and to set up\\r\\n' +\n                          'webhooks for notifications.',\n                        required: [ 'tokenType', 'token' ],\n                        type: 'object',\n                        properties: {\n                          tokenType: {\n                            description: 'The type of Auth token.',\n                            enum: [ 'PAT', 'OAuth' ],\n                            type: 'string',\n                            'x-ms-enum': { name: 'TokenType', modelAsString: true }\n                          },\n                          token: {\n                            description: 'The access token used to access the source control provider.',\n                            type: 'string'\n                          },\n                          refreshToken: {\n                            description: 'The refresh token used to refresh the access token.',\n                            type: 'string'\n                          },\n                          scope: {\n                            description: 'The scope of the access token.',\n                            type: 'string'\n                          },\n                          expiresIn: {\n                            format: 'int32',\n                            description: 'Time in seconds that the token remains valid',\n                            type: 'integer'\n                          }\n                        }\n                      }\n                    }\n                  },\n                  sourceTriggerEvents: {\n                    description: 'The source event corresponding to the trigger.',\n                    type: 'array',\n                    items: {\n                      enum: [ 'commit', 'pullrequest' ],\n                      type: 'string',\n                      'x-ms-enum': {\n                        name: 'SourceTriggerEvent',\n                        modelAsString: true\n                      }\n                    }\n                  },\n                  status: {\n                    description: 'The current status of trigger.',\n                    default: 'Enabled',\n                    enum: [ 'Disabled', 'Enabled' ],\n                    type: 'string',\n                    'x-ms-enum': { name: 'TriggerStatus', modelAsString: true }\n                  },\n                  name: {\n                    description: 'The name of the trigger.',\n                    type: 'string'\n                  }\n                }\n              }\n            },\n            baseImageTrigger: {\n              description: 'The trigger based on base image dependencies.',\n              required: [ 'baseImageTriggerType', 'name' ],\n              type: 'object',\n              properties: {\n                baseImageTriggerType: {\n                  description: 'The type of the auto trigger for base image dependency updates.',\n                  enum: [ 'All', 'Runtime' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'BaseImageTriggerType', modelAsString: true }\n                },\n                status: {\n                  description: 'The current status of trigger.',\n                  default: 'Enabled',\n                  enum: [ 'Disabled', 'Enabled' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'TriggerStatus', modelAsString: true }\n                },\n                name: {\n                  description: 'The name of the trigger.',\n                  type: 'string'\n                }\n              }\n            }\n          }\n        },\n        credentials: {\n          description: 'The properties that describes a set of credentials that will be used when this run is invoked.',\n          type: 'object',\n          properties: {\n            sourceRegistry: {\n              description: 'Describes the credential parameters for accessing the source registry.',\n              type: 'object',\n              properties: {\n                loginMode: {\n                  description: 'The authentication mode which determines the source registry login scope. The credentials for the source registry\\r\\n' +\n                    'will be generated using the given scope. These credentials will be used to login to\\r\\n' +\n                    'the source registry during the run.',\n                  enum: [ 'None', 'Default' ],\n                  type: 'string',\n                  'x-ms-enum': {\n                    name: 'SourceRegistryLoginMode',\n                    modelAsString: true\n                  }\n                }\n              }\n            },\n            customRegistries: {\n              description: 'Describes the credential parameters for accessing other custom registries. The key\\r\\n' +\n                'for the dictionary item will be the registry login server (myregistry.azurecr.io) and\\r\\n' +\n                'the value of the item will be the registry credentials for accessing the registry.',\n              type: 'object',\n              additionalProperties: {\n                description: 'Describes the credentials that will be used to access a custom registry during a run.',\n                type: 'object',\n                properties: {\n                  userName: {\n                    description: 'The username for logging into the custom registry.',\n                    type: 'object',\n                    properties: {\n                      value: {\n                        description: 'The value of the secret. The format of this value will be determined\\r\\n' +\n                          'based on the type of the secret object. If the type is Opaque, the value will be\\r\\n' +\n                          'used as is without any modification.',\n                        type: 'string'\n                      },\n                      type: {\n                        description: 'The type of the secret object which determines how the value of the secret object has to be\\r\\n' +\n                          'interpreted.',\n                        enum: [ 'Opaque', 'Vaultsecret' ],\n                        type: 'string',\n                        'x-ms-enum': {\n                          name: 'SecretObjectType',\n                          modelAsString: true\n                        }\n                      }\n                    }\n                  },\n                  password: {\n                    description: 'The password for logging into the custom registry. The password is a secret \\r\\n' +\n                      'object that allows multiple ways of providing the value for it.',\n                    type: 'object',\n                    properties: {\n                      value: {\n                        description: 'The value of the secret. The format of this value will be determined\\r\\n' +\n                          'based on the type of the secret object. If the type is Opaque, the value will be\\r\\n' +\n                          'used as is without any modification.',\n                        type: 'string'\n                      },\n                      type: {\n                        description: 'The type of the secret object which determines how the value of the secret object has to be\\r\\n' +\n                          'interpreted.',\n                        enum: [ 'Opaque', 'Vaultsecret' ],\n                        type: 'string',\n                        'x-ms-enum': {\n                          name: 'SecretObjectType',\n                          modelAsString: true\n                        }\n                      }\n                    }\n                  },\n                  identity: {\n                    description: 'Indicates the managed identity assigned to the custom credential. If a user-assigned identity\\r\\n' +\n                      'this value is the Client ID. If a system-assigned identity, the value will be `system`. In\\r\\n' +\n                      'the case of a system-assigned identity, the Client ID will be determined by the runner. This\\r\\n' +\n                      'identity may be used to authenticate to key vault to retrieve credentials or it may be the only \\r\\n' +\n                      'source of authentication used for accessing the registry.',\n                    type: 'string'\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n")),(0,s.kt)("h2",{id:"misc"},"Misc"),(0,s.kt)("p",null,"The resource version is ",(0,s.kt)("inlineCode",{parentName:"p"},"2019-04-01"),"."),(0,s.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2019-04-01/containerregistry_build.json"},"here"),"."))}d.isMDXComponent=!0}}]);