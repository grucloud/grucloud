"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1655],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return f}});var n=r(67294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},c=Object.keys(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)r=c[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=n.createContext({}),u=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},s=function(e){var t=u(e.components);return n.createElement(p.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},b=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,c=e.originalType,p=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),b=u(r),f=i,d=b["".concat(p,".").concat(f)]||b[f]||l[f]||c;return r?n.createElement(d,o(o({ref:t},s),{},{components:r})):n.createElement(d,o({ref:t},s))}));function f(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var c=r.length,o=new Array(c);o[0]=b;var a={};for(var p in t)hasOwnProperty.call(t,p)&&(a[p]=t[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var u=2;u<c;u++)o[u]=r[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}b.displayName="MDXCreateElement"},93097:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return u},toc:function(){return s},default:function(){return b}});var n=r(87462),i=r(63366),c=(r(67294),r(3905)),o=["components"],a={id:"WebAppPublicCertificateSlot",title:"WebAppPublicCertificateSlot"},p=void 0,u={unversionedId:"azure/resources/Web/WebAppPublicCertificateSlot",id:"azure/resources/Web/WebAppPublicCertificateSlot",isDocsHomePage:!1,title:"WebAppPublicCertificateSlot",description:"Provides a WebAppPublicCertificateSlot from the Web group",source:"@site/docs/azure/resources/Web/WebAppPublicCertificateSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppPublicCertificateSlot",permalink:"/docs/azure/resources/Web/WebAppPublicCertificateSlot",tags:[],version:"current",frontMatter:{id:"WebAppPublicCertificateSlot",title:"WebAppPublicCertificateSlot"},sidebar:"docs",previous:{title:"WebAppPublicCertificate",permalink:"/docs/azure/resources/Web/WebAppPublicCertificate"},next:{title:"WebAppRelayServiceConnection",permalink:"/docs/azure/resources/Web/WebAppRelayServiceConnection"}},s=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:s};function b(e){var t=e.components,r=(0,i.Z)(e,o);return(0,c.kt)("wrapper",(0,n.Z)({},l,r,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"Provides a ",(0,c.kt)("strong",{parentName:"p"},"WebAppPublicCertificateSlot")," from the ",(0,c.kt)("strong",{parentName:"p"},"Web")," group"),(0,c.kt)("h2",{id:"examples"},"Examples"),(0,c.kt)("h2",{id:"dependencies"},"Dependencies"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/SiteSlot"},"SiteSlot"))),(0,c.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Public certificate object',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'PublicCertificate resource specific properties',\n      type: 'object',\n      properties: {\n        blob: {\n          format: 'byte',\n          description: 'Public Certificate byte array',\n          type: 'string'\n        },\n        publicCertificateLocation: {\n          description: 'Public Certificate Location',\n          enum: [ 'CurrentUserMy', 'LocalMachineMy', 'Unknown' ],\n          type: 'string',\n          'x-ms-enum': { name: 'PublicCertificateLocation', modelAsString: false }\n        },\n        thumbprint: {\n          description: 'Certificate Thumbprint',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,c.kt)("h2",{id:"misc"},"Misc"),(0,c.kt)("p",null,"The resource version is ",(0,c.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,c.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,c.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json"},"here"),"."))}b.isMDXComponent=!0}}]);