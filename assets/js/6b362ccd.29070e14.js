"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[68737],{3905:(e,r,n)=>{n.d(r,{Zo:()=>u,kt:()=>m});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function i(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function a(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?i(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function s(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=t.createContext({}),c=function(e){var r=t.useContext(p),n=r;return e&&(n="function"==typeof e?e(r):a(a({},r),e)),n},u=function(e){var r=c(e.components);return t.createElement(p.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(n),m=o,v=d["".concat(p,".").concat(m)]||d[m]||l[m]||i;return n?t.createElement(v,a(a({ref:r},u),{},{components:n})):t.createElement(v,a({ref:r},u))}));function m(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=d;var s={};for(var p in r)hasOwnProperty.call(r,p)&&(s[p]=r[p]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=n[c];return t.createElement.apply(null,a)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},96260:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>p,contentTitle:()=>a,default:()=>l,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var t=n(87462),o=(n(67294),n(3905));const i={id:"AppServiceEnvironmentAseV3NetworkingConfiguration",title:"AppServiceEnvironmentAseV3NetworkingConfiguration"},a=void 0,s={unversionedId:"azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration",id:"azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration",title:"AppServiceEnvironmentAseV3NetworkingConfiguration",description:"Provides a AppServiceEnvironmentAseV3NetworkingConfiguration from the Web group",source:"@site/docs/azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration",draft:!1,tags:[],version:"current",frontMatter:{id:"AppServiceEnvironmentAseV3NetworkingConfiguration",title:"AppServiceEnvironmentAseV3NetworkingConfiguration"},sidebar:"docs",previous:{title:"AppServiceEnvironment",permalink:"/docs/azure/resources/Web/AppServiceEnvironment"},next:{title:"AppServiceEnvironmentMultiRolePool",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentMultiRolePool"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c};function l(e){let{components:r,...n}=e;return(0,o.kt)("wrapper",(0,t.Z)({},u,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"AppServiceEnvironmentAseV3NetworkingConfiguration")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/AppServiceEnvironment"},"AppServiceEnvironment"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Full view of networking configuration for an ASE.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'AseV3NetworkingConfiguration resource specific properties',\n      type: 'object',\n      properties: {\n        windowsOutboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },\n        linuxOutboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },\n        externalInboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },\n        internalInboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },\n        allowNewPrivateEndpointConnections: {\n          description: 'Property to enable and disable new private endpoint connection creation on ASE',\n          type: 'boolean'\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/AppServiceEnvironments.json"},"here"),"."))}l.isMDXComponent=!0}}]);