"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[73354],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},l=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),l=s(n),m=i,v=l["".concat(p,".").concat(m)]||l[m]||d[m]||o;return n?r.createElement(v,a(a({ref:t},u),{},{components:n})):r.createElement(v,a({ref:t},u))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=l;var c={};for(var p in t)hasOwnProperty.call(t,p)&&(c[p]=t[p]);c.originalType=e,c.mdxType="string"==typeof e?e:i,a[1]=c;for(var s=2;s<o;s++)a[s]=n[s];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}l.displayName="MDXCreateElement"},19952:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>c,toc:()=>s});var r=n(87462),i=(n(67294),n(3905));const o={id:"StaticSitePrivateEndpointConnection",title:"StaticSitePrivateEndpointConnection"},a=void 0,c={unversionedId:"azure/resources/Web/StaticSitePrivateEndpointConnection",id:"azure/resources/Web/StaticSitePrivateEndpointConnection",title:"StaticSitePrivateEndpointConnection",description:"Provides a StaticSitePrivateEndpointConnection from the Web group",source:"@site/docs/azure/resources/Web/StaticSitePrivateEndpointConnection.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/StaticSitePrivateEndpointConnection",permalink:"/docs/azure/resources/Web/StaticSitePrivateEndpointConnection",draft:!1,tags:[],version:"current",frontMatter:{id:"StaticSitePrivateEndpointConnection",title:"StaticSitePrivateEndpointConnection"},sidebar:"docs",previous:{title:"StaticSiteLinkedBackendForBuild",permalink:"/docs/azure/resources/Web/StaticSiteLinkedBackendForBuild"},next:{title:"UserProvidedFunctionAppForStaticSite",permalink:"/docs/azure/resources/Web/UserProvidedFunctionAppForStaticSite"}},p={},s=[{value:"Examples",id:"examples",level:2},{value:"Approves or rejects a private endpoint connection for a site.",id:"approves-or-rejects-a-private-endpoint-connection-for-a-site",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:s};function d(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"StaticSitePrivateEndpointConnection")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"approves-or-rejects-a-private-endpoint-connection-for-a-site"},"Approves or rejects a private endpoint connection for a site."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "StaticSitePrivateEndpointConnection",\n    group: "Web",\n    name: "myStaticSitePrivateEndpointConnection",\n    properties: () => ({\n      properties: {\n        privateLinkServiceConnectionState: {\n          status: "Approved",\n          description: "Approved by admin.",\n          actionsRequired: "",\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      name: "myStaticSite",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/StaticSite"},"StaticSite"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Private Endpoint Connection Approval ARM resource.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Core resource properties',\n      type: 'object',\n      'x-ms-client-flatten': true,\n      properties: {\n        privateLinkServiceConnectionState: {\n          description: 'The state of a private link connection',\n          type: 'object',\n          properties: {\n            status: {\n              description: 'Status of a private link connection',\n              type: 'string'\n            },\n            description: {\n              description: 'Description of a private link connection',\n              type: 'string'\n            },\n            actionsRequired: {\n              description: 'ActionsRequired for a private link connection',\n              type: 'string'\n            }\n          }\n        }\n      }\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/StaticSites.json"},"here"),"."))}d.isMDXComponent=!0}}]);