"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2431],{3905:function(e,r,n){n.d(r,{Zo:function(){return u},kt:function(){return m}});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function i(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function a(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?i(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function p(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=t.createContext({}),s=function(e){var r=t.useContext(c),n=r;return e&&(n="function"==typeof e?e(r):a(a({},r),e)),n},u=function(e){var r=s(e.components);return t.createElement(c.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},l=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),l=s(n),m=o,f=l["".concat(c,".").concat(m)]||l[m]||d[m]||i;return n?t.createElement(f,a(a({ref:r},u),{},{components:n})):t.createElement(f,a({ref:r},u))}));function m(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=l;var p={};for(var c in r)hasOwnProperty.call(r,c)&&(p[c]=r[c]);p.originalType=e,p.mdxType="string"==typeof e?e:o,a[1]=p;for(var s=2;s<i;s++)a[s]=n[s];return t.createElement.apply(null,a)}return t.createElement.apply(null,n)}l.displayName="MDXCreateElement"},27867:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return p},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return u},default:function(){return l}});var t=n(87462),o=n(63366),i=(n(67294),n(3905)),a=["components"],p={id:"WebAppPremierAddOnSlot",title:"WebAppPremierAddOnSlot"},c=void 0,s={unversionedId:"azure/resources/Web/WebAppPremierAddOnSlot",id:"azure/resources/Web/WebAppPremierAddOnSlot",isDocsHomePage:!1,title:"WebAppPremierAddOnSlot",description:"Provides a WebAppPremierAddOnSlot from the Web group",source:"@site/docs/azure/resources/Web/WebAppPremierAddOnSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppPremierAddOnSlot",permalink:"/docs/azure/resources/Web/WebAppPremierAddOnSlot",tags:[],version:"current",frontMatter:{id:"WebAppPremierAddOnSlot",title:"WebAppPremierAddOnSlot"},sidebar:"docs",previous:{title:"WebAppPremierAddOn",permalink:"/docs/azure/resources/Web/WebAppPremierAddOn"},next:{title:"WebAppPrivateAccess",permalink:"/docs/azure/resources/Web/WebAppPrivateAccess"}},u=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],d={toc:u};function l(e){var r=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,t.Z)({},d,n,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"WebAppPremierAddOnSlot")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/SiteSlot"},"SiteSlot"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Premier add-on.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure resource. This resource is tracked in Azure Resource Manager',\n      required: [ 'location' ],\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        location: { description: 'Resource Location.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        },\n        tags: {\n          description: 'Resource tags.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'PremierAddOn resource specific properties',\n      type: 'object',\n      properties: {\n        sku: { description: 'Premier add on SKU.', type: 'string' },\n        product: { description: 'Premier add on Product.', type: 'string' },\n        vendor: { description: 'Premier add on Vendor.', type: 'string' },\n        marketplacePublisher: {\n          description: 'Premier add on Marketplace publisher.',\n          type: 'string'\n        },\n        marketplaceOffer: {\n          description: 'Premier add on Marketplace offer.',\n          type: 'string'\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json"},"here"),"."))}l.isMDXComponent=!0}}]);