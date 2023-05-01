"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[58509],{3905:(e,o,t)=>{t.d(o,{Zo:()=>p,kt:()=>d});var r=t(67294);function n(e,o,t){return o in e?Object.defineProperty(e,o,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[o]=t,e}function u(e,o){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);o&&(r=r.filter((function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var o=1;o<arguments.length;o++){var t=null!=arguments[o]?arguments[o]:{};o%2?u(Object(t),!0).forEach((function(o){n(e,o,t[o])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(o){Object.defineProperty(e,o,Object.getOwnPropertyDescriptor(t,o))}))}return e}function c(e,o){if(null==e)return{};var t,r,n=function(e,o){if(null==e)return{};var t,r,n={},u=Object.keys(e);for(r=0;r<u.length;r++)t=u[r],o.indexOf(t)>=0||(n[t]=e[t]);return n}(e,o);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(r=0;r<u.length;r++)t=u[r],o.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var a=r.createContext({}),i=function(e){var o=r.useContext(a),t=o;return e&&(t="function"==typeof e?e(o):s(s({},o),e)),t},p=function(e){var o=i(e.components);return r.createElement(a.Provider,{value:o},e.children)},l="mdxType",g={inlineCode:"code",wrapper:function(e){var o=e.children;return r.createElement(r.Fragment,{},o)}},h=r.forwardRef((function(e,o){var t=e.components,n=e.mdxType,u=e.originalType,a=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),l=i(t),h=n,d=l["".concat(a,".").concat(h)]||l[h]||g[h]||u;return t?r.createElement(d,s(s({ref:o},p),{},{components:t})):r.createElement(d,s({ref:o},p))}));function d(e,o){var t=arguments,n=o&&o.mdxType;if("string"==typeof e||n){var u=t.length,s=new Array(u);s[0]=h;var c={};for(var a in o)hasOwnProperty.call(o,a)&&(c[a]=o[a]);c.originalType=e,c[l]="string"==typeof e?e:n,s[1]=c;for(var i=2;i<u;i++)s[i]=t[i];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}h.displayName="MDXCreateElement"},91412:(e,o,t)=>{t.r(o),t.d(o,{assets:()=>a,contentTitle:()=>s,default:()=>g,frontMatter:()=>u,metadata:()=>c,toc:()=>i});var r=t(87462),n=(t(67294),t(3905));const u={id:"MongoDBResourceMongoDBCollectionThroughput",title:"MongoDBResourceMongoDBCollectionThroughput"},s=void 0,c={unversionedId:"azure/resources/DocumentDB/MongoDBResourceMongoDBCollectionThroughput",id:"azure/resources/DocumentDB/MongoDBResourceMongoDBCollectionThroughput",title:"MongoDBResourceMongoDBCollectionThroughput",description:"Provides a MongoDBResourceMongoDBCollectionThroughput from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBCollectionThroughput.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/MongoDBResourceMongoDBCollectionThroughput",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBCollectionThroughput",draft:!1,tags:[],version:"current",frontMatter:{id:"MongoDBResourceMongoDBCollectionThroughput",title:"MongoDBResourceMongoDBCollectionThroughput"},sidebar:"docs",previous:{title:"MongoDBResourceMongoDBCollection",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBCollection"},next:{title:"MongoDBResourceMongoDBDatabase",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase"}},a={},i=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBMongoDBCollectionThroughputUpdate",id:"cosmosdbmongodbcollectionthroughputupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:i},l="wrapper";function g(e){let{components:o,...t}=e;return(0,n.kt)(l,(0,r.Z)({},p,t,{components:o,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Provides a ",(0,n.kt)("strong",{parentName:"p"},"MongoDBResourceMongoDBCollectionThroughput")," from the ",(0,n.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,n.kt)("h2",{id:"examples"},"Examples"),(0,n.kt)("h3",{id:"cosmosdbmongodbcollectionthroughputupdate"},"CosmosDBMongoDBCollectionThroughputUpdate"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "MongoDBResourceMongoDBCollectionThroughput",\n    group: "DocumentDB",\n    name: "myMongoDBResourceMongoDBCollectionThroughput",\n    properties: () => ({\n      location: "West US",\n      tags: {},\n      properties: { resource: { throughput: 400 } },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n      database: "myMongoDBResourceMongoDBDatabase",\n      collection: "myMongoDBResourceMongoDBCollection",\n    }),\n  },\n];\n\n')),(0,n.kt)("h2",{id:"dependencies"},"Dependencies"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase"},"MongoDBResourceMongoDBDatabase")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBCollection"},"MongoDBResourceMongoDBCollection"))),(0,n.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Parameters to update Cosmos DB resource throughput.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to update Azure Cosmos DB resource throughput.',\n      type: 'object',\n      properties: {\n        resource: {\n          description: 'The standard JSON format of a resource throughput',\n          type: 'object',\n          properties: {\n            throughput: {\n              type: 'integer',\n              description: 'Value of the Cosmos DB resource throughput. Either throughput is required or autoscaleSettings is required, but not both.'\n            },\n            autoscaleSettings: {\n              description: 'Cosmos DB resource for autoscale settings. Either throughput is required or autoscaleSettings is required, but not both.',\n              type: 'object',\n              properties: {\n                maxThroughput: {\n                  type: 'integer',\n                  description: 'Represents maximum throughput container can scale up to.'\n                },\n                autoUpgradePolicy: {\n                  description: 'Cosmos DB resource auto-upgrade policy',\n                  type: 'object',\n                  properties: {\n                    throughputPolicy: {\n                      description: 'Represents throughput policy which service must adhere to for auto-upgrade',\n                      type: 'object',\n                      properties: {\n                        isEnabled: {\n                          type: 'boolean',\n                          description: 'Determines whether the ThroughputPolicy is active or not'\n                        },\n                        incrementPercent: {\n                          type: 'integer',\n                          description: 'Represents the percentage by which throughput can increase every time throughput policy kicks in.'\n                        }\n                      }\n                    }\n                  }\n                },\n                targetMaxThroughput: {\n                  type: 'integer',\n                  description: 'Represents target maximum throughput container can scale up to once offer is no longer in pending state.',\n                  readOnly: true\n                }\n              },\n              required: [ 'maxThroughput' ]\n            },\n            minimumThroughput: {\n              type: 'string',\n              description: 'The minimum throughput of the resource',\n              readOnly: true\n            },\n            offerReplacePending: {\n              type: 'string',\n              description: 'The throughput replace is pending',\n              readOnly: true\n            }\n          }\n        }\n      },\n      required: [ 'resource' ]\n    }\n  },\n  allOf: [\n    {\n      type: 'object',\n      description: 'The core properties of ARM resources.',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'The unique resource identifier of the ARM resource.'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the ARM resource.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of Azure resource.'\n        },\n        location: {\n          type: 'string',\n          description: 'The location of the resource group to which the resource belongs.'\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with \"defaultExperience\": \"Cassandra\". Current \"defaultExperience\" values also include \"Table\", \"Graph\", \"DocumentDB\", and \"MongoDB\".'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'properties' ]\n}\n")),(0,n.kt)("h2",{id:"misc"},"Misc"),(0,n.kt)("p",null,"The resource version is ",(0,n.kt)("inlineCode",{parentName:"p"},"2022-05-15"),"."),(0,n.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,n.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/cosmos-db.json"},"here"),"."))}g.isMDXComponent=!0}}]);