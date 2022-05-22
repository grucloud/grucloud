"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[11359],{3905:function(e,r,t){t.d(r,{Zo:function(){return s},kt:function(){return f}});var n=t(67294);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function c(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?c(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},c=Object.keys(e);for(n=0;n<c.length;n++)t=c[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)t=c[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=n.createContext({}),u=function(e){var r=n.useContext(p),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},s=function(e){var r=u(e.components);return n.createElement(p.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},b=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,c=e.originalType,p=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),b=u(t),f=i,d=b["".concat(p,".").concat(f)]||b[f]||l[f]||c;return t?n.createElement(d,o(o({ref:r},s),{},{components:t})):n.createElement(d,o({ref:r},s))}));function f(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var c=t.length,o=new Array(c);o[0]=b;var a={};for(var p in r)hasOwnProperty.call(r,p)&&(a[p]=r[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var u=2;u<c;u++)o[u]=t[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}b.displayName="MDXCreateElement"},97591:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return u},toc:function(){return s},default:function(){return b}});var n=t(87462),i=t(63366),c=(t(67294),t(3905)),o=["components"],a={id:"WebAppPublicCertificate",title:"WebAppPublicCertificate"},p=void 0,u={unversionedId:"azure/resources/Web/WebAppPublicCertificate",id:"azure/resources/Web/WebAppPublicCertificate",isDocsHomePage:!1,title:"WebAppPublicCertificate",description:"Provides a WebAppPublicCertificate from the Web group",source:"@site/docs/azure/resources/Web/WebAppPublicCertificate.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppPublicCertificate",permalink:"/docs/azure/resources/Web/WebAppPublicCertificate",tags:[],version:"current",frontMatter:{id:"WebAppPublicCertificate",title:"WebAppPublicCertificate"},sidebar:"docs",previous:{title:"WebAppProcessSlot",permalink:"/docs/azure/resources/Web/WebAppProcessSlot"},next:{title:"WebAppPublicCertificateSlot",permalink:"/docs/azure/resources/Web/WebAppPublicCertificateSlot"}},s=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:s};function b(e){var r=e.components,t=(0,i.Z)(e,o);return(0,c.kt)("wrapper",(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"Provides a ",(0,c.kt)("strong",{parentName:"p"},"WebAppPublicCertificate")," from the ",(0,c.kt)("strong",{parentName:"p"},"Web")," group"),(0,c.kt)("h2",{id:"examples"},"Examples"),(0,c.kt)("h2",{id:"dependencies"},"Dependencies"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site"))),(0,c.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Public certificate object',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'PublicCertificate resource specific properties',\n      type: 'object',\n      properties: {\n        blob: {\n          format: 'byte',\n          description: 'Public Certificate byte array',\n          type: 'string'\n        },\n        publicCertificateLocation: {\n          description: 'Public Certificate Location',\n          enum: [ 'CurrentUserMy', 'LocalMachineMy', 'Unknown' ],\n          type: 'string',\n          'x-ms-enum': { name: 'PublicCertificateLocation', modelAsString: false }\n        },\n        thumbprint: {\n          description: 'Certificate Thumbprint',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,c.kt)("h2",{id:"misc"},"Misc"),(0,c.kt)("p",null,"The resource version is ",(0,c.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,c.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,c.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json"},"here"),"."))}b.isMDXComponent=!0}}]);