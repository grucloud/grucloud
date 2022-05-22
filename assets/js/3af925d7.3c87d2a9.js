"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[24165],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return b}});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function u(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),l=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},c=function(e){var t=l(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),d=l(r),b=o,m=d["".concat(s,".").concat(b)]||d[b]||p[b]||i;return r?n.createElement(m,a(a({ref:t},c),{},{components:r})):n.createElement(m,a({ref:t},c))}));function b(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var u={};for(var s in t)hasOwnProperty.call(t,s)&&(u[s]=t[s]);u.originalType=e,u.mdxType="string"==typeof e?e:o,a[1]=u;for(var l=2;l<i;l++)a[l]=r[l];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2774:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return u},contentTitle:function(){return s},metadata:function(){return l},toc:function(){return c},default:function(){return d}});var n=r(87462),o=r(63366),i=(r(67294),r(3905)),a=["components"],u={id:"VirtualHubRouteTableV2",title:"VirtualHubRouteTableV2"},s=void 0,l={unversionedId:"azure/resources/Network/VirtualHubRouteTableV2",id:"azure/resources/Network/VirtualHubRouteTableV2",isDocsHomePage:!1,title:"VirtualHubRouteTableV2",description:"Provides a VirtualHubRouteTableV2 from the Network group",source:"@site/docs/azure/resources/Network/VirtualHubRouteTableV2.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/VirtualHubRouteTableV2",permalink:"/docs/azure/resources/Network/VirtualHubRouteTableV2",tags:[],version:"current",frontMatter:{id:"VirtualHubRouteTableV2",title:"VirtualHubRouteTableV2"},sidebar:"docs",previous:{title:"VirtualHubIpConfiguration",permalink:"/docs/azure/resources/Network/VirtualHubIpConfiguration"},next:{title:"VirtualNetwork",permalink:"/docs/azure/resources/Network/VirtualNetwork"}},c=[{value:"Examples",id:"examples",children:[{value:"VirtualHubRouteTableV2Put",id:"virtualhubroutetablev2put",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:c};function d(e){var t=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"VirtualHubRouteTableV2")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"virtualhubroutetablev2put"},"VirtualHubRouteTableV2Put"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VirtualHubRouteTableV2",\n    group: "Network",\n    name: "myVirtualHubRouteTableV2",\n    properties: () => ({\n      properties: {\n        routes: [\n          {\n            destinationType: "CIDR",\n            destinations: ["20.10.0.0/16", "20.20.0.0/16"],\n            nextHopType: "IPAddress",\n            nextHops: ["10.0.0.68"],\n          },\n          {\n            destinationType: "CIDR",\n            destinations: ["0.0.0.0/0"],\n            nextHopType: "IPAddress",\n            nextHops: ["10.0.0.68"],\n          },\n        ],\n        attachedConnections: ["All_Vnets"],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      virtualHub: "myVirtualHub",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualHub"},"VirtualHub"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the virtual hub route table v2.',\n      properties: {\n        routes: {\n          type: 'array',\n          description: 'List of all routes.',\n          items: {\n            properties: {\n              destinationType: {\n                type: 'string',\n                description: 'The type of destinations.'\n              },\n              destinations: {\n                type: 'array',\n                description: 'List of all destinations.',\n                items: { type: 'string' }\n              },\n              nextHopType: { type: 'string', description: 'The type of next hops.' },\n              nextHops: {\n                type: 'array',\n                description: 'NextHops ip address.',\n                items: { type: 'string' }\n              }\n            },\n            description: 'VirtualHubRouteTableV2 route.'\n          }\n        },\n        attachedConnections: {\n          type: 'array',\n          description: 'List of all connections attached to this route table v2.',\n          items: { type: 'string' }\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the virtual hub route table v2 resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'VirtualHubRouteTableV2 Resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json"},"here"),"."))}d.isMDXComponent=!0}}]);