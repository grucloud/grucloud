"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[34505],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(67294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=l(n),m=o,y=d["".concat(s,".").concat(m)]||d[m]||p[m]||i;return n?r.createElement(y,c(c({ref:t},u),{},{components:n})):r.createElement(y,c({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,c=new Array(i);c[0]=d;var a={};for(var s in t)hasOwnProperty.call(t,s)&&(a[s]=t[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,c[1]=a;for(var l=2;l<i;l++)c[l]=n[l];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},38037:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return u},default:function(){return d}});var r=n(87462),o=n(63366),i=(n(67294),n(3905)),c=["components"],a={id:"SiteRelayServiceConnectionSlot",title:"SiteRelayServiceConnectionSlot"},s=void 0,l={unversionedId:"azure/resources/Web/SiteRelayServiceConnectionSlot",id:"azure/resources/Web/SiteRelayServiceConnectionSlot",isDocsHomePage:!1,title:"SiteRelayServiceConnectionSlot",description:"Provides a SiteRelayServiceConnectionSlot from the Web group",source:"@site/docs/azure/resources/Web/SiteRelayServiceConnectionSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/SiteRelayServiceConnectionSlot",permalink:"/docs/azure/resources/Web/SiteRelayServiceConnectionSlot",tags:[],version:"current",frontMatter:{id:"SiteRelayServiceConnectionSlot",title:"SiteRelayServiceConnectionSlot"},sidebar:"docs",previous:{title:"SiteRelayServiceConnection",permalink:"/docs/azure/resources/Web/SiteRelayServiceConnection"},next:{title:"SiteSlot",permalink:"/docs/azure/resources/Web/SiteSlot"}},u=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:u};function d(e){var t=e.components,n=(0,o.Z)(e,c);return(0,i.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"SiteRelayServiceConnectionSlot")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/SiteSlot"},"SiteSlot"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Class that represents a BizTalk Hybrid Connection',\n  type: 'object',\n  allOf: [\n    {\n      required: [ 'location' ],\n      properties: {\n        id: { description: 'Resource Id', type: 'string' },\n        name: { description: 'Resource Name', type: 'string' },\n        kind: { description: 'Kind of resource', type: 'string' },\n        location: { description: 'Resource Location', type: 'string' },\n        type: { description: 'Resource type', type: 'string' },\n        tags: {\n          description: 'Resource tags',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      properties: {\n        entityName: { type: 'string' },\n        entityConnectionString: { type: 'string' },\n        resourceType: { type: 'string' },\n        resourceConnectionString: { type: 'string' },\n        hostname: { type: 'string' },\n        port: { format: 'int32', type: 'integer' },\n        biztalkUri: { type: 'string' }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2015-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json"},"here"),"."))}d.isMDXComponent=!0}}]);