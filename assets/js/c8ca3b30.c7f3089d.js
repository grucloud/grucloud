"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[44419],{3905:(e,r,n)=>{n.d(r,{Zo:()=>p,kt:()=>d});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function i(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?i(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function u(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var a=t.createContext({}),s=function(e){var r=t.useContext(a),n=r;return e&&(n="function"==typeof e?e(r):l(l({},r),e)),n},p=function(e){var r=s(e.components);return t.createElement(a.Provider,{value:r},e.children)},c="mdxType",y={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},m=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,i=e.originalType,a=e.parentName,p=u(e,["components","mdxType","originalType","parentName"]),c=s(n),m=o,d=c["".concat(a,".").concat(m)]||c[m]||y[m]||i;return n?t.createElement(d,l(l({ref:r},p),{},{components:n})):t.createElement(d,l({ref:r},p))}));function d(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=n.length,l=new Array(i);l[0]=m;var u={};for(var a in r)hasOwnProperty.call(r,a)&&(u[a]=r[a]);u.originalType=e,u[c]="string"==typeof e?e:o,l[1]=u;for(var s=2;s<i;s++)l[s]=n[s];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}m.displayName="MDXCreateElement"},69762:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>a,contentTitle:()=>l,default:()=>y,frontMatter:()=>i,metadata:()=>u,toc:()=>s});var t=n(87462),o=(n(67294),n(3905));const i={id:"FirewallPolicyRuleGroup",title:"FirewallPolicyRuleGroup"},l=void 0,u={unversionedId:"azure/resources/Network/FirewallPolicyRuleGroup",id:"azure/resources/Network/FirewallPolicyRuleGroup",title:"FirewallPolicyRuleGroup",description:"Provides a FirewallPolicyRuleGroup from the Network group",source:"@site/docs/azure/resources/Network/FirewallPolicyRuleGroup.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/FirewallPolicyRuleGroup",permalink:"/docs/azure/resources/Network/FirewallPolicyRuleGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"FirewallPolicyRuleGroup",title:"FirewallPolicyRuleGroup"},sidebar:"docs",previous:{title:"FirewallPolicyRuleCollectionGroup",permalink:"/docs/azure/resources/Network/FirewallPolicyRuleCollectionGroup"},next:{title:"FlowLog",permalink:"/docs/azure/resources/Network/FlowLog"}},a={},s=[{value:"Examples",id:"examples",level:2},{value:"Create FirewallPolicyRuleGroup",id:"create-firewallpolicyrulegroup",level:3},{value:"Create FirewallPolicyRuleGroup With IpGroups",id:"create-firewallpolicyrulegroup-with-ipgroups",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:s},c="wrapper";function y(e){let{components:r,...n}=e;return(0,o.kt)(c,(0,t.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"FirewallPolicyRuleGroup")," from the ",(0,o.kt)("strong",{parentName:"p"},"Network")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-firewallpolicyrulegroup"},"Create FirewallPolicyRuleGroup"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FirewallPolicyRuleGroup",\n    group: "Network",\n    name: "myFirewallPolicyRuleGroup",\n    properties: () => ({\n      properties: {\n        priority: 110,\n        rules: [\n          {\n            ruleType: "FirewallPolicyFilterRule",\n            name: "Example-Filter-Rule",\n            action: { type: "Deny" },\n            ruleConditions: [\n              {\n                ruleConditionType: "NetworkRuleCondition",\n                name: "network-condition1",\n                sourceAddresses: ["10.1.25.0/24"],\n                destinationAddresses: ["*"],\n                ipProtocols: ["TCP"],\n                destinationPorts: ["*"],\n              },\n            ],\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      firewallPolicy: "myFirewallPolicy",\n    }),\n  },\n];\n\n')),(0,o.kt)("h3",{id:"create-firewallpolicyrulegroup-with-ipgroups"},"Create FirewallPolicyRuleGroup With IpGroups"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FirewallPolicyRuleGroup",\n    group: "Network",\n    name: "myFirewallPolicyRuleGroup",\n    properties: () => ({\n      properties: {\n        priority: 110,\n        rules: [\n          {\n            ruleType: "FirewallPolicyFilterRule",\n            name: "Example-Filter-Rule",\n            action: { type: "Deny" },\n            ruleConditions: [\n              {\n                ruleConditionType: "NetworkRuleCondition",\n                name: "network-condition1",\n                ipProtocols: ["TCP"],\n                destinationPorts: ["*"],\n                sourceIpGroups: [\n                  "/subscriptions/subid/providers/Microsoft.Network/resourceGroup/rg1/ipGroups/ipGroups1",\n                ],\n                destinationIpGroups: [\n                  "/subscriptions/subid/providers/Microsoft.Network/resourceGroup/rg1/ipGroups/ipGroups2",\n                ],\n              },\n            ],\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      firewallPolicy: "myFirewallPolicy",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/FirewallPolicy"},"FirewallPolicy"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'The properties of the firewall policy rule group.',\n      properties: {\n        priority: {\n          type: 'integer',\n          format: 'int32',\n          maximum: 65000,\n          exclusiveMaximum: false,\n          minimum: 100,\n          exclusiveMinimum: false,\n          description: 'Priority of the Firewall Policy Rule Group resource.'\n        },\n        rules: {\n          type: 'array',\n          items: {\n            description: 'Properties of the rule.',\n            discriminator: 'ruleType',\n            required: [ 'ruleType' ],\n            properties: {\n              ruleType: {\n                type: 'string',\n                description: 'The type of the rule.',\n                enum: [ 'FirewallPolicyNatRule', 'FirewallPolicyFilterRule' ],\n                'x-ms-enum': { name: 'FirewallPolicyRuleType', modelAsString: true }\n              },\n              name: { type: 'string', description: 'The name of the rule.' },\n              priority: {\n                type: 'integer',\n                format: 'int32',\n                maximum: 65000,\n                exclusiveMaximum: false,\n                minimum: 100,\n                exclusiveMinimum: false,\n                description: 'Priority of the Firewall Policy Rule resource.'\n              }\n            }\n          },\n          description: 'Group of Firewall Policy rules.'\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the firewall policy rule group resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    },\n    type: { type: 'string', readOnly: true, description: 'Rule Group type.' }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Rule Group resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2020-04-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2020-04-01/firewallPolicy.json"},"here"),"."))}y.isMDXComponent=!0}}]);