"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[68776],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var o=r(67294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,o,n=function(e,t){if(null==e)return{};var r,o,n={},a=Object.keys(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)r=a[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var c=o.createContext({}),i=function(e){var t=o.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=i(e.components);return o.createElement(c.Provider,{value:t},e.children)},g="mdxType",h={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},l=o.forwardRef((function(e,t){var r=e.components,n=e.mdxType,a=e.originalType,c=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),g=i(r),l=n,d=g["".concat(c,".").concat(l)]||g[l]||h[l]||a;return r?o.createElement(d,s(s({ref:t},p),{},{components:r})):o.createElement(d,s({ref:t},p))}));function d(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=r.length,s=new Array(a);s[0]=l;var u={};for(var c in t)hasOwnProperty.call(t,c)&&(u[c]=t[c]);u.originalType=e,u[g]="string"==typeof e?e:n,s[1]=u;for(var i=2;i<a;i++)s[i]=r[i];return o.createElement.apply(null,s)}return o.createElement.apply(null,r)}l.displayName="MDXCreateElement"},79953:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>u,toc:()=>i});var o=r(87462),n=(r(67294),r(3905));const a={id:"MongoDBResourceMongoDBDatabaseThroughput",title:"MongoDBResourceMongoDBDatabaseThroughput"},s=void 0,u={unversionedId:"azure/resources/DocumentDB/MongoDBResourceMongoDBDatabaseThroughput",id:"azure/resources/DocumentDB/MongoDBResourceMongoDBDatabaseThroughput",title:"MongoDBResourceMongoDBDatabaseThroughput",description:"Provides a MongoDBResourceMongoDBDatabaseThroughput from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabaseThroughput.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabaseThroughput",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabaseThroughput",draft:!1,tags:[],version:"current",frontMatter:{id:"MongoDBResourceMongoDBDatabaseThroughput",title:"MongoDBResourceMongoDBDatabaseThroughput"},sidebar:"docs",previous:{title:"MongoDBResourceMongoDBDatabase",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase"},next:{title:"MongoDBResourceMongoRoleDefinition",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoRoleDefinition"}},c={},i=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBMongoDBDatabaseThroughputUpdate",id:"cosmosdbmongodbdatabasethroughputupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:i},g="wrapper";function h(e){let{components:t,...r}=e;return(0,n.kt)(g,(0,o.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Provides a ",(0,n.kt)("strong",{parentName:"p"},"MongoDBResourceMongoDBDatabaseThroughput")," from the ",(0,n.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,n.kt)("h2",{id:"examples"},"Examples"),(0,n.kt)("h3",{id:"cosmosdbmongodbdatabasethroughputupdate"},"CosmosDBMongoDBDatabaseThroughputUpdate"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "MongoDBResourceMongoDBDatabaseThroughput",\n    group: "DocumentDB",\n    name: "myMongoDBResourceMongoDBDatabaseThroughput",\n    properties: () => ({\n      location: "West US",\n      tags: {},\n      properties: { resource: { throughput: 400 } },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n      database: "myMongoDBResourceMongoDBDatabase",\n    }),\n  },\n];\n\n')),(0,n.kt)("h2",{id:"dependencies"},"Dependencies"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase"},"MongoDBResourceMongoDBDatabase"))),(0,n.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Parameters to update Cosmos DB resource throughput.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to update Azure Cosmos DB resource throughput.',\n      type: 'object',\n      properties: {\n        resource: {\n          description: 'The standard JSON format of a resource throughput',\n          type: 'object',\n          properties: {\n            throughput: {\n              type: 'integer',\n              description: 'Value of the Cosmos DB resource throughput. Either throughput is required or autoscaleSettings is required, but not both.'\n            },\n            autoscaleSettings: {\n              description: 'Cosmos DB resource for autoscale settings. Either throughput is required or autoscaleSettings is required, but not both.',\n              type: 'object',\n              properties: {\n                maxThroughput: {\n                  type: 'integer',\n                  description: 'Represents maximum throughput container can scale up to.'\n                },\n                autoUpgradePolicy: {\n                  description: 'Cosmos DB resource auto-upgrade policy',\n                  type: 'object',\n                  properties: {\n                    throughputPolicy: {\n                      description: 'Represents throughput policy which service must adhere to for auto-upgrade',\n                      type: 'object',\n                      properties: {\n                        isEnabled: {\n                          type: 'boolean',\n                          description: 'Determines whether the ThroughputPolicy is active or not'\n                        },\n                        incrementPercent: {\n                          type: 'integer',\n                          description: 'Represents the percentage by which throughput can increase every time throughput policy kicks in.'\n                        }\n                      }\n                    }\n                  }\n                },\n                targetMaxThroughput: {\n                  type: 'integer',\n                  description: 'Represents target maximum throughput container can scale up to once offer is no longer in pending state.',\n                  readOnly: true\n                }\n              },\n              required: [ 'maxThroughput' ]\n            },\n            minimumThroughput: {\n              type: 'string',\n              description: 'The minimum throughput of the resource',\n              readOnly: true\n            },\n            offerReplacePending: {\n              type: 'string',\n              description: 'The throughput replace is pending',\n              readOnly: true\n            }\n          }\n        }\n      },\n      required: [ 'resource' ]\n    }\n  },\n  allOf: [\n    {\n      type: 'object',\n      description: 'The core properties of ARM resources.',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'The unique resource identifier of the ARM resource.'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the ARM resource.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of Azure resource.'\n        },\n        location: {\n          type: 'string',\n          description: 'The location of the resource group to which the resource belongs.'\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with \"defaultExperience\": \"Cassandra\". Current \"defaultExperience\" values also include \"Table\", \"Graph\", \"DocumentDB\", and \"MongoDB\".'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'properties' ]\n}\n")),(0,n.kt)("h2",{id:"misc"},"Misc"),(0,n.kt)("p",null,"The resource version is ",(0,n.kt)("inlineCode",{parentName:"p"},"2022-05-15"),"."),(0,n.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/cosmos-db.json"},"here"),"."))}h.isMDXComponent=!0}}]);