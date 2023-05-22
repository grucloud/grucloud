"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[82428],{3905:(e,n,t)=>{t.d(n,{Zo:()=>l,kt:()=>m});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function p(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=r.createContext({}),s=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):p(p({},n),e)),t},l=function(e){var n=s(e.components);return r.createElement(c.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},b=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),u=s(t),b=o,m=u["".concat(c,".").concat(b)]||u[b]||d[b]||i;return t?r.createElement(m,p(p({ref:n},l),{},{components:t})):r.createElement(m,p({ref:n},l))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,p=new Array(i);p[0]=b;var a={};for(var c in n)hasOwnProperty.call(n,c)&&(a[c]=n[c]);a.originalType=e,a[u]="string"==typeof e?e:o,p[1]=a;for(var s=2;s<i;s++)p[s]=t[s];return r.createElement.apply(null,p)}return r.createElement.apply(null,t)}b.displayName="MDXCreateElement"},72471:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>p,default:()=>d,frontMatter:()=>i,metadata:()=>a,toc:()=>s});var r=t(87462),o=(t(67294),t(3905));const i={id:"WebAppPrivateEndpointConnectionSlot",title:"WebAppPrivateEndpointConnectionSlot"},p=void 0,a={unversionedId:"azure/resources/Web/WebAppPrivateEndpointConnectionSlot",id:"azure/resources/Web/WebAppPrivateEndpointConnectionSlot",title:"WebAppPrivateEndpointConnectionSlot",description:"Provides a WebAppPrivateEndpointConnectionSlot from the Web group",source:"@site/docs/azure/resources/Web/WebAppPrivateEndpointConnectionSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppPrivateEndpointConnectionSlot",permalink:"/docs/azure/resources/Web/WebAppPrivateEndpointConnectionSlot",draft:!1,tags:[],version:"current",frontMatter:{id:"WebAppPrivateEndpointConnectionSlot",title:"WebAppPrivateEndpointConnectionSlot"},sidebar:"docs",previous:{title:"WebAppPrivateEndpointConnection",permalink:"/docs/azure/resources/Web/WebAppPrivateEndpointConnection"},next:{title:"WebAppProcessSlot",permalink:"/docs/azure/resources/Web/WebAppProcessSlot"}},c={},s=[{value:"Examples",id:"examples",level:2},{value:"Approves or rejects a private endpoint connection for a site.",id:"approves-or-rejects-a-private-endpoint-connection-for-a-site",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:s},u="wrapper";function d(e){let{components:n,...t}=e;return(0,o.kt)(u,(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"WebAppPrivateEndpointConnectionSlot")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"approves-or-rejects-a-private-endpoint-connection-for-a-site"},"Approves or rejects a private endpoint connection for a site."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "WebAppPrivateEndpointConnectionSlot",\n    group: "Web",\n    name: "myWebAppPrivateEndpointConnectionSlot",\n    properties: () => ({\n      properties: {\n        privateLinkServiceConnectionState: {\n          status: "Approved",\n          description: "Approved by admin.",\n          actionsRequired: "",\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      name: "myWebApp",\n      slot: "myWebAppSlot",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebApp"},"WebApp")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebAppSlot"},"WebAppSlot"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Private Endpoint Connection Approval ARM resource.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Core resource properties',\n      type: 'object',\n      'x-ms-client-flatten': true,\n      properties: {\n        privateLinkServiceConnectionState: {\n          description: 'The state of a private link connection',\n          type: 'object',\n          properties: {\n            status: {\n              description: 'Status of a private link connection',\n              type: 'string'\n            },\n            description: {\n              description: 'Description of a private link connection',\n              type: 'string'\n            },\n            actionsRequired: {\n              description: 'ActionsRequired for a private link connection',\n              type: 'string'\n            }\n          }\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json"},"here"),"."))}d.isMDXComponent=!0}}]);