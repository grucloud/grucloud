"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[63566],{3905:(e,n,r)=>{r.d(n,{Zo:()=>l,kt:()=>d});var t=r(67294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function p(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=t.createContext({}),c=function(e){var n=t.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):p(p({},n),e)),r},l=function(e){var n=c(e.components);return t.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),m=c(r),d=i,f=m["".concat(s,".").concat(d)]||m[d]||u[d]||o;return r?t.createElement(f,p(p({ref:n},l),{},{components:r})):t.createElement(f,p({ref:n},l))}));function d(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=r.length,p=new Array(o);p[0]=m;var a={};for(var s in n)hasOwnProperty.call(n,s)&&(a[s]=n[s]);a.originalType=e,a.mdxType="string"==typeof e?e:i,p[1]=a;for(var c=2;c<o;c++)p[c]=r[c];return t.createElement.apply(null,p)}return t.createElement.apply(null,r)}m.displayName="MDXCreateElement"},5277:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>s,contentTitle:()=>p,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var t=r(87462),i=(r(67294),r(3905));const o={id:"AppServiceEnvironmentWorkerPool",title:"AppServiceEnvironmentWorkerPool"},p=void 0,a={unversionedId:"azure/resources/Web/AppServiceEnvironmentWorkerPool",id:"azure/resources/Web/AppServiceEnvironmentWorkerPool",title:"AppServiceEnvironmentWorkerPool",description:"Provides a AppServiceEnvironmentWorkerPool from the Web group",source:"@site/docs/azure/resources/Web/AppServiceEnvironmentWorkerPool.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/AppServiceEnvironmentWorkerPool",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentWorkerPool",draft:!1,tags:[],version:"current",frontMatter:{id:"AppServiceEnvironmentWorkerPool",title:"AppServiceEnvironmentWorkerPool"},sidebar:"docs",previous:{title:"AppServiceEnvironmentPrivateEndpointConnection",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentPrivateEndpointConnection"},next:{title:"AppServicePlan",permalink:"/docs/azure/resources/Web/AppServicePlan"}},s={},c=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:c};function u(e){let{components:n,...r}=e;return(0,i.kt)("wrapper",(0,t.Z)({},l,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"AppServiceEnvironmentWorkerPool")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/AppServiceEnvironment"},"AppServiceEnvironment"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Worker pool of an App Service Environment ARM resource.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Core resource properties',\n      'x-ms-client-flatten': true,\n      type: 'object',\n      properties: {\n        workerSizeId: {\n          format: 'int32',\n          description: 'Worker size ID for referencing this worker pool.',\n          type: 'integer'\n        },\n        computeMode: {\n          description: 'Shared or dedicated app hosting.',\n          enum: [ 'Shared', 'Dedicated', 'Dynamic' ],\n          type: 'string',\n          'x-ms-enum': { name: 'ComputeModeOptions', modelAsString: false }\n        },\n        workerSize: {\n          description: 'VM size of the worker pool instances.',\n          type: 'string'\n        },\n        workerCount: {\n          format: 'int32',\n          description: 'Number of instances in the worker pool.',\n          type: 'integer'\n        },\n        instanceNames: {\n          description: 'Names of all instances in the worker pool (read only).',\n          type: 'array',\n          items: { type: 'string' },\n          readOnly: true\n        }\n      }\n    },\n    sku: {\n      description: 'Description of a SKU for a scalable resource.',\n      type: 'object',\n      properties: {\n        name: { description: 'Name of the resource SKU.', type: 'string' },\n        tier: {\n          description: 'Service tier of the resource SKU.',\n          type: 'string'\n        },\n        size: {\n          description: 'Size specifier of the resource SKU.',\n          type: 'string'\n        },\n        family: {\n          description: 'Family code of the resource SKU.',\n          type: 'string'\n        },\n        capacity: {\n          format: 'int32',\n          description: 'Current number of instances assigned to the resource.',\n          type: 'integer'\n        },\n        skuCapacity: {\n          description: 'Min, max, and default scale values of the SKU.',\n          type: 'object',\n          properties: {\n            minimum: {\n              format: 'int32',\n              description: 'Minimum number of workers for this App Service plan SKU.',\n              type: 'integer'\n            },\n            maximum: {\n              format: 'int32',\n              description: 'Maximum number of workers for this App Service plan SKU.',\n              type: 'integer'\n            },\n            elasticMaximum: {\n              format: 'int32',\n              description: 'Maximum number of Elastic workers for this App Service plan SKU.',\n              type: 'integer'\n            },\n            default: {\n              format: 'int32',\n              description: 'Default number of workers for this App Service plan SKU.',\n              type: 'integer'\n            },\n            scaleType: {\n              description: 'Available scale configurations for an App Service plan.',\n              type: 'string'\n            }\n          }\n        },\n        locations: {\n          description: 'Locations of the SKU.',\n          type: 'array',\n          items: { type: 'string' }\n        },\n        capabilities: {\n          description: 'Capabilities of the SKU, e.g., is traffic manager enabled?',\n          type: 'array',\n          items: {\n            description: 'Describes the capabilities/features allowed for a specific SKU.',\n            type: 'object',\n            properties: {\n              name: {\n                description: 'Name of the SKU capability.',\n                type: 'string'\n              },\n              value: {\n                description: 'Value of the SKU capability.',\n                type: 'string'\n              },\n              reason: {\n                description: 'Reason of the SKU capability.',\n                type: 'string'\n              }\n            }\n          },\n          'x-ms-identifiers': [ 'name' ]\n        }\n      }\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/AppServiceEnvironments.json"},"here"),"."))}u.isMDXComponent=!0}}]);