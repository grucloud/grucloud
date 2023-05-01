"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[85622],{3905:(e,r,t)=>{t.d(r,{Zo:()=>u,kt:()=>g});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),p=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},u=function(e){var r=p(e.components);return n.createElement(c.Provider,{value:r},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),l=p(t),m=o,g=l["".concat(c,".").concat(m)]||l[m]||d[m]||a;return t?n.createElement(g,s(s({ref:r},u),{},{components:t})):n.createElement(g,s({ref:r},u))}));function g(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,s=new Array(a);s[0]=m;var i={};for(var c in r)hasOwnProperty.call(r,c)&&(i[c]=r[c]);i.originalType=e,i[l]="string"==typeof e?e:o,s[1]=i;for(var p=2;p<a;p++)s[p]=t[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},51301:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>p});var n=t(87462),o=(t(67294),t(3905));const a={id:"Table",title:"Table"},s=void 0,i={unversionedId:"azure/resources/Storage/Table",id:"azure/resources/Storage/Table",title:"Table",description:"Provides a Table from the Storage group",source:"@site/docs/azure/resources/Storage/Table.md",sourceDirName:"azure/resources/Storage",slug:"/azure/resources/Storage/Table",permalink:"/docs/azure/resources/Storage/Table",draft:!1,tags:[],version:"current",frontMatter:{id:"Table",title:"Table"},sidebar:"docs",previous:{title:"StorageAccount",permalink:"/docs/azure/resources/Storage/StorageAccount"},next:{title:"TableService",permalink:"/docs/azure/resources/Storage/TableService"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"TableOperationPut",id:"tableoperationput",level:3},{value:"TableOperationPutOrPatchAcls",id:"tableoperationputorpatchacls",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:p},l="wrapper";function d(e){let{components:r,...t}=e;return(0,o.kt)(l,(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"Table")," from the ",(0,o.kt)("strong",{parentName:"p"},"Storage")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"tableoperationput"},"TableOperationPut"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Table",\n    group: "Storage",\n    name: "myTable",\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,o.kt)("h3",{id:"tableoperationputorpatchacls"},"TableOperationPutOrPatchAcls"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Table",\n    group: "Storage",\n    name: "myTable",\n    properties: () => ({\n      properties: {\n        signedIdentifiers: [\n          {\n            id: "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI",\n            accessPolicy: {\n              startTime: "2022-03-17T08:49:37.0000000Z",\n              expiryTime: "2022-03-20T08:49:37.0000000Z",\n              permission: "raud",\n            },\n          },\n          {\n            id: "PTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODklMTI",\n            accessPolicy: {\n              startTime: "2022-03-17T08:49:37.0000000Z",\n              expiryTime: "2022-03-20T08:49:37.0000000Z",\n              permission: "rad",\n            },\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Storage/StorageAccount"},"StorageAccount"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      'x-ms-client-name': 'TableProperties',\n      description: 'Table resource properties.',\n      properties: {\n        tableName: {\n          type: 'string',\n          readOnly: true,\n          description: 'Table name under the specified account'\n        },\n        signedIdentifiers: {\n          type: 'array',\n          items: {\n            properties: {\n              id: {\n                type: 'string',\n                description: 'unique-64-character-value of the stored access policy.'\n              },\n              accessPolicy: {\n                description: 'Access policy',\n                properties: {\n                  startTime: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'Start time of the access policy'\n                  },\n                  expiryTime: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'Expiry time of the access policy'\n                  },\n                  permission: {\n                    type: 'string',\n                    description: \"Required. List of abbreviated permissions. Supported permission values include 'r','a','u','d'\"\n                  }\n                },\n                required: [ 'permission' ],\n                type: 'object'\n              }\n            },\n            required: [ 'id' ],\n            type: 'object',\n            description: 'Object to set Table Access Policy.'\n          },\n          description: 'List of stored access policies specified on the table.'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      title: 'Resource',\n      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n      type: 'object',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the resource'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Properties of the table, including Id, resource name, resource type.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-05-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2022-05-01/table.json"},"here"),"."))}d.isMDXComponent=!0}}]);