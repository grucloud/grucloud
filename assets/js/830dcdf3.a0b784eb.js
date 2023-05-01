"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[36201],{3905:(e,r,n)=>{n.d(r,{Zo:()=>l,kt:()=>b});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function i(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function c(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?i(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function a(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=t.createContext({}),s=function(e){var r=t.useContext(p),n=r;return e&&(n="function"==typeof e?e(r):c(c({},r),e)),n},l=function(e){var r=s(e.components);return t.createElement(p.Provider,{value:r},e.children)},u="mdxType",y={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),u=s(n),d=o,b=u["".concat(p,".").concat(d)]||u[d]||y[d]||i;return n?t.createElement(b,c(c({ref:r},l),{},{components:n})):t.createElement(b,c({ref:r},l))}));function b(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=n.length,c=new Array(i);c[0]=d;var a={};for(var p in r)hasOwnProperty.call(r,p)&&(a[p]=r[p]);a.originalType=e,a[u]="string"==typeof e?e:o,c[1]=a;for(var s=2;s<i;s++)c[s]=n[s];return t.createElement.apply(null,c)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},65845:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>p,contentTitle:()=>c,default:()=>y,frontMatter:()=>i,metadata:()=>a,toc:()=>s});var t=n(87462),o=(n(67294),n(3905));const i={id:"WebAppRelayServiceConnection",title:"WebAppRelayServiceConnection"},c=void 0,a={unversionedId:"azure/resources/Web/WebAppRelayServiceConnection",id:"azure/resources/Web/WebAppRelayServiceConnection",title:"WebAppRelayServiceConnection",description:"Provides a WebAppRelayServiceConnection from the Web group",source:"@site/docs/azure/resources/Web/WebAppRelayServiceConnection.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppRelayServiceConnection",permalink:"/docs/azure/resources/Web/WebAppRelayServiceConnection",draft:!1,tags:[],version:"current",frontMatter:{id:"WebAppRelayServiceConnection",title:"WebAppRelayServiceConnection"},sidebar:"docs",previous:{title:"WebAppPublicCertificateSlot",permalink:"/docs/azure/resources/Web/WebAppPublicCertificateSlot"},next:{title:"WebAppRelayServiceConnectionSlot",permalink:"/docs/azure/resources/Web/WebAppRelayServiceConnectionSlot"}},p={},s=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:s},u="wrapper";function y(e){let{components:r,...n}=e;return(0,o.kt)(u,(0,t.Z)({},l,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"WebAppRelayServiceConnection")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebApp"},"WebApp"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Hybrid Connection for an App Service app.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'RelayServiceConnectionEntity resource specific properties',\n      type: 'object',\n      properties: {\n        entityName: { type: 'string' },\n        entityConnectionString: { type: 'string' },\n        resourceType: { type: 'string' },\n        resourceConnectionString: { type: 'string' },\n        hostname: { type: 'string' },\n        port: { format: 'int32', type: 'integer' },\n        biztalkUri: { type: 'string' }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json"},"here"),"."))}y.isMDXComponent=!0}}]);