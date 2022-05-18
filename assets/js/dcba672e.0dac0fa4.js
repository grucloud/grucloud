"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2966],{3905:function(e,n,r){r.d(n,{Zo:function(){return c},kt:function(){return m}});var t=r(67294);function a(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){a(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,a=function(e,n){if(null==e)return{};var r,t,a={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(a[r]=e[r]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var p=t.createContext({}),u=function(e){var n=t.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},c=function(e){var n=u(e.components);return t.createElement(p.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,a=e.mdxType,i=e.originalType,p=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(r),m=a,g=d["".concat(p,".").concat(m)]||d[m]||l[m]||i;return r?t.createElement(g,o(o({ref:n},c),{},{components:r})):t.createElement(g,o({ref:n},c))}));function m(e,n){var r=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=d;var s={};for(var p in n)hasOwnProperty.call(n,p)&&(s[p]=n[p]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var u=2;u<i;u++)o[u]=r[u];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},24233:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return p},metadata:function(){return u},toc:function(){return c},default:function(){return d}});var t=r(87462),a=r(63366),i=(r(67294),r(3905)),o=["components"],s={id:"NatRule",title:"NatRule"},p=void 0,u={unversionedId:"azure/resources/Network/NatRule",id:"azure/resources/Network/NatRule",isDocsHomePage:!1,title:"NatRule",description:"Provides a NatRule from the Network group",source:"@site/docs/azure/resources/Network/NatRule.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/NatRule",permalink:"/docs/azure/resources/Network/NatRule",tags:[],version:"current",frontMatter:{id:"NatRule",title:"NatRule"},sidebar:"docs",previous:{title:"NatGateway",permalink:"/docs/azure/resources/Network/NatGateway"},next:{title:"NetworkInterface",permalink:"/docs/azure/resources/Network/NetworkInterface"}},c=[{value:"Examples",id:"examples",children:[{value:"NatRulePut",id:"natruleput",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:c};function d(e){var n=e.components,r=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,t.Z)({},l,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"NatRule")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"natruleput"},"NatRulePut"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "NatRule",\n    group: "Network",\n    name: "myNatRule",\n    properties: () => ({\n      properties: {\n        type: "Static",\n        mode: "EgressSnat",\n        ipConfigurationId:\n          "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/cloudnet1-VNG/ipConfigurations/default",\n        internalMappings: [{ addressSpace: "10.4.0.0/24" }],\n        externalMappings: [{ addressSpace: "192.168.21.0/24" }],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      virtualHubIpConfiguration: "myVirtualHubIpConfiguration",\n      gateway: "myVpnGateway",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualHubIpConfiguration"},"VirtualHubIpConfiguration")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VpnGateway"},"VpnGateway"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the VpnGateway NAT rule.',\n      properties: {\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the NAT Rule resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        type: {\n          type: 'string',\n          description: 'The type of NAT rule for VPN NAT.',\n          enum: [ 'Static', 'Dynamic' ],\n          'x-ms-enum': { name: 'VpnNatRuleType', modelAsString: true }\n        },\n        mode: {\n          type: 'string',\n          description: 'The Source NAT direction of a VPN NAT.',\n          enum: [ 'EgressSnat', 'IngressSnat' ],\n          'x-ms-enum': { name: 'VpnNatRuleMode', modelAsString: true }\n        },\n        internalMappings: {\n          type: 'array',\n          items: {\n            properties: {\n              addressSpace: {\n                type: 'string',\n                description: 'Address space for Vpn NatRule mapping.'\n              },\n              portRange: {\n                type: 'string',\n                description: 'Port range for Vpn NatRule mapping.'\n              }\n            },\n            description: 'Vpn NatRule mapping.'\n          },\n          description: 'The private IP address internal mapping for NAT.'\n        },\n        externalMappings: {\n          type: 'array',\n          items: {\n            properties: {\n              addressSpace: {\n                type: 'string',\n                description: 'Address space for Vpn NatRule mapping.'\n              },\n              portRange: {\n                type: 'string',\n                description: 'Port range for Vpn NatRule mapping.'\n              }\n            },\n            description: 'Vpn NatRule mapping.'\n          },\n          description: 'The private IP address external mapping for NAT.'\n        },\n        ipConfigurationId: {\n          type: 'string',\n          description: 'The IP Configuration ID this NAT rule applies to.'\n        },\n        egressVpnSiteLinkConnections: {\n          type: 'array',\n          readOnly: true,\n          items: {\n            properties: { id: { type: 'string', description: 'Resource ID.' } },\n            description: 'Reference to another subresource.',\n            'x-ms-azure-resource': true\n          },\n          description: 'List of egress VpnSiteLinkConnections.'\n        },\n        ingressVpnSiteLinkConnections: {\n          type: 'array',\n          readOnly: true,\n          items: {\n            properties: { id: { type: 'string', description: 'Resource ID.' } },\n            description: 'Reference to another subresource.',\n            'x-ms-azure-resource': true\n          },\n          description: 'List of ingress VpnSiteLinkConnections.'\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    },\n    type: { readOnly: true, type: 'string', description: 'Resource type.' }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'VpnGatewayNatRule Resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json"},"here"),"."))}d.isMDXComponent=!0}}]);