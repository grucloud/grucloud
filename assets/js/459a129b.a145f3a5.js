"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[81625],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return d}});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=r.createContext({}),l=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},c=function(e){var n=l(e.components);return r.createElement(p.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},g=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),g=l(t),d=o,f=g["".concat(p,".").concat(d)]||g[d]||u[d]||i;return t?r.createElement(f,s(s({ref:n},c),{},{components:t})):r.createElement(f,s({ref:n},c))}));function d(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,s=new Array(i);s[0]=g;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:o,s[1]=a;for(var l=2;l<i;l++)s[l]=t[l];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}g.displayName="MDXCreateElement"},76933:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return l},toc:function(){return c},default:function(){return g}});var r=t(87462),o=t(63366),i=(t(67294),t(3905)),s=["components"],a={id:"WebAppDiagnosticLogsConfigurationSlot",title:"WebAppDiagnosticLogsConfigurationSlot"},p=void 0,l={unversionedId:"azure/resources/Web/WebAppDiagnosticLogsConfigurationSlot",id:"azure/resources/Web/WebAppDiagnosticLogsConfigurationSlot",isDocsHomePage:!1,title:"WebAppDiagnosticLogsConfigurationSlot",description:"Provides a WebAppDiagnosticLogsConfigurationSlot from the Web group",source:"@site/docs/azure/resources/Web/WebAppDiagnosticLogsConfigurationSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppDiagnosticLogsConfigurationSlot",permalink:"/docs/azure/resources/Web/WebAppDiagnosticLogsConfigurationSlot",tags:[],version:"current",frontMatter:{id:"WebAppDiagnosticLogsConfigurationSlot",title:"WebAppDiagnosticLogsConfigurationSlot"},sidebar:"docs",previous:{title:"WebAppDiagnosticLogsConfiguration",permalink:"/docs/azure/resources/Web/WebAppDiagnosticLogsConfiguration"},next:{title:"WebAppDomainOwnershipIdentifier",permalink:"/docs/azure/resources/Web/WebAppDomainOwnershipIdentifier"}},c=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:c};function g(e){var n=e.components,t=(0,o.Z)(e,s);return(0,i.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"WebAppDiagnosticLogsConfigurationSlot")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/SiteSlot"},"SiteSlot"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Configuration of App Service site logs.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'SiteLogsConfig resource specific properties',\n      type: 'object',\n      properties: {\n        applicationLogs: {\n          description: 'Application logs configuration.',\n          type: 'object',\n          properties: {\n            fileSystem: {\n              description: 'Application logs to file system configuration.',\n              type: 'object',\n              properties: {\n                level: {\n                  description: 'Log level.',\n                  default: 'Off',\n                  enum: [\n                    'Off',\n                    'Verbose',\n                    'Information',\n                    'Warning',\n                    'Error'\n                  ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'LogLevel', modelAsString: false }\n                }\n              }\n            },\n            azureTableStorage: {\n              description: 'Application logs to azure table storage configuration.',\n              required: [ 'sasUrl' ],\n              type: 'object',\n              properties: {\n                level: {\n                  description: 'Log level.',\n                  enum: [\n                    'Off',\n                    'Verbose',\n                    'Information',\n                    'Warning',\n                    'Error'\n                  ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'LogLevel', modelAsString: false }\n                },\n                sasUrl: {\n                  description: 'SAS URL to an Azure table with add/query/delete permissions.',\n                  type: 'string'\n                }\n              }\n            },\n            azureBlobStorage: {\n              description: 'Application logs to blob storage configuration.',\n              type: 'object',\n              properties: {\n                level: {\n                  description: 'Log level.',\n                  enum: [\n                    'Off',\n                    'Verbose',\n                    'Information',\n                    'Warning',\n                    'Error'\n                  ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'LogLevel', modelAsString: false }\n                },\n                sasUrl: {\n                  description: 'SAS url to a azure blob container with read/write/list/delete permissions.',\n                  type: 'string'\n                },\n                retentionInDays: {\n                  format: 'int32',\n                  description: 'Retention in days.\\n' +\n                    'Remove blobs older than X days.\\n' +\n                    '0 or lower means no retention.',\n                  type: 'integer'\n                }\n              }\n            }\n          }\n        },\n        httpLogs: {\n          description: 'HTTP logs configuration.',\n          type: 'object',\n          properties: {\n            fileSystem: {\n              description: 'Http logs to file system configuration.',\n              type: 'object',\n              properties: {\n                retentionInMb: {\n                  format: 'int32',\n                  description: 'Maximum size in megabytes that http log files can use.\\n' +\n                    'When reached old log files will be removed to make space for new ones.\\n' +\n                    'Value can range between 25 and 100.',\n                  maximum: 100,\n                  minimum: 25,\n                  type: 'integer'\n                },\n                retentionInDays: {\n                  format: 'int32',\n                  description: 'Retention in days.\\n' +\n                    'Remove files older than X days.\\n' +\n                    '0 or lower means no retention.',\n                  type: 'integer'\n                },\n                enabled: {\n                  description: 'True if configuration is enabled, false if it is disabled and null if configuration is not set.',\n                  type: 'boolean'\n                }\n              }\n            },\n            azureBlobStorage: {\n              description: 'Http logs to azure blob storage configuration.',\n              type: 'object',\n              properties: {\n                sasUrl: {\n                  description: 'SAS url to a azure blob container with read/write/list/delete permissions.',\n                  type: 'string'\n                },\n                retentionInDays: {\n                  format: 'int32',\n                  description: 'Retention in days.\\n' +\n                    'Remove blobs older than X days.\\n' +\n                    '0 or lower means no retention.',\n                  type: 'integer'\n                },\n                enabled: {\n                  description: 'True if configuration is enabled, false if it is disabled and null if configuration is not set.',\n                  type: 'boolean'\n                }\n              }\n            }\n          }\n        },\n        failedRequestsTracing: {\n          description: 'Failed requests tracing configuration.',\n          type: 'object',\n          properties: {\n            enabled: {\n              description: 'True if configuration is enabled, false if it is disabled and null if configuration is not set.',\n              type: 'boolean'\n            }\n          }\n        },\n        detailedErrorMessages: {\n          description: 'Detailed error messages configuration.',\n          type: 'object',\n          properties: {\n            enabled: {\n              description: 'True if configuration is enabled, false if it is disabled and null if configuration is not set.',\n              type: 'boolean'\n            }\n          }\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json"},"here"),"."))}g.isMDXComponent=!0}}]);