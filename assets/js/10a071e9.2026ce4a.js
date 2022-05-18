"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7437],{3905:function(e,r,t){t.d(r,{Zo:function(){return l},kt:function(){return d}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function u(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?u(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},u=Object.keys(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var a=n.createContext({}),c=function(e){var r=n.useContext(a),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},l=function(e){var r=c(e.components);return n.createElement(a.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},f=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,u=e.originalType,a=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),f=c(t),d=o,m=f["".concat(a,".").concat(d)]||f[d]||p[d]||u;return t?n.createElement(m,i(i({ref:r},l),{},{components:t})):n.createElement(m,i({ref:r},l))}));function d(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var u=t.length,i=new Array(u);i[0]=f;var s={};for(var a in r)hasOwnProperty.call(r,a)&&(s[a]=r[a]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<u;c++)i[c]=t[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}f.displayName="MDXCreateElement"},74251:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return s},contentTitle:function(){return a},metadata:function(){return c},toc:function(){return l},default:function(){return f}});var n=t(87462),o=t(63366),u=(t(67294),t(3905)),i=["components"],s={id:"VirtualNetworkRule",title:"VirtualNetworkRule"},a=void 0,c={unversionedId:"azure/resources/DBforPostgreSQL/VirtualNetworkRule",id:"azure/resources/DBforPostgreSQL/VirtualNetworkRule",isDocsHomePage:!1,title:"VirtualNetworkRule",description:"Provides a VirtualNetworkRule from the DBforPostgreSQL group",source:"@site/docs/azure/resources/DBforPostgreSQL/VirtualNetworkRule.md",sourceDirName:"azure/resources/DBforPostgreSQL",slug:"/azure/resources/DBforPostgreSQL/VirtualNetworkRule",permalink:"/docs/azure/resources/DBforPostgreSQL/VirtualNetworkRule",tags:[],version:"current",frontMatter:{id:"VirtualNetworkRule",title:"VirtualNetworkRule"},sidebar:"docs",previous:{title:"ServerSecurityAlertPolicy",permalink:"/docs/azure/resources/DBforPostgreSQL/ServerSecurityAlertPolicy"},next:{title:"Domain",permalink:"/docs/azure/resources/DomainRegistration/Domain"}},l=[{value:"Examples",id:"examples",children:[{value:"Create or update a virtual network rule",id:"create-or-update-a-virtual-network-rule",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:l};function f(e){var r=e.components,t=(0,o.Z)(e,i);return(0,u.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,u.kt)("p",null,"Provides a ",(0,u.kt)("strong",{parentName:"p"},"VirtualNetworkRule")," from the ",(0,u.kt)("strong",{parentName:"p"},"DBforPostgreSQL")," group"),(0,u.kt)("h2",{id:"examples"},"Examples"),(0,u.kt)("h3",{id:"create-or-update-a-virtual-network-rule"},"Create or update a virtual network rule"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-js"},'provider.DBforPostgreSQL.makeVirtualNetworkRule({\n  name: "myVirtualNetworkRule",\n  properties: () => ({\n    properties: {\n      ignoreMissingVnetServiceEndpoint: false,\n      virtualNetworkSubnetId:\n        "/subscriptions/ffffffff-ffff-ffff-ffff-ffffffffffff/resourceGroups/TestGroup/providers/Microsoft.Network/virtualNetworks/testvnet/subnets/testsubnet",\n    },\n  }),\n  dependencies: ({ resources }) => ({\n    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],\n    subnet: resources.Network.Subnet["mySubnet"],\n    server: resources.DBforPostgreSQL.Server["myServer"],\n  }),\n});\n\n')),(0,u.kt)("h2",{id:"dependencies"},"Dependencies"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/Subnet"},"Subnet")),(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"/docs/azure/resources/DBforPostgreSQL/Server"},"Server"))),(0,u.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'A virtual network rule.',\n  type: 'object',\n  allOf: [\n    {\n      title: 'Proxy Resource',\n      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',\n      type: 'object',\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Resource properties.',\n      'x-ms-client-flatten': true,\n      required: [ 'virtualNetworkSubnetId' ],\n      type: 'object',\n      properties: {\n        virtualNetworkSubnetId: {\n          description: 'The ARM resource id of the virtual network subnet.',\n          type: 'string'\n        },\n        ignoreMissingVnetServiceEndpoint: {\n          description: 'Create firewall rule before the virtual network has vnet service endpoint enabled.',\n          type: 'boolean'\n        },\n        state: {\n          description: 'Virtual Network Rule State',\n          enum: [\n            'Initializing',\n            'InProgress',\n            'Ready',\n            'Deleting',\n            'Unknown'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'VirtualNetworkRuleState', modelAsString: true }\n        }\n      }\n    }\n  }\n}\n")),(0,u.kt)("h2",{id:"misc"},"Misc"),(0,u.kt)("p",null,"The resource version is ",(0,u.kt)("inlineCode",{parentName:"p"},"2017-12-01"),"."),(0,u.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,u.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/postgresql.json"},"here"),"."))}f.isMDXComponent=!0}}]);