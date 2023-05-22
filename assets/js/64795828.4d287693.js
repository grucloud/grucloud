"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[90469],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>h});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var c=n.createContext({}),u=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},p=function(e){var r=u(e.components);return n.createElement(c.Provider,{value:r},e.children)},l="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),l=u(t),d=a,h=l["".concat(c,".").concat(d)]||l[d]||m[d]||o;return t?n.createElement(h,s(s({ref:r},p),{},{components:t})):n.createElement(h,s({ref:r},p))}));function h(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,s=new Array(o);s[0]=d;var i={};for(var c in r)hasOwnProperty.call(r,c)&&(i[c]=r[c]);i.originalType=e,i[l]="string"==typeof e?e:a,s[1]=i;for(var u=2;u<o;u++)s[u]=t[u];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},41976:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>s,default:()=>m,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var n=t(87462),a=(t(67294),t(3905));const o={id:"GremlinResourceGremlinDatabase",title:"GremlinResourceGremlinDatabase"},s=void 0,i={unversionedId:"azure/resources/DocumentDB/GremlinResourceGremlinDatabase",id:"azure/resources/DocumentDB/GremlinResourceGremlinDatabase",title:"GremlinResourceGremlinDatabase",description:"Provides a GremlinResourceGremlinDatabase from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/GremlinResourceGremlinDatabase.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/GremlinResourceGremlinDatabase",permalink:"/docs/azure/resources/DocumentDB/GremlinResourceGremlinDatabase",draft:!1,tags:[],version:"current",frontMatter:{id:"GremlinResourceGremlinDatabase",title:"GremlinResourceGremlinDatabase"},sidebar:"docs",previous:{title:"GraphResourceGraph",permalink:"/docs/azure/resources/DocumentDB/GraphResourceGraph"},next:{title:"GremlinResourceGremlinDatabaseThroughput",permalink:"/docs/azure/resources/DocumentDB/GremlinResourceGremlinDatabaseThroughput"}},c={},u=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBGremlinDatabaseCreateUpdate",id:"cosmosdbgremlindatabasecreateupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:u},l="wrapper";function m(e){let{components:r,...t}=e;return(0,a.kt)(l,(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"GremlinResourceGremlinDatabase")," from the ",(0,a.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"cosmosdbgremlindatabasecreateupdate"},"CosmosDBGremlinDatabaseCreateUpdate"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "GremlinResourceGremlinDatabase",\n    group: "DocumentDB",\n    name: "myGremlinResourceGremlinDatabase",\n    properties: () => ({\n      location: "West US",\n      tags: {},\n      properties: { resource: { id: "databaseName" }, options: {} },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Parameters to create and update Cosmos DB Gremlin database.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to create and update Azure Cosmos DB Gremlin database.',\n      type: 'object',\n      properties: {\n        resource: {\n          description: 'The standard JSON format of a Gremlin database',\n          type: 'object',\n          properties: {\n            id: {\n              type: 'string',\n              description: 'Name of the Cosmos DB Gremlin database'\n            }\n          },\n          required: [ 'id' ]\n        },\n        options: {\n          description: 'A key-value pair of options to be applied for the request. This corresponds to the headers sent with the request.',\n          type: 'object',\n          properties: {\n            throughput: {\n              type: 'integer',\n              description: 'Request Units per second. For example, \"throughput\": 10000.'\n            },\n            autoscaleSettings: {\n              description: 'Specifies the Autoscale settings.',\n              type: 'object',\n              properties: {\n                maxThroughput: {\n                  type: 'integer',\n                  description: 'Represents maximum throughput, the resource can scale up to.'\n                }\n              }\n            }\n          }\n        }\n      },\n      required: [ 'resource' ]\n    }\n  },\n  allOf: [\n    {\n      type: 'object',\n      description: 'The core properties of ARM resources.',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'The unique resource identifier of the ARM resource.'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the ARM resource.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of Azure resource.'\n        },\n        location: {\n          type: 'string',\n          description: 'The location of the resource group to which the resource belongs.'\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with \"defaultExperience\": \"Cassandra\". Current \"defaultExperience\" values also include \"Table\", \"Graph\", \"DocumentDB\", and \"MongoDB\".'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'properties' ]\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2022-05-15"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/cosmos-db.json"},"here"),"."))}m.isMDXComponent=!0}}]);