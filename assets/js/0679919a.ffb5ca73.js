"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[10917],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return y}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function p(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var a=r.createContext({}),c=function(e){var n=r.useContext(a),t=n;return e&&(t="function"==typeof e?e(n):p(p({},n),e)),t},u=function(e){var n=c(e.components);return r.createElement(a.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(t),y=i,g=d["".concat(a,".").concat(y)]||d[y]||l[y]||o;return t?r.createElement(g,p(p({ref:n},u),{},{components:t})):r.createElement(g,p({ref:n},u))}));function y(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,p=new Array(o);p[0]=d;var s={};for(var a in n)hasOwnProperty.call(n,a)&&(s[a]=n[a]);s.originalType=e,s.mdxType="string"==typeof e?e:i,p[1]=s;for(var c=2;c<o;c++)p[c]=t[c];return r.createElement.apply(null,p)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},12039:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return a},metadata:function(){return c},toc:function(){return u},default:function(){return d}});var r=t(87462),i=t(63366),o=(t(67294),t(3905)),p=["components"],s={id:"PipelineRun",title:"PipelineRun"},a=void 0,c={unversionedId:"azure/resources/ContainerRegistry/PipelineRun",id:"azure/resources/ContainerRegistry/PipelineRun",isDocsHomePage:!1,title:"PipelineRun",description:"Provides a PipelineRun from the ContainerRegistry group",source:"@site/docs/azure/resources/ContainerRegistry/PipelineRun.md",sourceDirName:"azure/resources/ContainerRegistry",slug:"/azure/resources/ContainerRegistry/PipelineRun",permalink:"/docs/azure/resources/ContainerRegistry/PipelineRun",tags:[],version:"current",frontMatter:{id:"PipelineRun",title:"PipelineRun"},sidebar:"docs",previous:{title:"ImportPipeline",permalink:"/docs/azure/resources/ContainerRegistry/ImportPipeline"},next:{title:"PrivateEndpointConnection",permalink:"/docs/azure/resources/ContainerRegistry/PrivateEndpointConnection"}},u=[{value:"Examples",id:"examples",children:[{value:"PipelineRunCreate_Export",id:"pipelineruncreate_export",children:[],level:3},{value:"PipelineRunCreate_Import",id:"pipelineruncreate_import",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:u};function d(e){var n=e.components,t=(0,i.Z)(e,p);return(0,o.kt)("wrapper",(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"PipelineRun")," from the ",(0,o.kt)("strong",{parentName:"p"},"ContainerRegistry")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"pipelineruncreate_export"},"PipelineRunCreate_Export"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PipelineRun",\n    group: "ContainerRegistry",\n    name: "myPipelineRun",\n    properties: () => ({\n      properties: {\n        request: {\n          pipelineResourceId:\n            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/exportPipelines/myExportPipeline",\n          target: { type: "AzureStorageBlob", name: "myblob.tar.gz" },\n          artifacts: [\n            "sourceRepository/hello-world",\n            "sourceRepository2@sha256:00000000000000000000000000000000000",\n          ],\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,o.kt)("h3",{id:"pipelineruncreate_import"},"PipelineRunCreate_Import"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PipelineRun",\n    group: "ContainerRegistry",\n    name: "myPipelineRun",\n    properties: () => ({\n      properties: {\n        request: {\n          pipelineResourceId:\n            "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myResourceGroup/providers/Microsoft.ContainerRegistry/registries/myRegistry/importPipelines/myImportPipeline",\n          source: { type: "AzureStorageBlob", name: "myblob.tar.gz" },\n          catalogDigest: "sha256@",\n        },\n        forceUpdateTag: "2020-03-04T17:23:21.9261521+00:00",\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerRegistry/Registry"},"Registry"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'An object that represents a pipeline run for a container registry.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',\n      properties: {\n        id: {\n          description: 'The resource ID.',\n          type: 'string',\n          readOnly: true\n        },\n        name: {\n          description: 'The name of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        type: {\n          description: 'The type of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        systemData: {\n          description: 'Metadata pertaining to creation and last modification of the resource.',\n          type: 'object',\n          readOnly: true,\n          properties: {\n            createdBy: {\n              description: 'The identity that created the resource.',\n              type: 'string'\n            },\n            createdByType: {\n              description: 'The type of identity that created the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'createdByType', modelAsString: true }\n            },\n            createdAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource creation (UTC).',\n              type: 'string'\n            },\n            lastModifiedBy: {\n              description: 'The identity that last modified the resource.',\n              type: 'string'\n            },\n            lastModifiedByType: {\n              description: 'The type of identity that last modified the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }\n            },\n            lastModifiedAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource modification (UTC).',\n              type: 'string'\n            }\n          }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'The properties of a pipeline run.',\n      'x-ms-client-flatten': true,\n      type: 'object',\n      properties: {\n        provisioningState: {\n          description: 'The provisioning state of a pipeline run.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        request: {\n          description: 'The request parameters for a pipeline run.',\n          type: 'object',\n          properties: {\n            pipelineResourceId: {\n              description: 'The resource ID of the pipeline to run.',\n              type: 'string'\n            },\n            artifacts: {\n              description: 'List of source artifacts to be transferred by the pipeline. \\r\\n' +\n                \"Specify an image by repository ('hello-world'). This will use the 'latest' tag.\\r\\n\" +\n                \"Specify an image by tag ('hello-world:latest').\\r\\n\" +\n                \"Specify an image by sha256-based manifest digest ('hello-world@sha256:abc123').\",\n              type: 'array',\n              items: { type: 'string' }\n            },\n            source: {\n              description: 'The source properties of the pipeline run.',\n              type: 'object',\n              properties: {\n                type: {\n                  description: 'The type of the source.',\n                  default: 'AzureStorageBlob',\n                  enum: [ 'AzureStorageBlob' ],\n                  type: 'string',\n                  'x-ms-enum': {\n                    name: 'PipelineRunSourceType',\n                    modelAsString: true\n                  }\n                },\n                name: {\n                  description: 'The name of the source.',\n                  type: 'string'\n                }\n              }\n            },\n            target: {\n              description: 'The target properties of the pipeline run.',\n              type: 'object',\n              properties: {\n                type: {\n                  description: 'The type of the target.',\n                  default: 'AzureStorageBlob',\n                  enum: [ 'AzureStorageBlob' ],\n                  type: 'string',\n                  'x-ms-enum': {\n                    name: 'PipelineRunTargetType',\n                    modelAsString: true\n                  }\n                },\n                name: {\n                  description: 'The name of the target.',\n                  type: 'string'\n                }\n              }\n            },\n            catalogDigest: {\n              description: 'The digest of the tar used to transfer the artifacts.',\n              type: 'string'\n            }\n          }\n        },\n        response: {\n          description: 'The response of a pipeline run.',\n          readOnly: true,\n          type: 'object',\n          properties: {\n            status: {\n              description: 'The current status of the pipeline run.',\n              type: 'string'\n            },\n            importedArtifacts: {\n              description: 'The artifacts imported in the pipeline run.',\n              type: 'array',\n              items: { type: 'string' }\n            },\n            progress: {\n              description: 'The current progress of the copy operation.',\n              type: 'object',\n              properties: {\n                percentage: {\n                  description: 'The percentage complete of the copy operation.',\n                  type: 'string'\n                }\n              }\n            },\n            startTime: {\n              format: 'date-time',\n              description: 'The time the pipeline run started.',\n              type: 'string'\n            },\n            finishTime: {\n              format: 'date-time',\n              description: 'The time the pipeline run finished.',\n              type: 'string'\n            },\n            source: {\n              description: 'The source of the pipeline run.',\n              required: [ 'keyVaultUri' ],\n              type: 'object',\n              properties: {\n                type: {\n                  description: 'The type of source for the import pipeline.',\n                  default: 'AzureStorageBlobContainer',\n                  enum: [ 'AzureStorageBlobContainer' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'PipelineSourceType', modelAsString: true }\n                },\n                uri: {\n                  description: 'The source uri of the import pipeline.\\r\\n' +\n                    `When 'AzureStorageBlob': \"https://accountName.blob.core.windows.net/containerName/blobName\"\\r\\n` +\n                    `When 'AzureStorageBlobContainer': \"https://accountName.blob.core.windows.net/containerName\"`,\n                  type: 'string'\n                },\n                keyVaultUri: {\n                  description: 'They key vault secret uri to obtain the source storage SAS token.',\n                  type: 'string'\n                }\n              }\n            },\n            target: {\n              description: 'The target of the pipeline run.',\n              required: [ 'keyVaultUri' ],\n              type: 'object',\n              properties: {\n                type: {\n                  description: 'The type of target for the export pipeline.',\n                  type: 'string'\n                },\n                uri: {\n                  description: 'The target uri of the export pipeline.\\r\\n' +\n                    `When 'AzureStorageBlob': \"https://accountName.blob.core.windows.net/containerName/blobName\"\\r\\n` +\n                    `When 'AzureStorageBlobContainer':  \"https://accountName.blob.core.windows.net/containerName\"`,\n                  type: 'string'\n                },\n                keyVaultUri: {\n                  description: 'They key vault secret uri to obtain the target storage SAS token.',\n                  type: 'string'\n                }\n              }\n            },\n            catalogDigest: {\n              description: 'The digest of the tar used to transfer the artifacts.',\n              type: 'string'\n            },\n            trigger: {\n              description: 'The trigger that caused the pipeline run.',\n              type: 'object',\n              properties: {\n                sourceTrigger: {\n                  description: 'The source trigger that caused the pipeline run.',\n                  type: 'object',\n                  properties: {\n                    timestamp: {\n                      format: 'date-time',\n                      description: 'The timestamp when the source update happened.',\n                      type: 'string'\n                    }\n                  }\n                }\n              }\n            },\n            pipelineRunErrorMessage: {\n              description: 'The detailed error message for the pipeline run in the case of failure.',\n              type: 'string'\n            }\n          }\n        },\n        forceUpdateTag: {\n          description: 'How the pipeline run should be forced to recreate even if the pipeline run configuration has not changed.',\n          type: 'string'\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-02-01-preview"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2022-02-01-preview/containerregistry.json"},"here"),"."))}d.isMDXComponent=!0}}]);