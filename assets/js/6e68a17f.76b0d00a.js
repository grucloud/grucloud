"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3406],{3905:function(e,r,t){t.d(r,{Zo:function(){return s},kt:function(){return w}});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function c(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=n.createContext({}),l=function(e){var r=n.useContext(u),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},s=function(e){var r=l(e.components);return n.createElement(u.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),d=l(t),w=a,y=d["".concat(u,".").concat(w)]||d[w]||p[w]||o;return t?n.createElement(y,i(i({ref:r},s),{},{components:t})):n.createElement(y,i({ref:r},s))}));function w(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=d;var c={};for(var u in r)hasOwnProperty.call(r,u)&&(c[u]=r[u]);c.originalType=e,c.mdxType="string"==typeof e?e:a,i[1]=c;for(var l=2;l<o;l++)i[l]=t[l];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},81700:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return c},contentTitle:function(){return u},metadata:function(){return l},toc:function(){return s},default:function(){return d}});var n=t(87462),a=t(63366),o=(t(67294),t(3905)),i=["components"],c={id:"VirtualNetworkGatewayConnectionSharedKey",title:"VirtualNetworkGatewayConnectionSharedKey"},u=void 0,l={unversionedId:"azure/resources/Network/VirtualNetworkGatewayConnectionSharedKey",id:"azure/resources/Network/VirtualNetworkGatewayConnectionSharedKey",isDocsHomePage:!1,title:"VirtualNetworkGatewayConnectionSharedKey",description:"Provides a VirtualNetworkGatewayConnectionSharedKey from the Network group",source:"@site/docs/azure/resources/Network/VirtualNetworkGatewayConnectionSharedKey.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/VirtualNetworkGatewayConnectionSharedKey",permalink:"/docs/azure/resources/Network/VirtualNetworkGatewayConnectionSharedKey",tags:[],version:"current",frontMatter:{id:"VirtualNetworkGatewayConnectionSharedKey",title:"VirtualNetworkGatewayConnectionSharedKey"},sidebar:"docs",previous:{title:"VirtualNetworkGatewayConnection",permalink:"/docs/azure/resources/Network/VirtualNetworkGatewayConnection"},next:{title:"VirtualNetworkGatewayNatRule",permalink:"/docs/azure/resources/Network/VirtualNetworkGatewayNatRule"}},s=[{value:"Examples",id:"examples",children:[{value:"SetVirtualNetworkGatewayConnectionSharedKey",id:"setvirtualnetworkgatewayconnectionsharedkey",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:s};function d(e){var r=e.components,t=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"VirtualNetworkGatewayConnectionSharedKey")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"setvirtualnetworkgatewayconnectionsharedkey"},"SetVirtualNetworkGatewayConnectionSharedKey"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VirtualNetworkGatewayConnectionSharedKey",\n    group: "Network",\n    name: "myVirtualNetworkGatewayConnectionSharedKey",\n    properties: () => ({ value: "AzureAbc123" }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      virtualNetworkGatewayConnection: "myVirtualNetworkGatewayConnection",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualNetworkGatewayConnection"},"VirtualNetworkGatewayConnection"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    value: {\n      type: 'string',\n      description: 'The virtual network connection shared key value.'\n    }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  required: [ 'value' ],\n  description: 'Response for GetConnectionSharedKey API service call.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualNetworkGateway.json"},"here"),"."))}d.isMDXComponent=!0}}]);