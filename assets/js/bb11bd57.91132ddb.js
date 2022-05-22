"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[85622],{3905:function(e,r,n){n.d(r,{Zo:function(){return u},kt:function(){return m}});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function a(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function i(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?a(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function s(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},a=Object.keys(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)n=a[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=t.createContext({}),p=function(e){var r=t.useContext(c),n=r;return e&&(n="function"==typeof e?e(r):i(i({},r),e)),n},u=function(e){var r=p(e.components);return t.createElement(c.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=p(n),m=o,f=d["".concat(c,".").concat(m)]||d[m]||l[m]||a;return n?t.createElement(f,i(i({ref:r},u),{},{components:n})):t.createElement(f,i({ref:r},u))}));function m(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=d;var s={};for(var c in r)hasOwnProperty.call(r,c)&&(s[c]=r[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var p=2;p<a;p++)i[p]=n[p];return t.createElement.apply(null,i)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},51301:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var t=n(87462),o=n(63366),a=(n(67294),n(3905)),i=["components"],s={id:"Table",title:"Table"},c=void 0,p={unversionedId:"azure/resources/Storage/Table",id:"azure/resources/Storage/Table",isDocsHomePage:!1,title:"Table",description:"Provides a Table from the Storage group",source:"@site/docs/azure/resources/Storage/Table.md",sourceDirName:"azure/resources/Storage",slug:"/azure/resources/Storage/Table",permalink:"/docs/azure/resources/Storage/Table",tags:[],version:"current",frontMatter:{id:"Table",title:"Table"},sidebar:"docs",previous:{title:"StorageAccount",permalink:"/docs/azure/resources/Storage/StorageAccount"},next:{title:"TableService",permalink:"/docs/azure/resources/Storage/TableService"}},u=[{value:"Examples",id:"examples",children:[{value:"TableOperationPut",id:"tableoperationput",children:[],level:3},{value:"TableOperationPutOrPatchAcls",id:"tableoperationputorpatchacls",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:u};function d(e){var r=e.components,n=(0,o.Z)(e,i);return(0,a.kt)("wrapper",(0,t.Z)({},l,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"Table")," from the ",(0,a.kt)("strong",{parentName:"p"},"Storage")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"tableoperationput"},"TableOperationPut"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Table",\n    group: "Storage",\n    name: "myTable",\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,a.kt)("h3",{id:"tableoperationputorpatchacls"},"TableOperationPutOrPatchAcls"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Table",\n    group: "Storage",\n    name: "myTable",\n    properties: () => ({\n      properties: {\n        signedIdentifiers: [\n          {\n            id: "MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI",\n            accessPolicy: {\n              startTime: "2022-03-17T08:49:37.0000000Z",\n              expiryTime: "2022-03-20T08:49:37.0000000Z",\n              permission: "raud",\n            },\n          },\n          {\n            id: "PTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODklMTI",\n            accessPolicy: {\n              startTime: "2022-03-17T08:49:37.0000000Z",\n              expiryTime: "2022-03-20T08:49:37.0000000Z",\n              permission: "rad",\n            },\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Storage/StorageAccount"},"StorageAccount"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      'x-ms-client-name': 'TableProperties',\n      description: 'Table resource properties.',\n      properties: {\n        tableName: {\n          type: 'string',\n          readOnly: true,\n          description: 'Table name under the specified account'\n        },\n        signedIdentifiers: {\n          type: 'array',\n          items: {\n            properties: {\n              id: {\n                type: 'string',\n                description: 'unique-64-character-value of the stored access policy.'\n              },\n              accessPolicy: {\n                description: 'Access policy',\n                properties: {\n                  startTime: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'Start time of the access policy'\n                  },\n                  expiryTime: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'Expiry time of the access policy'\n                  },\n                  permission: {\n                    type: 'string',\n                    description: \"Required. List of abbreviated permissions. Supported permission values include 'r','a','u','d'\"\n                  }\n                },\n                required: [ 'permission' ],\n                type: 'object'\n              }\n            },\n            required: [ 'id' ],\n            type: 'object',\n            description: 'Object to set Table Access Policy.'\n          },\n          description: 'List of stored access policies specified on the table.'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      title: 'Resource',\n      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n      type: 'object',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the resource'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Properties of the table, including Id, resource name, resource type.'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2021-09-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-09-01/table.json"},"here"),"."))}d.isMDXComponent=!0}}]);