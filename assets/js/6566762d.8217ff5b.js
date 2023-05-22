"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[83911],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>m});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function u(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),i=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):u(u({},r),e)),t},p=function(e){var r=i(e.components);return n.createElement(c.Provider,{value:r},e.children)},l="mdxType",h={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),l=i(t),d=o,m=l["".concat(c,".").concat(d)]||l[d]||h[d]||a;return t?n.createElement(m,u(u({ref:r},p),{},{components:t})):n.createElement(m,u({ref:r},p))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,u=new Array(a);u[0]=d;var s={};for(var c in r)hasOwnProperty.call(r,c)&&(s[c]=r[c]);s.originalType=e,s[l]="string"==typeof e?e:o,u[1]=s;for(var i=2;i<a;i++)u[i]=t[i];return n.createElement.apply(null,u)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},13320:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>u,default:()=>h,frontMatter:()=>a,metadata:()=>s,toc:()=>i});var n=t(87462),o=(t(67294),t(3905));const a={id:"TableResourceTableThroughput",title:"TableResourceTableThroughput"},u=void 0,s={unversionedId:"azure/resources/DocumentDB/TableResourceTableThroughput",id:"azure/resources/DocumentDB/TableResourceTableThroughput",title:"TableResourceTableThroughput",description:"Provides a TableResourceTableThroughput from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/TableResourceTableThroughput.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/TableResourceTableThroughput",permalink:"/docs/azure/resources/DocumentDB/TableResourceTableThroughput",draft:!1,tags:[],version:"current",frontMatter:{id:"TableResourceTableThroughput",title:"TableResourceTableThroughput"},sidebar:"docs",previous:{title:"TableResourceTable",permalink:"/docs/azure/resources/DocumentDB/TableResourceTable"},next:{title:"Domain",permalink:"/docs/azure/resources/DomainRegistration/Domain"}},c={},i=[{value:"Examples",id:"examples",level:2},{value:"CosmosDBTableThroughputUpdate",id:"cosmosdbtablethroughputupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:i},l="wrapper";function h(e){let{components:r,...t}=e;return(0,o.kt)(l,(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"TableResourceTableThroughput")," from the ",(0,o.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"cosmosdbtablethroughputupdate"},"CosmosDBTableThroughputUpdate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "TableResourceTableThroughput",\n    group: "DocumentDB",\n    name: "myTableResourceTableThroughput",\n    properties: () => ({\n      location: "West US",\n      tags: {},\n      properties: { resource: { throughput: 400 } },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myDatabaseAccount",\n      table: "myTableResourceTable",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/TableResourceTable"},"TableResourceTable"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Parameters to update Cosmos DB resource throughput.',\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties to update Azure Cosmos DB resource throughput.',\n      type: 'object',\n      properties: {\n        resource: {\n          description: 'The standard JSON format of a resource throughput',\n          type: 'object',\n          properties: {\n            throughput: {\n              type: 'integer',\n              description: 'Value of the Cosmos DB resource throughput. Either throughput is required or autoscaleSettings is required, but not both.'\n            },\n            autoscaleSettings: {\n              description: 'Cosmos DB resource for autoscale settings. Either throughput is required or autoscaleSettings is required, but not both.',\n              type: 'object',\n              properties: {\n                maxThroughput: {\n                  type: 'integer',\n                  description: 'Represents maximum throughput container can scale up to.'\n                },\n                autoUpgradePolicy: {\n                  description: 'Cosmos DB resource auto-upgrade policy',\n                  type: 'object',\n                  properties: {\n                    throughputPolicy: {\n                      description: 'Represents throughput policy which service must adhere to for auto-upgrade',\n                      type: 'object',\n                      properties: {\n                        isEnabled: {\n                          type: 'boolean',\n                          description: 'Determines whether the ThroughputPolicy is active or not'\n                        },\n                        incrementPercent: {\n                          type: 'integer',\n                          description: 'Represents the percentage by which throughput can increase every time throughput policy kicks in.'\n                        }\n                      }\n                    }\n                  }\n                },\n                targetMaxThroughput: {\n                  type: 'integer',\n                  description: 'Represents target maximum throughput container can scale up to once offer is no longer in pending state.',\n                  readOnly: true\n                }\n              },\n              required: [ 'maxThroughput' ]\n            },\n            minimumThroughput: {\n              type: 'string',\n              description: 'The minimum throughput of the resource',\n              readOnly: true\n            },\n            offerReplacePending: {\n              type: 'string',\n              description: 'The throughput replace is pending',\n              readOnly: true\n            }\n          }\n        }\n      },\n      required: [ 'resource' ]\n    }\n  },\n  allOf: [\n    {\n      type: 'object',\n      description: 'The core properties of ARM resources.',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'The unique resource identifier of the ARM resource.'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the ARM resource.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of Azure resource.'\n        },\n        location: {\n          type: 'string',\n          description: 'The location of the resource group to which the resource belongs.'\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Tags are a list of key-value pairs that describe the resource. These tags can be used in viewing and grouping this resource (across resource groups). A maximum of 15 tags can be provided for a resource. Each tag must have a key no greater than 128 characters and value no greater than 256 characters. For example, the default experience for a template type is set with \"defaultExperience\": \"Cassandra\". Current \"defaultExperience\" values also include \"Table\", \"Graph\", \"DocumentDB\", and \"MongoDB\".'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'properties' ]\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-05-15"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/cosmos-db.json"},"here"),"."))}h.isMDXComponent=!0}}]);