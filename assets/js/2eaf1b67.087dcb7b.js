"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[60675],{3905:(e,n,t)=>{t.d(n,{Zo:()=>l,kt:()=>m});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=r.createContext({}),c=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},l=function(e){var n=c(e.components);return r.createElement(p.Provider,{value:n},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},y=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),d=c(t),y=i,m=d["".concat(p,".").concat(y)]||d[y]||u[y]||o;return t?r.createElement(m,s(s({ref:n},l),{},{components:t})):r.createElement(m,s({ref:n},l))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,s=new Array(o);s[0]=y;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a[d]="string"==typeof e?e:i,s[1]=a;for(var c=2;c<o;c++)s[c]=t[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}y.displayName="MDXCreateElement"},11722:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var r=t(87462),i=(t(67294),t(3905));const o={id:"ExportPipeline",title:"ExportPipeline"},s=void 0,a={unversionedId:"azure/resources/ContainerRegistry/ExportPipeline",id:"azure/resources/ContainerRegistry/ExportPipeline",title:"ExportPipeline",description:"Provides a ExportPipeline from the ContainerRegistry group",source:"@site/docs/azure/resources/ContainerRegistry/ExportPipeline.md",sourceDirName:"azure/resources/ContainerRegistry",slug:"/azure/resources/ContainerRegistry/ExportPipeline",permalink:"/docs/azure/resources/ContainerRegistry/ExportPipeline",draft:!1,tags:[],version:"current",frontMatter:{id:"ExportPipeline",title:"ExportPipeline"},sidebar:"docs",previous:{title:"ConnectedRegistry",permalink:"/docs/azure/resources/ContainerRegistry/ConnectedRegistry"},next:{title:"ImportPipeline",permalink:"/docs/azure/resources/ContainerRegistry/ImportPipeline"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"ExportPipelineCreate",id:"exportpipelinecreate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:c},d="wrapper";function u(e){let{components:n,...t}=e;return(0,i.kt)(d,(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"ExportPipeline")," from the ",(0,i.kt)("strong",{parentName:"p"},"ContainerRegistry")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"exportpipelinecreate"},"ExportPipelineCreate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ExportPipeline",\n    group: "ContainerRegistry",\n    name: "myExportPipeline",\n    properties: () => ({\n      location: "westus",\n      identity: { type: "SystemAssigned" },\n      properties: {\n        target: {\n          type: "AzureStorageBlobContainer",\n          uri: "https://accountname.blob.core.windows.net/containername",\n          keyVaultUri: "https://myvault.vault.azure.net/secrets/acrexportsas",\n        },\n        options: ["OverwriteBlobs"],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/ManagedIdentity/UserAssignedIdentity"},"UserAssignedIdentity")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerRegistry/Registry"},"Registry"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'An object that represents an export pipeline for a container registry.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',\n      properties: {\n        id: {\n          description: 'The resource ID.',\n          type: 'string',\n          readOnly: true\n        },\n        name: {\n          description: 'The name of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        type: {\n          description: 'The type of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        systemData: {\n          description: 'Metadata pertaining to creation and last modification of the resource.',\n          type: 'object',\n          readOnly: true,\n          properties: {\n            createdBy: {\n              description: 'The identity that created the resource.',\n              type: 'string'\n            },\n            createdByType: {\n              description: 'The type of identity that created the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'createdByType', modelAsString: true }\n            },\n            createdAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource creation (UTC).',\n              type: 'string'\n            },\n            lastModifiedBy: {\n              description: 'The identity that last modified the resource.',\n              type: 'string'\n            },\n            lastModifiedByType: {\n              description: 'The type of identity that last modified the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }\n            },\n            lastModifiedAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource modification (UTC).',\n              type: 'string'\n            }\n          }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    location: {\n      description: 'The location of the export pipeline.',\n      type: 'string'\n    },\n    identity: {\n      description: 'The identity of the export pipeline.',\n      type: 'object',\n      properties: {\n        principalId: {\n          description: 'The principal ID of resource identity.',\n          type: 'string'\n        },\n        tenantId: { description: 'The tenant ID of resource.', type: 'string' },\n        type: {\n          description: 'The identity type.',\n          enum: [\n            'SystemAssigned',\n            'UserAssigned',\n            'SystemAssigned, UserAssigned',\n            'None'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }\n        },\n        userAssignedIdentities: {\n          description: 'The list of user identities associated with the resource. The user identity \\r\\n' +\n            'dictionary key references will be ARM resource ids in the form: \\r\\n' +\n            \"'/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/\\r\\n\" +\n            \"    providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.\",\n          type: 'object',\n          additionalProperties: {\n            type: 'object',\n            properties: {\n              principalId: {\n                description: 'The principal id of user assigned identity.',\n                type: 'string'\n              },\n              clientId: {\n                description: 'The client id of user assigned identity.',\n                type: 'string'\n              }\n            }\n          }\n        }\n      }\n    },\n    properties: {\n      description: 'The properties of the export pipeline.',\n      'x-ms-client-flatten': true,\n      required: [ 'target' ],\n      type: 'object',\n      properties: {\n        target: {\n          description: 'The target properties of the export pipeline.',\n          required: [ 'keyVaultUri' ],\n          type: 'object',\n          properties: {\n            type: {\n              description: 'The type of target for the export pipeline.',\n              type: 'string'\n            },\n            uri: {\n              description: 'The target uri of the export pipeline.\\r\\n' +\n                `When 'AzureStorageBlob': \"https://accountName.blob.core.windows.net/containerName/blobName\"\\r\\n` +\n                `When 'AzureStorageBlobContainer':  \"https://accountName.blob.core.windows.net/containerName\"`,\n              type: 'string'\n            },\n            keyVaultUri: {\n              description: 'They key vault secret uri to obtain the target storage SAS token.',\n              type: 'string'\n            }\n          }\n        },\n        options: {\n          description: 'The list of all options configured for the pipeline.',\n          type: 'array',\n          items: {\n            enum: [\n              'OverwriteTags',\n              'OverwriteBlobs',\n              'DeleteSourceBlobOnSuccess',\n              'ContinueOnErrors'\n            ],\n            type: 'string',\n            'x-ms-enum': { name: 'PipelineOptions', modelAsString: true }\n          }\n        },\n        provisioningState: {\n          description: 'The provisioning state of the pipeline at the time the operation was called.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-02-01-preview"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2022-02-01-preview/containerregistry.json"},"here"),"."))}u.isMDXComponent=!0}}]);