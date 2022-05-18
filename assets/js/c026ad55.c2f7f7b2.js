"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5480],{3905:function(e,n,r){r.d(n,{Zo:function(){return l},kt:function(){return m}});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=t.createContext({}),c=function(e){var n=t.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},l=function(e){var n=c(e.components);return t.createElement(p.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),d=c(r),m=o,f=d["".concat(p,".").concat(m)]||d[m]||u[m]||i;return r?t.createElement(f,a(a({ref:n},l),{},{components:r})):t.createElement(f,a({ref:n},l))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var s={};for(var p in n)hasOwnProperty.call(n,p)&&(s[p]=n[p]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=r[c];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},21954:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return l},default:function(){return d}});var t=r(87462),o=r(63366),i=(r(67294),r(3905)),a=["components"],s={id:"IpAllocation",title:"IpAllocation"},p=void 0,c={unversionedId:"azure/resources/Network/IpAllocation",id:"azure/resources/Network/IpAllocation",isDocsHomePage:!1,title:"IpAllocation",description:"Provides a IpAllocation from the Network group",source:"@site/docs/azure/resources/Network/IpAllocation.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/IpAllocation",permalink:"/docs/azure/resources/Network/IpAllocation",tags:[],version:"current",frontMatter:{id:"IpAllocation",title:"IpAllocation"},sidebar:"docs",previous:{title:"InboundNatRule",permalink:"/docs/azure/resources/Network/InboundNatRule"},next:{title:"IpGroup",permalink:"/docs/azure/resources/Network/IpGroup"}},l=[{value:"Examples",id:"examples",children:[{value:"Create IpAllocation",id:"create-ipallocation",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:l};function d(e){var n=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"IpAllocation")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-ipallocation"},"Create IpAllocation"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "IpAllocation",\n    group: "Network",\n    name: "myIpAllocation",\n    properties: () => ({\n      properties: {\n        type: "Hypernet",\n        prefix: "3.2.5.0/24",\n        allocationTags: {\n          VNetID:\n            "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/HypernetVnet1",\n        },\n      },\n      location: "centraluseuap",\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      subnet: "mySubnet",\n      virtualNetwork: "myVirtualNetwork",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/Subnet"},"Subnet")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualNetwork"},"VirtualNetwork"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the IpAllocation.',\n      properties: {\n        subnet: {\n          readOnly: true,\n          description: 'The Subnet that using the prefix of this IpAllocation resource.',\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          'x-ms-azure-resource': true\n        },\n        virtualNetwork: {\n          readOnly: true,\n          description: 'The VirtualNetwork that using the prefix of this IpAllocation resource.',\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          'x-ms-azure-resource': true\n        },\n        type: {\n          description: 'The type for the IpAllocation.',\n          type: 'string',\n          enum: [ 'Undefined', 'Hypernet' ],\n          'x-ms-enum': { name: 'IpAllocationType', modelAsString: true }\n        },\n        prefix: {\n          type: 'string',\n          description: 'The address prefix for the IpAllocation.'\n        },\n        prefixLength: {\n          type: 'integer',\n          'x-nullable': true,\n          default: 0,\n          description: 'The address prefix length for the IpAllocation.'\n        },\n        prefixType: {\n          default: null,\n          description: 'The address prefix Type for the IpAllocation.',\n          type: 'string',\n          enum: [ 'IPv4', 'IPv6' ],\n          'x-ms-enum': { name: 'IPVersion', modelAsString: true }\n        },\n        ipamAllocationId: { type: 'string', description: 'The IPAM allocation ID.' },\n        allocationTags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'IpAllocation tags.'\n        }\n      }\n    },\n    etag: {\n      readOnly: true,\n      type: 'string',\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'IpAllocation resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/ipAllocation.json"},"here"),"."))}d.isMDXComponent=!0}}]);