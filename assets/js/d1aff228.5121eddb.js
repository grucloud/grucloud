"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[38696],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>g});var n=t(67294);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function u(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var s=n.createContext({}),l=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},p=function(e){var r=l(e.components);return n.createElement(s.Provider,{value:r},e.children)},c="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),c=l(t),m=i,g=c["".concat(s,".").concat(m)]||c[m]||d[m]||o;return t?n.createElement(g,a(a({ref:r},p),{},{components:t})):n.createElement(g,a({ref:r},p))}));function g(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=m;var u={};for(var s in r)hasOwnProperty.call(r,s)&&(u[s]=r[s]);u.originalType=e,u[c]="string"==typeof e?e:i,a[1]=u;for(var l=2;l<o;l++)a[l]=t[l];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},38114:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>s,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>u,toc:()=>l});var n=t(87462),i=(t(67294),t(3905));const o={id:"VirtualRouterPeering",title:"VirtualRouterPeering"},a=void 0,u={unversionedId:"azure/resources/Network/VirtualRouterPeering",id:"azure/resources/Network/VirtualRouterPeering",title:"VirtualRouterPeering",description:"Provides a VirtualRouterPeering from the Network group",source:"@site/docs/azure/resources/Network/VirtualRouterPeering.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/VirtualRouterPeering",permalink:"/docs/azure/resources/Network/VirtualRouterPeering",draft:!1,tags:[],version:"current",frontMatter:{id:"VirtualRouterPeering",title:"VirtualRouterPeering"},sidebar:"docs",previous:{title:"VirtualRouter",permalink:"/docs/azure/resources/Network/VirtualRouter"},next:{title:"VirtualWan",permalink:"/docs/azure/resources/Network/VirtualWan"}},s={},l=[{value:"Examples",id:"examples",level:2},{value:"Create Virtual Router Peering",id:"create-virtual-router-peering",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:l},c="wrapper";function d(e){let{components:r,...t}=e;return(0,i.kt)(c,(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"VirtualRouterPeering")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-virtual-router-peering"},"Create Virtual Router Peering"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VirtualRouterPeering",\n    group: "Network",\n    name: "myVirtualRouterPeering",\n    properties: () => ({\n      properties: { peerIp: "192.168.1.5", peerAsn: 20000 },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      virtualRouter: "myVirtualRouter",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualRouter"},"VirtualRouter"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'The properties of the Virtual Router Peering.',\n      properties: {\n        peerAsn: {\n          type: 'integer',\n          readOnly: false,\n          format: 'int64',\n          minimum: 0,\n          maximum: 4294967295,\n          description: 'Peer ASN.'\n        },\n        peerIp: { type: 'string', readOnly: false, description: 'Peer IP.' },\n        provisioningState: {\n          description: 'The provisioning state of the resource.',\n          readOnly: true,\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'Name of the virtual router peering that is unique within a virtual router.'\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    },\n    type: { type: 'string', readOnly: true, description: 'Peering type.' }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Virtual Router Peering resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-01-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/virtualRouter.json"},"here"),"."))}d.isMDXComponent=!0}}]);