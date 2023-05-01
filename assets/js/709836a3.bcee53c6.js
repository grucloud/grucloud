"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[92151],{3905:(e,t,r)=>{r.d(t,{Zo:()=>l,kt:()=>y});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function p(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?p(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):p(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},p=Object.keys(e);for(n=0;n<p.length;n++)r=p[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var p=Object.getOwnPropertySymbols(e);for(n=0;n<p.length;n++)r=p[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var a=n.createContext({}),c=function(e){var t=n.useContext(a),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},l=function(e){var t=c(e.components);return n.createElement(a.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,p=e.originalType,a=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),u=c(r),d=o,y=u["".concat(a,".").concat(d)]||u[d]||m[d]||p;return r?n.createElement(y,i(i({ref:t},l),{},{components:r})):n.createElement(y,i({ref:t},l))}));function y(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var p=r.length,i=new Array(p);i[0]=d;var s={};for(var a in t)hasOwnProperty.call(t,a)&&(s[a]=t[a]);s.originalType=e,s[u]="string"==typeof e?e:o,i[1]=s;for(var c=2;c<p;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},42584:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>a,contentTitle:()=>i,default:()=>m,frontMatter:()=>p,metadata:()=>s,toc:()=>c});var n=r(87462),o=(r(67294),r(3905));const p={id:"WebAppDeployment",title:"WebAppDeployment"},i=void 0,s={unversionedId:"azure/resources/Web/WebAppDeployment",id:"azure/resources/Web/WebAppDeployment",title:"WebAppDeployment",description:"Provides a WebAppDeployment from the Web group",source:"@site/docs/azure/resources/Web/WebAppDeployment.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppDeployment",permalink:"/docs/azure/resources/Web/WebAppDeployment",draft:!1,tags:[],version:"current",frontMatter:{id:"WebAppDeployment",title:"WebAppDeployment"},sidebar:"docs",previous:{title:"WebAppContinuousWebJobSlot",permalink:"/docs/azure/resources/Web/WebAppContinuousWebJobSlot"},next:{title:"WebAppDeploymentSlot",permalink:"/docs/azure/resources/Web/WebAppDeploymentSlot"}},a={},c=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:c},u="wrapper";function m(e){let{components:t,...r}=e;return(0,o.kt)(u,(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"WebAppDeployment")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebApp"},"WebApp"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'User credentials used for publishing activity.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Deployment resource specific properties',\n      type: 'object',\n      properties: {\n        status: {\n          format: 'int32',\n          description: 'Deployment status.',\n          type: 'integer'\n        },\n        message: {\n          description: 'Details about deployment status.',\n          type: 'string'\n        },\n        author: { description: 'Who authored the deployment.', type: 'string' },\n        deployer: {\n          description: 'Who performed the deployment.',\n          type: 'string'\n        },\n        author_email: { description: 'Author email.', type: 'string' },\n        start_time: {\n          format: 'date-time',\n          description: 'Start time.',\n          type: 'string'\n        },\n        end_time: {\n          format: 'date-time',\n          description: 'End time.',\n          type: 'string'\n        },\n        active: {\n          description: 'True if deployment is currently active, false if completed and null if not started.',\n          type: 'boolean'\n        },\n        details: { description: 'Details on deployment.', type: 'string' }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json"},"here"),"."))}m.isMDXComponent=!0}}]);