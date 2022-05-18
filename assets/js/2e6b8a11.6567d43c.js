"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1350],{3905:function(e,r,n){n.d(r,{Zo:function(){return p},kt:function(){return f}});var t=n(67294);function i(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function a(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){i(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function s(e,r){if(null==e)return{};var n,t,i=function(e,r){if(null==e)return{};var n,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(i[n]=e[n]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=t.createContext({}),u=function(e){var r=t.useContext(c),n=r;return e&&(n="function"==typeof e?e(r):a(a({},r),e)),n},p=function(e){var r=u(e.components);return t.createElement(c.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=u(n),f=i,m=d["".concat(c,".").concat(f)]||d[f]||l[f]||o;return n?t.createElement(m,a(a({ref:r},p),{},{components:n})):t.createElement(m,a({ref:r},p))}));function f(e,r){var n=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=d;var s={};for(var c in r)hasOwnProperty.call(r,c)&&(s[c]=r[c]);s.originalType=e,s.mdxType="string"==typeof e?e:i,a[1]=s;for(var u=2;u<o;u++)a[u]=n[u];return t.createElement.apply(null,a)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},16935:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return p},default:function(){return d}});var t=n(87462),i=n(63366),o=(n(67294),n(3905)),a=["components"],s={id:"VirtualWan",title:"VirtualWan"},c=void 0,u={unversionedId:"azure/resources/Network/VirtualWan",id:"azure/resources/Network/VirtualWan",isDocsHomePage:!1,title:"VirtualWan",description:"Provides a VirtualWan from the Network group",source:"@site/docs/azure/resources/Network/VirtualWan.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/VirtualWan",permalink:"/docs/azure/resources/Network/VirtualWan",tags:[],version:"current",frontMatter:{id:"VirtualWan",title:"VirtualWan"},sidebar:"docs",previous:{title:"VirtualRouterPeering",permalink:"/docs/azure/resources/Network/VirtualRouterPeering"},next:{title:"VpnConnection",permalink:"/docs/azure/resources/Network/VpnConnection"}},p=[{value:"Examples",id:"examples",children:[{value:"VirtualWANCreate",id:"virtualwancreate",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:p};function d(e){var r=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,t.Z)({},l,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"VirtualWan")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"virtualwancreate"},"VirtualWANCreate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VirtualWan",\n    group: "Network",\n    name: "myVirtualWan",\n    properties: () => ({\n      location: "West US",\n      tags: { key1: "value1" },\n      properties: { disableVpnEncryption: false, type: "Basic" },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  required: [ 'location' ],\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the virtual WAN.',\n      properties: {\n        disableVpnEncryption: {\n          type: 'boolean',\n          description: 'Vpn encryption to be disabled or not.'\n        },\n        virtualHubs: {\n          type: 'array',\n          readOnly: true,\n          items: {\n            properties: { id: { type: 'string', description: 'Resource ID.' } },\n            description: 'Reference to another subresource.',\n            'x-ms-azure-resource': true\n          },\n          description: 'List of VirtualHubs in the VirtualWAN.'\n        },\n        vpnSites: {\n          type: 'array',\n          readOnly: true,\n          items: {\n            properties: { id: { type: 'string', description: 'Resource ID.' } },\n            description: 'Reference to another subresource.',\n            'x-ms-azure-resource': true\n          },\n          description: 'List of VpnSites in the VirtualWAN.'\n        },\n        allowBranchToBranchTraffic: {\n          type: 'boolean',\n          description: 'True if branch to branch traffic is allowed.'\n        },\n        allowVnetToVnetTraffic: {\n          type: 'boolean',\n          description: 'True if Vnet to Vnet traffic is allowed.'\n        },\n        office365LocalBreakoutCategory: {\n          description: 'The office local breakout category.',\n          type: 'string',\n          readOnly: true,\n          enum: [ 'Optimize', 'OptimizeAndAllow', 'All', 'None' ],\n          'x-ms-enum': { name: 'OfficeTrafficCategory', modelAsString: true }\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the virtual WAN resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        type: { type: 'string', description: 'The type of the VirtualWAN.' }\n      }\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'VirtualWAN Resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json"},"here"),"."))}d.isMDXComponent=!0}}]);