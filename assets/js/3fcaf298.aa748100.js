"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[43839],{3905:(e,n,o)=>{o.d(n,{Zo:()=>p,kt:()=>g});var t=o(67294);function r(e,n,o){return n in e?Object.defineProperty(e,n,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[n]=o,e}function i(e,n){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),o.push.apply(o,t)}return o}function a(e){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?i(Object(o),!0).forEach((function(n){r(e,n,o[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):i(Object(o)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(o,n))}))}return e}function s(e,n){if(null==e)return{};var o,t,r=function(e,n){if(null==e)return{};var o,t,r={},i=Object.keys(e);for(t=0;t<i.length;t++)o=i[t],n.indexOf(o)>=0||(r[o]=e[o]);return r}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)o=i[t],n.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var c=t.createContext({}),l=function(e){var n=t.useContext(c),o=n;return e&&(o="function"==typeof e?e(n):a(a({},n),e)),o},p=function(e){var n=l(e.components);return t.createElement(c.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var o=e.components,r=e.mdxType,i=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=l(o),m=r,g=u["".concat(c,".").concat(m)]||u[m]||d[m]||i;return o?t.createElement(g,a(a({ref:n},p),{},{components:o})):t.createElement(g,a({ref:n},p))}));function g(e,n){var o=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var i=o.length,a=new Array(i);a[0]=m;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s[u]="string"==typeof e?e:r,a[1]=s;for(var l=2;l<i;l++)a[l]=o[l];return t.createElement.apply(null,a)}return t.createElement.apply(null,o)}m.displayName="MDXCreateElement"},72028:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>l});var t=o(87462),r=(o(67294),o(3905));const i={id:"MongoDBResourceMongoRoleDefinition",title:"MongoDBResourceMongoRoleDefinition"},a=void 0,s={unversionedId:"azure/resources/DocumentDB/MongoDBResourceMongoRoleDefinition",id:"azure/resources/DocumentDB/MongoDBResourceMongoRoleDefinition",title:"MongoDBResourceMongoRoleDefinition",description:"Provides a MongoDBResourceMongoRoleDefinition from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/MongoDBResourceMongoRoleDefinition.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/MongoDBResourceMongoRoleDefinition",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoRoleDefinition",draft:!1,tags:[],version:"current",frontMatter:{id:"MongoDBResourceMongoRoleDefinition",title:"MongoDBResourceMongoRoleDefinition"},sidebar:"docs",previous:{title:"MongoDBResourceMongoDBDatabaseThroughput",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoDBDatabaseThroughput"},next:{title:"MongoDBResourceMongoUserDefinition",permalink:"/docs/azure/resources/DocumentDB/MongoDBResourceMongoUserDefinition"}},c={},l=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBMongoDBRoleDefinitionCreateUpdate",id:"cosmosdbmongodbroledefinitioncreateupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:l},u="wrapper";function d(e){let{components:n,...o}=e;return(0,r.kt)(u,(0,t.Z)({},p,o,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Provides a ",(0,r.kt)("strong",{parentName:"p"},"MongoDBResourceMongoRoleDefinition")," from the ",(0,r.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,r.kt)("h2",{id:"examples"},"Examples"),(0,r.kt)("h3",{id:"cosmosdbmongodbroledefinitioncreateupdate"},"CosmosDBMongoDBRoleDefinitionCreateUpdate"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "MongoDBResourceMongoRoleDefinition",\n    group: "DocumentDB",\n    name: "myMongoDBResourceMongoRoleDefinition",\n    properties: () => ({\n      properties: {\n        roleName: "myRoleName",\n        databaseName: "sales",\n        privileges: [\n          {\n            resource: { db: "sales", collection: "sales" },\n            actions: ["insert", "find"],\n          },\n        ],\n        roles: [{ role: "myInheritedRole", db: "sales" }],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n    }),\n  },\n];\n\n')),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount"))),(0,r.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Parameters to create and update an Azure Cosmos DB Mongo Role Definition.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to create and update an Azure Cosmos DB Mongo Role Definition.',\n      type: 'object',\n      properties: {\n        roleName: {\n          type: 'string',\n          description: 'A user-friendly name for the Role Definition. Must be unique for the database account.'\n        },\n        type: {\n          type: 'string',\n          enum: [ 'BuiltInRole', 'CustomRole' ],\n          description: 'Indicates whether the Role Definition was built-in or user created.',\n          'x-ms-enum': { name: 'MongoRoleDefinitionType', modelAsString: false }\n        },\n        databaseName: {\n          type: 'string',\n          description: 'The database name for which access is being granted for this Role Definition.'\n        },\n        privileges: {\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              resource: {\n                type: 'object',\n                properties: {\n                  db: {\n                    type: 'string',\n                    description: 'The database name the role is applied.'\n                  },\n                  collection: {\n                    type: 'string',\n                    description: 'The collection name the role is applied.'\n                  }\n                },\n                description: 'An Azure Cosmos DB Mongo DB Resource.'\n              },\n              actions: {\n                type: 'array',\n                items: { type: 'string' },\n                description: 'An array of actions that are allowed.'\n              }\n            },\n            description: 'The set of data plane operations permitted through this Role Definition.'\n          },\n          description: 'A set of privileges contained by the Role Definition. This will allow application of this Role Definition on the entire database account or any underlying Database / Collection. Scopes higher than Database are not enforceable as privilege.'\n        },\n        roles: {\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              db: {\n                type: 'string',\n                description: 'The database name the role is applied.'\n              },\n              role: { type: 'string', description: 'The role name.' }\n            },\n            description: 'The set of roles permitted through this Role Definition.'\n          },\n          description: 'The set of roles inherited by this Role Definition.'\n        }\n      }\n    }\n  }\n}\n")),(0,r.kt)("h2",{id:"misc"},"Misc"),(0,r.kt)("p",null,"The resource version is ",(0,r.kt)("inlineCode",{parentName:"p"},"2022-05-15-preview"),"."),(0,r.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-05-15-preview/mongorbac.json"},"here"),"."))}d.isMDXComponent=!0}}]);