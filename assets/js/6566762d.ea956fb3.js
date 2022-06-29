"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[83911],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>h});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function s(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?s(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)r=s[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),c=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(u.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,s=e.originalType,u=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),d=c(r),h=o,m=d["".concat(u,".").concat(h)]||d[h]||l[h]||s;return r?n.createElement(m,i(i({ref:t},p),{},{components:r})):n.createElement(m,i({ref:t},p))}));function h(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var s=r.length,i=new Array(s);i[0]=d;var a={};for(var u in t)hasOwnProperty.call(t,u)&&(a[u]=t[u]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var c=2;c<s;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},13320:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>l,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var n=r(87462),o=(r(67294),r(3905));const s={id:"TableResourceTableThroughput",title:"TableResourceTableThroughput"},i=void 0,a={unversionedId:"azure/resources/DocumentDB/TableResourceTableThroughput",id:"azure/resources/DocumentDB/TableResourceTableThroughput",title:"TableResourceTableThroughput",description:"Provides a TableResourceTableThroughput from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/TableResourceTableThroughput.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/TableResourceTableThroughput",permalink:"/docs/azure/resources/DocumentDB/TableResourceTableThroughput",draft:!1,tags:[],version:"current",frontMatter:{id:"TableResourceTableThroughput",title:"TableResourceTableThroughput"},sidebar:"docs",previous:{title:"TableResourceTable",permalink:"/docs/azure/resources/DocumentDB/TableResourceTable"},next:{title:"Domain",permalink:"/docs/azure/resources/DomainRegistration/Domain"}},u={},c=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBTableThroughputUpdate",id:"cosmosdbtablethroughputupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:c};function l(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"TableResourceTableThroughput")," from the ",(0,o.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"cosmosdbtablethroughputupdate"},"CosmosDBTableThroughputUpdate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "TableResourceTableThroughput",\n    group: "DocumentDB",\n    name: "myTableResourceTableThroughput",\n    properties: () => ({\n      location: "West US",\n      tags: {},\n      properties: { resource: { throughput: 400 } },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n      table: "myTableResourceTable",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/TableResourceTable"},"TableResourceTable"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Parameters to update Cosmos DB resource throughput.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to update Azure Cosmos DB resource throughput.',\n      type: 'object',\n      properties: {\n        resource: {\n          description: 'The standard JSON format of a resource throughput',\n          type: 'object',\n          properties: {\n            throughput: {\n              type: 'integer',\n              description: 'Value of the Cosmos DB resource throughput. Either throughput is required or autoscaleSettings is required, but not both.'\n            },\n            autoscaleSettings: {\n              description: 'Cosmos DB resource for autoscale settings. Either throughput is required or autoscaleSettings is required, but not both.',\n              type: 'object',\n              properties: {\n                maxThroughput: {\n                  type: 'integer',\n                  description: 'Represents maximum throughput container can scale up to.'\n                },\n                autoUpgradePolicy: {\n                  description: 'Cosmos DB resource auto-upgrade policy',\n                  type: 'object',\n                  properties: {\n                    throughputPolicy: {\n                      description: 'Represents throughput policy which service must adhere to for auto-upgrade',\n                      type: 'object',\n                      properties: {\n                        isEnabled: {\n                          type: 'boolean',\n                          description: 'Determines whether the ThroughputPolicy is active or not'\n                        },\n                        incrementPercent: {\n                          type: 'integer',\n                          description: 'Represents the percentage by which throughput can increase every time throughput policy kicks in.'\n                        }\n                      }\n                    }\n                  }\n                },\n                targetMaxThroughput: {\n                  type: 'integer',\n                  description: 'Represents target maximum throughput container can scale up to once offer is no longer in pending state.',\n                  readOnly: true\n                }\n              },\n              required: [ 'maxThroughput' ]\n            },\n            minimumThroughput: {\n              type: 'string',\n              description: 'The minimum throughput of the resource',\n              readOnly: true\n            },\n            offerReplacePending: {\n              type: 'string',\n              description: 'The throughput replace is pending',\n              readOnly: true\n            }\n          }\n        }\n      },\n      required: [ 'resource' ]\n    }\n  },\n  allOf: [\n    {\n      type: 'object',\n      description: 'The core properties of ARM resources.',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'The unique resource identifier of the ARM resource.'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the ARM resource.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of Azure resource.'\n        },\n        location: {\n          type: 'string',\n          description: 'The location of the resource group to which the resource belongs.'\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with \"defaultExperience\": \"Cassandra\". Current \"defaultExperience\" values also include \"Table\", \"Graph\", \"DocumentDB\", and \"MongoDB\".'\n        },\n        identity: {\n          properties: {\n            principalId: {\n              readOnly: true,\n              type: 'string',\n              description: 'The principal id of the system assigned identity. This property will only be provided for a system assigned identity.'\n            },\n            tenantId: {\n              readOnly: true,\n              type: 'string',\n              description: 'The tenant id of the system assigned identity. This property will only be provided for a system assigned identity.'\n            },\n            type: {\n              type: 'string',\n              description: \"The type of identity used for the resource. The type 'SystemAssigned,UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the service.\",\n              enum: [\n                'SystemAssigned',\n                'UserAssigned',\n                'SystemAssigned,UserAssigned',\n                'None'\n              ],\n              'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }\n            },\n            userAssignedIdentities: {\n              type: 'object',\n              additionalProperties: {\n                type: 'object',\n                properties: {\n                  principalId: {\n                    readOnly: true,\n                    type: 'string',\n                    description: 'The principal id of user assigned identity.'\n                  },\n                  clientId: {\n                    readOnly: true,\n                    type: 'string',\n                    description: 'The client id of user assigned identity.'\n                  }\n                }\n              },\n              description: \"The list of user identities associated with resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.\"\n            }\n          },\n          description: 'Identity for the resource.'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'properties' ]\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-02-15-preview"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview/cosmos-db.json"},"here"),"."))}l.isMDXComponent=!0}}]);