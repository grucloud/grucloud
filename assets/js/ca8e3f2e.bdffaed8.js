"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[77265],{3905:(e,r,n)=>{n.d(r,{Zo:()=>u,kt:()=>f});var t=n(67294);function i(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function p(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){i(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function a(e,r){if(null==e)return{};var n,t,i=function(e,r){if(null==e)return{};var n,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(i[n]=e[n]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var s=t.createContext({}),c=function(e){var r=t.useContext(s),n=r;return e&&(n="function"==typeof e?e(r):p(p({},r),e)),n},u=function(e){var r=c(e.components);return t.createElement(s.Provider,{value:r},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},m=t.forwardRef((function(e,r){var n=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),l=c(n),m=i,f=l["".concat(s,".").concat(m)]||l[m]||d[m]||o;return n?t.createElement(f,p(p({ref:r},u),{},{components:n})):t.createElement(f,p({ref:r},u))}));function f(e,r){var n=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=n.length,p=new Array(o);p[0]=m;var a={};for(var s in r)hasOwnProperty.call(r,s)&&(a[s]=r[s]);a.originalType=e,a[l]="string"==typeof e?e:i,p[1]=a;for(var c=2;c<o;c++)p[c]=n[c];return t.createElement.apply(null,p)}return t.createElement.apply(null,n)}m.displayName="MDXCreateElement"},98340:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>s,contentTitle:()=>p,default:()=>d,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var t=n(87462),i=(n(67294),n(3905));const o={id:"WebAppDomainOwnershipIdentifier",title:"WebAppDomainOwnershipIdentifier"},p=void 0,a={unversionedId:"azure/resources/Web/WebAppDomainOwnershipIdentifier",id:"azure/resources/Web/WebAppDomainOwnershipIdentifier",title:"WebAppDomainOwnershipIdentifier",description:"Provides a WebAppDomainOwnershipIdentifier from the Web group",source:"@site/docs/azure/resources/Web/WebAppDomainOwnershipIdentifier.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppDomainOwnershipIdentifier",permalink:"/docs/azure/resources/Web/WebAppDomainOwnershipIdentifier",draft:!1,tags:[],version:"current",frontMatter:{id:"WebAppDomainOwnershipIdentifier",title:"WebAppDomainOwnershipIdentifier"},sidebar:"docs",previous:{title:"WebAppDiagnosticLogsConfigurationSlot",permalink:"/docs/azure/resources/Web/WebAppDiagnosticLogsConfigurationSlot"},next:{title:"WebAppDomainOwnershipIdentifierSlot",permalink:"/docs/azure/resources/Web/WebAppDomainOwnershipIdentifierSlot"}},s={},c=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c},l="wrapper";function d(e){let{components:r,...n}=e;return(0,i.kt)(l,(0,t.Z)({},u,n,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"WebAppDomainOwnershipIdentifier")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebApp"},"WebApp"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'A domain specific resource identifier.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Identifier resource specific properties',\n      type: 'object',\n      properties: {\n        id: {\n          description: 'String representation of the identity.',\n          type: 'string',\n          'x-ms-client-name': 'value'\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json"},"here"),"."))}d.isMDXComponent=!0}}]);