"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[68737],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return m}});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=t.createContext({}),c=function(e){var n=t.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(p.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(r),m=o,f=d["".concat(p,".").concat(m)]||d[m]||l[m]||i;return r?t.createElement(f,a(a({ref:n},u),{},{components:r})):t.createElement(f,a({ref:n},u))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var s={};for(var p in n)hasOwnProperty.call(n,p)&&(s[p]=n[p]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=r[c];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},96260:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return u},default:function(){return d}});var t=r(87462),o=r(63366),i=(r(67294),r(3905)),a=["components"],s={id:"AppServiceEnvironmentAseV3NetworkingConfiguration",title:"AppServiceEnvironmentAseV3NetworkingConfiguration"},p=void 0,c={unversionedId:"azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration",id:"azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration",isDocsHomePage:!1,title:"AppServiceEnvironmentAseV3NetworkingConfiguration",description:"Provides a AppServiceEnvironmentAseV3NetworkingConfiguration from the Web group",source:"@site/docs/azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentAseV3NetworkingConfiguration",tags:[],version:"current",frontMatter:{id:"AppServiceEnvironmentAseV3NetworkingConfiguration",title:"AppServiceEnvironmentAseV3NetworkingConfiguration"},sidebar:"docs",previous:{title:"AppServiceEnvironment",permalink:"/docs/azure/resources/Web/AppServiceEnvironment"},next:{title:"AppServiceEnvironmentMultiRolePool",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentMultiRolePool"}},u=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:u};function d(e){var n=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,t.Z)({},l,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"AppServiceEnvironmentAseV3NetworkingConfiguration")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/AppServiceEnvironment"},"AppServiceEnvironment"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Full view of networking configuration for an ASE.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'AseV3NetworkingConfiguration resource specific properties',\n      type: 'object',\n      properties: {\n        windowsOutboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },\n        linuxOutboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },\n        externalInboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },\n        internalInboundIpAddresses: { type: 'array', items: { type: 'string' }, readOnly: true },\n        allowNewPrivateEndpointConnections: {\n          description: 'Property to enable and disable new private endpoint connection creation on ASE',\n          type: 'boolean'\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/AppServiceEnvironments.json"},"here"),"."))}d.isMDXComponent=!0}}]);