"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[34797],{3905:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return y}});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function p(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):p(p({},t),e)),r},l=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),d=c(r),y=o,m=d["".concat(s,".").concat(y)]||d[y]||u[y]||i;return r?n.createElement(m,p(p({ref:t},l),{},{components:r})):n.createElement(m,p({ref:t},l))}));function y(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,p=new Array(i);p[0]=d;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,p[1]=a;for(var c=2;c<i;c++)p[c]=r[c];return n.createElement.apply(null,p)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},95747:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return a},contentTitle:function(){return s},metadata:function(){return c},toc:function(){return l},default:function(){return d}});var n=r(87462),o=r(63366),i=(r(67294),r(3905)),p=["components"],a={id:"WebAppMSDeployStatusSlot",title:"WebAppMSDeployStatusSlot"},s=void 0,c={unversionedId:"azure/resources/Web/WebAppMSDeployStatusSlot",id:"azure/resources/Web/WebAppMSDeployStatusSlot",isDocsHomePage:!1,title:"WebAppMSDeployStatusSlot",description:"Provides a WebAppMSDeployStatusSlot from the Web group",source:"@site/docs/azure/resources/Web/WebAppMSDeployStatusSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppMSDeployStatusSlot",permalink:"/docs/azure/resources/Web/WebAppMSDeployStatusSlot",tags:[],version:"current",frontMatter:{id:"WebAppMSDeployStatusSlot",title:"WebAppMSDeployStatusSlot"},sidebar:"docs",previous:{title:"WebAppMSDeployStatus",permalink:"/docs/azure/resources/Web/WebAppMSDeployStatus"},next:{title:"WebAppPremierAddOn",permalink:"/docs/azure/resources/Web/WebAppPremierAddOn"}},l=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:l};function d(e){var t=e.components,r=(0,o.Z)(e,p);return(0,i.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"WebAppMSDeployStatusSlot")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebApp"},"WebApp")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebAppSlot"},"WebAppSlot"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'MSDeploy ARM PUT information',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Core resource properties',\n      type: 'object',\n      properties: {\n        addOnPackages: {\n          description: 'List of Add-On packages. Add-On packages implicitly enable the Do Not Delete MSDeploy rule.',\n          type: 'array',\n          items: {\n            description: 'MSDeploy ARM PUT core information',\n            type: 'object',\n            properties: {\n              packageUri: { description: 'Package URI', type: 'string' },\n              connectionString: { description: 'SQL Connection String', type: 'string' },\n              dbType: { description: 'Database Type', type: 'string' },\n              setParametersXmlFileUri: {\n                description: 'URI of MSDeploy Parameters file. Must not be set if SetParameters is used.',\n                type: 'string'\n              },\n              setParameters: {\n                description: 'MSDeploy Parameters. Must not be set if SetParametersXmlFileUri is used.',\n                type: 'object',\n                additionalProperties: { type: 'string' }\n              },\n              skipAppData: {\n                description: 'Controls whether the MSDeploy operation skips the App_Data directory.\\n' +\n                  'If set to <code>true</code>, the existing App_Data directory on the destination\\n' +\n                  'will not be deleted, and any App_Data directory in the source will be ignored.\\n' +\n                  'Setting is <code>false</code> by default.',\n                type: 'boolean'\n              },\n              appOffline: {\n                description: 'Sets the AppOffline rule while the MSDeploy operation executes.\\n' +\n                  'Setting is <code>false</code> by default.',\n                type: 'boolean'\n              }\n            }\n          },\n          'x-ms-identifiers': [ 'packageUri' ]\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json"},"here"),"."))}d.isMDXComponent=!0}}]);