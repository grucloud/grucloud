"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[52431],{3905:(e,r,t)=>{t.d(r,{Zo:()=>d,kt:()=>m});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function p(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=n.createContext({}),c=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):p(p({},r),e)),t},d=function(e){var r=c(e.components);return n.createElement(s.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},u=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,d=a(e,["components","mdxType","originalType","parentName"]),u=c(t),m=o,b=u["".concat(s,".").concat(m)]||u[m]||l[m]||i;return t?n.createElement(b,p(p({ref:r},d),{},{components:t})):n.createElement(b,p({ref:r},d))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=t.length,p=new Array(i);p[0]=u;var a={};for(var s in r)hasOwnProperty.call(r,s)&&(a[s]=r[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,p[1]=a;for(var c=2;c<i;c++)p[c]=t[c];return n.createElement.apply(null,p)}return n.createElement.apply(null,t)}u.displayName="MDXCreateElement"},27867:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>s,contentTitle:()=>p,default:()=>l,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var n=t(87462),o=(t(67294),t(3905));const i={id:"WebAppPremierAddOnSlot",title:"WebAppPremierAddOnSlot"},p=void 0,a={unversionedId:"azure/resources/Web/WebAppPremierAddOnSlot",id:"azure/resources/Web/WebAppPremierAddOnSlot",title:"WebAppPremierAddOnSlot",description:"Provides a WebAppPremierAddOnSlot from the Web group",source:"@site/docs/azure/resources/Web/WebAppPremierAddOnSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppPremierAddOnSlot",permalink:"/docs/azure/resources/Web/WebAppPremierAddOnSlot",draft:!1,tags:[],version:"current",frontMatter:{id:"WebAppPremierAddOnSlot",title:"WebAppPremierAddOnSlot"},sidebar:"docs",previous:{title:"WebAppPremierAddOn",permalink:"/docs/azure/resources/Web/WebAppPremierAddOn"},next:{title:"WebAppPrivateAccess",permalink:"/docs/azure/resources/Web/WebAppPrivateAccess"}},s={},c=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],d={toc:c};function l(e){let{components:r,...t}=e;return(0,o.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"WebAppPremierAddOnSlot")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebApp"},"WebApp")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebAppSlot"},"WebAppSlot"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Premier add-on.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure resource. This resource is tracked in Azure Resource Manager',\n      required: [ 'location' ],\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        location: { description: 'Resource Location.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        },\n        tags: {\n          description: 'Resource tags.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'PremierAddOn resource specific properties',\n      type: 'object',\n      properties: {\n        sku: { description: 'Premier add on SKU.', type: 'string' },\n        product: { description: 'Premier add on Product.', type: 'string' },\n        vendor: { description: 'Premier add on Vendor.', type: 'string' },\n        marketplacePublisher: {\n          description: 'Premier add on Marketplace publisher.',\n          type: 'string'\n        },\n        marketplaceOffer: {\n          description: 'Premier add on Marketplace offer.',\n          type: 'string'\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json"},"here"),"."))}l.isMDXComponent=!0}}]);