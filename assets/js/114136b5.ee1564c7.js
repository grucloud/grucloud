"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[44997],{3905:(e,r,t)=>{t.d(r,{Zo:()=>c,kt:()=>m});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function p(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=n.createContext({}),s=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},c=function(e){var r=s(e.components);return n.createElement(l.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=p(e,["components","mdxType","originalType","parentName"]),d=s(t),m=a,f=d["".concat(l,".").concat(m)]||d[m]||u[m]||i;return t?n.createElement(f,o(o({ref:r},c),{},{components:t})):n.createElement(f,o({ref:r},c))}));function m(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var i=t.length,o=new Array(i);o[0]=d;var p={};for(var l in r)hasOwnProperty.call(r,l)&&(p[l]=r[l]);p.originalType=e,p.mdxType="string"==typeof e?e:a,o[1]=p;for(var s=2;s<i;s++)o[s]=t[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},11704:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>p,toc:()=>s});var n=t(87462),a=(t(67294),t(3905));const i={id:"VirtualApplianceSite",title:"VirtualApplianceSite"},o=void 0,p={unversionedId:"azure/resources/Network/VirtualApplianceSite",id:"azure/resources/Network/VirtualApplianceSite",title:"VirtualApplianceSite",description:"Provides a VirtualApplianceSite from the Network group",source:"@site/docs/azure/resources/Network/VirtualApplianceSite.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/VirtualApplianceSite",permalink:"/docs/azure/resources/Network/VirtualApplianceSite",draft:!1,tags:[],version:"current",frontMatter:{id:"VirtualApplianceSite",title:"VirtualApplianceSite"},sidebar:"docs",previous:{title:"Subnet",permalink:"/docs/azure/resources/Network/Subnet"},next:{title:"VirtualHub",permalink:"/docs/azure/resources/Network/VirtualHub"}},l={},s=[{value:"Examples",id:"examples",level:2},{value:"Create Network Virtual Appliance Site",id:"create-network-virtual-appliance-site",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],c={toc:s};function u(e){let{components:r,...t}=e;return(0,a.kt)("wrapper",(0,n.Z)({},c,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"VirtualApplianceSite")," from the ",(0,a.kt)("strong",{parentName:"p"},"Network")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"create-network-virtual-appliance-site"},"Create Network Virtual Appliance Site"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VirtualApplianceSite",\n    group: "Network",\n    name: "myVirtualApplianceSite",\n    properties: () => ({\n      properties: {\n        addressPrefix: "192.168.1.0/24",\n        o365Policy: {\n          breakOutCategories: { allow: true, optimize: true, default: true },\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      networkVirtualAppliance: "myNetworkVirtualAppliance",\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/NetworkVirtualAppliance"},"NetworkVirtualAppliance"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'The properties of the Virtual Appliance Sites.',\n      properties: {\n        addressPrefix: {\n          type: 'string',\n          readOnly: false,\n          description: 'Address Prefix.'\n        },\n        o365Policy: {\n          readOnly: false,\n          description: 'Office 365 Policy.',\n          properties: {\n            breakOutCategories: {\n              readOnly: false,\n              description: 'Office 365 breakout categories.',\n              properties: {\n                allow: {\n                  type: 'boolean',\n                  readOnly: false,\n                  description: 'Flag to control breakout of o365 allow category.'\n                },\n                optimize: {\n                  type: 'boolean',\n                  readOnly: false,\n                  description: 'Flag to control breakout of o365 optimize category.'\n                },\n                default: {\n                  type: 'boolean',\n                  readOnly: false,\n                  description: 'Flag to control breakout of o365 default category.'\n                }\n              }\n            }\n          }\n        },\n        provisioningState: {\n          description: 'The provisioning state of the resource.',\n          readOnly: true,\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'Name of the virtual appliance site.'\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    },\n    type: { type: 'string', readOnly: true, description: 'Site type.' }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Virtual Appliance Site resource.'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/networkVirtualAppliance.json"},"here"),"."))}u.isMDXComponent=!0}}]);