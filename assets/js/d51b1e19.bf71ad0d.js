"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[44348],{3905:function(e,t,o){o.d(t,{Zo:function(){return l},kt:function(){return D}});var n=o(67294);function r(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,n)}return o}function c(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){r(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function u(e,t){if(null==e)return{};var o,n,r=function(e,t){if(null==e)return{};var o,n,r={},a=Object.keys(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)o=a[n],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(r[o]=e[o])}return r}var s=n.createContext({}),i=function(e){var t=n.useContext(s),o=t;return e&&(o="function"==typeof e?e(t):c(c({},t),e)),o},l=function(e){var t=i(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var o=e.components,r=e.mdxType,a=e.originalType,s=e.parentName,l=u(e,["components","mdxType","originalType","parentName"]),m=i(o),D=r,g=m["".concat(s,".").concat(D)]||m[D]||p[D]||a;return o?n.createElement(g,c(c({ref:t},l),{},{components:o})):n.createElement(g,c({ref:t},l))}));function D(e,t){var o=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=o.length,c=new Array(a);c[0]=m;var u={};for(var s in t)hasOwnProperty.call(t,s)&&(u[s]=t[s]);u.originalType=e,u.mdxType="string"==typeof e?e:r,c[1]=u;for(var i=2;i<a;i++)c[i]=o[i];return n.createElement.apply(null,c)}return n.createElement.apply(null,o)}m.displayName="MDXCreateElement"},2108:function(e,t,o){o.r(t),o.d(t,{frontMatter:function(){return u},contentTitle:function(){return s},metadata:function(){return i},toc:function(){return l},default:function(){return m}});var n=o(87462),r=o(63366),a=(o(67294),o(3905)),c=["components"],u={id:"DatabaseAccountMongoDBCollectionThroughput",title:"DatabaseAccountMongoDBCollectionThroughput"},s=void 0,i={unversionedId:"azure/resources/DocumentDB/DatabaseAccountMongoDBCollectionThroughput",id:"azure/resources/DocumentDB/DatabaseAccountMongoDBCollectionThroughput",isDocsHomePage:!1,title:"DatabaseAccountMongoDBCollectionThroughput",description:"Provides a DatabaseAccountMongoDBCollectionThroughput from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/DatabaseAccountMongoDBCollectionThroughput.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/DatabaseAccountMongoDBCollectionThroughput",permalink:"/docs/azure/resources/DocumentDB/DatabaseAccountMongoDBCollectionThroughput",tags:[],version:"current",frontMatter:{id:"DatabaseAccountMongoDBCollectionThroughput",title:"DatabaseAccountMongoDBCollectionThroughput"},sidebar:"docs",previous:{title:"DatabaseAccountMongoDBCollection",permalink:"/docs/azure/resources/DocumentDB/DatabaseAccountMongoDBCollection"},next:{title:"DatabaseAccountMongoDBDatabase",permalink:"/docs/azure/resources/DocumentDB/DatabaseAccountMongoDBDatabase"}},l=[{value:"Examples",id:"examples",children:[{value:"CosmosDBMongoDBCollectionThroughputUpdate",id:"cosmosdbmongodbcollectionthroughputupdate",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:l};function m(e){var t=e.components,o=(0,r.Z)(e,c);return(0,a.kt)("wrapper",(0,n.Z)({},p,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"DatabaseAccountMongoDBCollectionThroughput")," from the ",(0,a.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"cosmosdbmongodbcollectionthroughputupdate"},"CosmosDBMongoDBCollectionThroughputUpdate"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "DatabaseAccountMongoDBCollectionThroughput",\n    group: "DocumentDB",\n    name: "myDatabaseAccountMongoDBCollectionThroughput",\n    properties: () => ({ properties: { resource: { throughput: 400 } } }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n      database: "myDatabaseAccountMongoDBDatabase",\n      collection: "myDatabaseAccountMongoDBCollection",\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccountMongoDBDatabase"},"DatabaseAccountMongoDBDatabase")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccountMongoDBCollection"},"DatabaseAccountMongoDBCollection"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Parameters to update Cosmos DB resource throughput.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to update Azure Cosmos DB resource throughput.',\n      type: 'object',\n      properties: {\n        resource: {\n          description: 'The standard JSON format of a resource throughput',\n          type: 'object',\n          properties: {\n            throughput: {\n              type: 'integer',\n              description: 'Value of the Cosmos DB resource throughput'\n            }\n          },\n          required: [ 'throughput' ]\n        }\n      },\n      required: [ 'resource' ]\n    }\n  },\n  required: [ 'properties' ]\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2016-03-31"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2016-03-31/cosmos-db.json"},"here"),"."))}m.isMDXComponent=!0}}]);