"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[24949],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=n.createContext({}),i=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=i(e.components);return n.createElement(u.Provider,{value:t},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},g=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,u=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),l=i(r),g=o,m=l["".concat(u,".").concat(g)]||l[g]||d[g]||a;return r?n.createElement(m,s(s({ref:t},p),{},{components:r})):n.createElement(m,s({ref:t},p))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,s=new Array(a);s[0]=g;var c={};for(var u in t)hasOwnProperty.call(t,u)&&(c[u]=t[u]);c.originalType=e,c[l]="string"==typeof e?e:o,s[1]=c;for(var i=2;i<a;i++)s[i]=r[i];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}g.displayName="MDXCreateElement"},93266:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>c,toc:()=>i});var n=r(87462),o=(r(67294),r(3905));const a={id:"MongoDBResourceMongoDBDatabase",title:"MongoDBResourceMongoDBDatabase"},s=void 0,c={unversionedId:"azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase",id:"azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase",title:"MongoDBResourceMongoDBDatabase",description:"Provides a MongoDBResourceMongoDBDatabase from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabase",draft:!1,tags:[],version:"current",frontMatter:{id:"MongoDBResourceMongoDBDatabase",title:"MongoDBResourceMongoDBDatabase"},sidebar:"docs",previous:{title:"MongoDBResourceMongoDBCollectionThroughput",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBCollectionThroughput"},next:{title:"MongoDBResourceMongoDBDatabaseThroughput",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabaseThroughput"}},u={},i=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBMongoDBDatabaseCreateUpdate",id:"cosmosdbmongodbdatabasecreateupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:i},l="wrapper";function d(e){let{components:t,...r}=e;return(0,o.kt)(l,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"MongoDBResourceMongoDBDatabase")," from the ",(0,o.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"cosmosdbmongodbdatabasecreateupdate"},"CosmosDBMongoDBDatabaseCreateUpdate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "MongoDBResourceMongoDBDatabase",\n    group: "DocumentDB",\n    name: "myMongoDBResourceMongoDBDatabase",\n    properties: () => ({\n      location: "West US",\n      tags: {},\n      properties: { resource: { id: "databaseName" }, options: {} },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Parameters to create and update Cosmos DB MongoDB database.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to create and update Azure Cosmos DB MongoDB database.',\n      type: 'object',\n      properties: {\n        resource: {\n          description: 'The standard JSON format of a MongoDB database',\n          type: 'object',\n          properties: {\n            id: {\n              type: 'string',\n              description: 'Name of the Cosmos DB MongoDB database'\n            }\n          },\n          required: [ 'id' ]\n        },\n        options: {\n          description: 'A key-value pair of options to be applied for the request. This corresponds to the headers sent with the request.',\n          type: 'object',\n          properties: {\n            throughput: {\n              type: 'integer',\n              description: 'Request Units per second. For example, \"throughput\": 10000.'\n            },\n            autoscaleSettings: {\n              description: 'Specifies the Autoscale settings.',\n              type: 'object',\n              properties: {\n                maxThroughput: {\n                  type: 'integer',\n                  description: 'Represents maximum throughput, the resource can scale up to.'\n                }\n              }\n            }\n          }\n        }\n      },\n      required: [ 'resource' ]\n    }\n  },\n  allOf: [\n    {\n      type: 'object',\n      description: 'The core properties of ARM resources.',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'The unique resource identifier of the ARM resource.'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the ARM resource.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of Azure resource.'\n        },\n        location: {\n          type: 'string',\n          description: 'The location of the resource group to which the resource belongs.'\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with \"defaultExperience\": \"Cassandra\". Current \"defaultExperience\" values also include \"Table\", \"Graph\", \"DocumentDB\", and \"MongoDB\".'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'properties' ]\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-05-15"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/cosmos-db.json"},"here"),"."))}d.isMDXComponent=!0}}]);