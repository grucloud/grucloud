"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[38575],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>d});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function u(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var i=n.createContext({}),c=function(e){var r=n.useContext(i),t=r;return e&&(t="function"==typeof e?e(r):u(u({},r),e)),t},p=function(e){var r=c(e.components);return n.createElement(i.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,i=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),m=c(t),d=a,g=m["".concat(i,".").concat(d)]||m[d]||l[d]||o;return t?n.createElement(g,u(u({ref:r},p),{},{components:t})):n.createElement(g,u({ref:r},p))}));function d(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,u=new Array(o);u[0]=m;var s={};for(var i in r)hasOwnProperty.call(r,i)&&(s[i]=r[i]);s.originalType=e,s.mdxType="string"==typeof e?e:a,u[1]=s;for(var c=2;c<o;c++)u[c]=t[c];return n.createElement.apply(null,u)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},3915:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>i,contentTitle:()=>u,default:()=>l,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var n=t(87462),a=(t(67294),t(3905));const o={id:"Queue",title:"Queue"},u=void 0,s={unversionedId:"azure/resources/Storage/Queue",id:"azure/resources/Storage/Queue",title:"Queue",description:"Provides a Queue from the Storage group",source:"@site/docs/azure/resources/Storage/Queue.md",sourceDirName:"azure/resources/Storage",slug:"/azure/resources/Storage/Queue",permalink:"/docs/azure/resources/Storage/Queue",draft:!1,tags:[],version:"current",frontMatter:{id:"Queue",title:"Queue"},sidebar:"docs",previous:{title:"PrivateEndpointConnection",permalink:"/docs/azure/resources/Storage/PrivateEndpointConnection"},next:{title:"QueueService",permalink:"/docs/azure/resources/Storage/QueueService"}},i={},c=[{value:"Examples",id:"examples",level:2},{value:"QueueOperationPut",id:"queueoperationput",level:3},{value:"QueueOperationPutWithMetadata",id:"queueoperationputwithmetadata",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:c};function l(e){let{components:r,...t}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"Queue")," from the ",(0,a.kt)("strong",{parentName:"p"},"Storage")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"queueoperationput"},"QueueOperationPut"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Queue",\n    group: "Storage",\n    name: "myQueue",\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,a.kt)("h3",{id:"queueoperationputwithmetadata"},"QueueOperationPutWithMetadata"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Queue",\n    group: "Storage",\n    name: "myQueue",\n    properties: () => ({\n      properties: { metadata: { sample1: "meta1", sample2: "meta2" } },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Storage/StorageAccount"},"StorageAccount"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      'x-ms-client-name': 'QueueProperties',\n      description: 'Queue resource properties.',\n      properties: {\n        metadata: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'A name-value pair that represents queue metadata.'\n        },\n        approximateMessageCount: {\n          type: 'integer',\n          readOnly: true,\n          description: 'Integer indicating an approximate number of messages in the queue. This number is not lower than the actual number of messages in the queue, but could be higher.'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      title: 'Resource',\n      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n      type: 'object',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the resource'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ]\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2021-09-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-09-01/queue.json"},"here"),"."))}l.isMDXComponent=!0}}]);