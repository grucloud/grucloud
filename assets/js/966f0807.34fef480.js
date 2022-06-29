"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[15869],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>m});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function p(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var a=r.createContext({}),c=function(e){var n=r.useContext(a),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},u=function(e){var n=c(e.components);return r.createElement(a.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),l=c(t),m=i,y=l["".concat(a,".").concat(m)]||l[m]||d[m]||o;return t?r.createElement(y,s(s({ref:n},u),{},{components:t})):r.createElement(y,s({ref:n},u))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,s=new Array(o);s[0]=l;var p={};for(var a in n)hasOwnProperty.call(n,a)&&(p[a]=n[a]);p.originalType=e,p.mdxType="string"==typeof e?e:i,s[1]=p;for(var c=2;c<o;c++)s[c]=t[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},95342:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>p,toc:()=>c});var r=t(87462),i=(t(67294),t(3905));const o={id:"ImportPipeline",title:"ImportPipeline"},s=void 0,p={unversionedId:"azure/resources/ContainerRegistry/ImportPipeline",id:"azure/resources/ContainerRegistry/ImportPipeline",title:"ImportPipeline",description:"Provides a ImportPipeline from the ContainerRegistry group",source:"@site/docs/azure/resources/ContainerRegistry/ImportPipeline.md",sourceDirName:"azure/resources/ContainerRegistry",slug:"/azure/resources/ContainerRegistry/ImportPipeline",permalink:"/docs/azure/resources/ContainerRegistry/ImportPipeline",draft:!1,tags:[],version:"current",frontMatter:{id:"ImportPipeline",title:"ImportPipeline"},sidebar:"docs",previous:{title:"ExportPipeline",permalink:"/docs/azure/resources/ContainerRegistry/ExportPipeline"},next:{title:"PipelineRun",permalink:"/docs/azure/resources/ContainerRegistry/PipelineRun"}},a={},c=[{value:"Examples",id:"examples",level:2},{value:"ImportPipelineCreate",id:"importpipelinecreate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c};function d(e){let{components:n,...t}=e;return(0,i.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"ImportPipeline")," from the ",(0,i.kt)("strong",{parentName:"p"},"ContainerRegistry")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"importpipelinecreate"},"ImportPipelineCreate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ImportPipeline",\n    group: "ContainerRegistry",\n    name: "myImportPipeline",\n    properties: () => ({\n      location: "westus",\n      identity: {\n        type: "UserAssigned",\n        userAssignedIdentities: {\n          "/subscriptions/f9d7ebed-adbd-4cb4-b973-aaf82c136138/resourcegroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/identity2":\n            {},\n        },\n      },\n      properties: {\n        source: {\n          type: "AzureStorageBlobContainer",\n          uri: "https://accountname.blob.core.windows.net/containername",\n          keyVaultUri: "https://myvault.vault.azure.net/secrets/acrimportsas",\n        },\n        options: [\n          "OverwriteTags",\n          "DeleteSourceBlobOnSuccess",\n          "ContinueOnErrors",\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/ManagedIdentity/UserAssignedIdentity"},"UserAssignedIdentity")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerRegistry/Registry"},"Registry"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'An object that represents an import pipeline for a container registry.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',\n      properties: {\n        id: {\n          description: 'The resource ID.',\n          type: 'string',\n          readOnly: true\n        },\n        name: {\n          description: 'The name of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        type: {\n          description: 'The type of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        systemData: {\n          description: 'Metadata pertaining to creation and last modification of the resource.',\n          type: 'object',\n          readOnly: true,\n          properties: {\n            createdBy: {\n              description: 'The identity that created the resource.',\n              type: 'string'\n            },\n            createdByType: {\n              description: 'The type of identity that created the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'createdByType', modelAsString: true }\n            },\n            createdAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource creation (UTC).',\n              type: 'string'\n            },\n            lastModifiedBy: {\n              description: 'The identity that last modified the resource.',\n              type: 'string'\n            },\n            lastModifiedByType: {\n              description: 'The type of identity that last modified the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }\n            },\n            lastModifiedAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource modification (UTC).',\n              type: 'string'\n            }\n          }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    location: {\n      description: 'The location of the import pipeline.',\n      type: 'string'\n    },\n    identity: {\n      description: 'The identity of the import pipeline.',\n      type: 'object',\n      properties: {\n        principalId: {\n          description: 'The principal ID of resource identity.',\n          type: 'string'\n        },\n        tenantId: { description: 'The tenant ID of resource.', type: 'string' },\n        type: {\n          description: 'The identity type.',\n          enum: [\n            'SystemAssigned',\n            'UserAssigned',\n            'SystemAssigned, UserAssigned',\n            'None'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }\n        },\n        userAssignedIdentities: {\n          description: 'The list of user identities associated with the resource. The user identity \\r\\n' +\n            'dictionary key references will be ARM resource ids in the form: \\r\\n' +\n            \"'/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/\\r\\n\" +\n            \"    providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.\",\n          type: 'object',\n          additionalProperties: {\n            type: 'object',\n            properties: {\n              principalId: {\n                description: 'The principal id of user assigned identity.',\n                type: 'string'\n              },\n              clientId: {\n                description: 'The client id of user assigned identity.',\n                type: 'string'\n              }\n            }\n          }\n        }\n      }\n    },\n    properties: {\n      description: 'The properties of the import pipeline.',\n      'x-ms-client-flatten': true,\n      required: [ 'source' ],\n      type: 'object',\n      properties: {\n        source: {\n          description: 'The source properties of the import pipeline.',\n          required: [ 'keyVaultUri' ],\n          type: 'object',\n          properties: {\n            type: {\n              description: 'The type of source for the import pipeline.',\n              default: 'AzureStorageBlobContainer',\n              enum: [ 'AzureStorageBlobContainer' ],\n              type: 'string',\n              'x-ms-enum': { name: 'PipelineSourceType', modelAsString: true }\n            },\n            uri: {\n              description: 'The source uri of the import pipeline.\\r\\n' +\n                `When 'AzureStorageBlob': \"https://accountName.blob.core.windows.net/containerName/blobName\"\\r\\n` +\n                `When 'AzureStorageBlobContainer': \"https://accountName.blob.core.windows.net/containerName\"`,\n              type: 'string'\n            },\n            keyVaultUri: {\n              description: 'They key vault secret uri to obtain the source storage SAS token.',\n              type: 'string'\n            }\n          }\n        },\n        trigger: {\n          description: 'The properties that describe the trigger of the import pipeline.',\n          type: 'object',\n          properties: {\n            sourceTrigger: {\n              description: 'The source trigger properties of the pipeline.',\n              required: [ 'status' ],\n              type: 'object',\n              properties: {\n                status: {\n                  description: 'The current status of the source trigger.',\n                  default: 'Enabled',\n                  enum: [ 'Enabled', 'Disabled' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'TriggerStatus', modelAsString: true }\n                }\n              }\n            }\n          }\n        },\n        options: {\n          description: 'The list of all options configured for the pipeline.',\n          type: 'array',\n          items: {\n            enum: [\n              'OverwriteTags',\n              'OverwriteBlobs',\n              'DeleteSourceBlobOnSuccess',\n              'ContinueOnErrors'\n            ],\n            type: 'string',\n            'x-ms-enum': { name: 'PipelineOptions', modelAsString: true }\n          }\n        },\n        provisioningState: {\n          description: 'The provisioning state of the pipeline at the time the operation was called.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-02-01-preview"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2022-02-01-preview/containerregistry.json"},"here"),"."))}d.isMDXComponent=!0}}]);