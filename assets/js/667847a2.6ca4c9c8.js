"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[78443],{3905:function(e,r,n){n.d(r,{Zo:function(){return s},kt:function(){return d}});var t=n(67294);function o(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function i(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function u(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?i(Object(n),!0).forEach((function(r){o(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function a(e,r){if(null==e)return{};var n,t,o=function(e,r){if(null==e)return{};var n,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||(o[n]=e[n]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var p=t.createContext({}),c=function(e){var r=t.useContext(p),n=r;return e&&(n="function"==typeof e?e(r):u(u({},r),e)),n},s=function(e){var r=c(e.components);return t.createElement(p.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},f=t.forwardRef((function(e,r){var n=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),f=c(n),d=o,y=f["".concat(p,".").concat(d)]||f[d]||l[d]||i;return n?t.createElement(y,u(u({ref:r},s),{},{components:n})):t.createElement(y,u({ref:r},s))}));function d(e,r){var n=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=n.length,u=new Array(i);u[0]=f;var a={};for(var p in r)hasOwnProperty.call(r,p)&&(a[p]=r[p]);a.originalType=e,a.mdxType="string"==typeof e?e:o,u[1]=a;for(var c=2;c<i;c++)u[c]=n[c];return t.createElement.apply(null,u)}return t.createElement.apply(null,n)}f.displayName="MDXCreateElement"},79380:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return c},toc:function(){return s},default:function(){return f}});var t=n(87462),o=n(63366),i=(n(67294),n(3905)),u=["components"],a={id:"ConfigurationPolicyGroup",title:"ConfigurationPolicyGroup"},p=void 0,c={unversionedId:"azure/resources/Network/ConfigurationPolicyGroup",id:"azure/resources/Network/ConfigurationPolicyGroup",isDocsHomePage:!1,title:"ConfigurationPolicyGroup",description:"Provides a ConfigurationPolicyGroup from the Network group",source:"@site/docs/azure/resources/Network/ConfigurationPolicyGroup.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/ConfigurationPolicyGroup",permalink:"/docs/azure/resources/Network/ConfigurationPolicyGroup",tags:[],version:"current",frontMatter:{id:"ConfigurationPolicyGroup",title:"ConfigurationPolicyGroup"},sidebar:"docs",previous:{title:"BastionHost",permalink:"/docs/azure/resources/Network/BastionHost"},next:{title:"ConnectionMonitor",permalink:"/docs/azure/resources/Network/ConnectionMonitor"}},s=[{value:"Examples",id:"examples",children:[{value:"ConfigurationPolicyGroupPut",id:"configurationpolicygroupput",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:s};function f(e){var r=e.components,n=(0,o.Z)(e,u);return(0,i.kt)("wrapper",(0,t.Z)({},l,n,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"ConfigurationPolicyGroup")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"configurationpolicygroupput"},"ConfigurationPolicyGroupPut"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ConfigurationPolicyGroup",\n    group: "Network",\n    name: "myConfigurationPolicyGroup",\n    properties: () => ({\n      properties: {\n        isDefault: true,\n        priority: 0,\n        policyMembers: [\n          {\n            name: "policy1",\n            attributeType: "RadiusAzureGroupId",\n            attributeValue: "6ad1bd08",\n          },\n          {\n            name: "policy2",\n            attributeType: "CertificateGroupId",\n            attributeValue: "red.com",\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vpnServerConfiguration: "myVpnServerConfiguration",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VpnServerConfiguration"},"VpnServerConfiguration"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the VpnServerConfigurationPolicyGroup.',\n      type: 'object',\n      properties: {\n        isDefault: {\n          type: 'boolean',\n          description: 'Shows if this is a Default VpnServerConfigurationPolicyGroup or not.'\n        },\n        priority: {\n          type: 'integer',\n          format: 'int32',\n          description: 'Priority for VpnServerConfigurationPolicyGroup.'\n        },\n        policyMembers: {\n          type: 'array',\n          items: {\n            properties: {\n              name: {\n                type: 'string',\n                description: 'Name of the VpnServerConfigurationPolicyGroupMember.'\n              },\n              attributeType: {\n                type: 'string',\n                description: 'The Vpn Policy member attribute type.',\n                enum: [\n                  'CertificateGroupId',\n                  'AADGroupId',\n                  'RadiusAzureGroupId'\n                ],\n                'x-ms-enum': {\n                  name: 'VpnPolicyMemberAttributeType',\n                  modelAsString: true\n                }\n              },\n              attributeValue: {\n                type: 'string',\n                description: 'The value of Attribute used for this VpnServerConfigurationPolicyGroupMember.'\n              }\n            },\n            description: 'VpnServerConfiguration PolicyGroup member',\n            type: 'object'\n          },\n          description: 'Multiple PolicyMembers for VpnServerConfigurationPolicyGroup.',\n          'x-ms-identifiers': []\n        },\n        p2SConnectionConfigurations: {\n          type: 'array',\n          readOnly: true,\n          items: {\n            properties: { id: { type: 'string', description: 'Resource ID.' } },\n            description: 'Reference to another subresource.',\n            'x-ms-azure-resource': true\n          },\n          description: 'List of references to P2SConnectionConfigurations.'\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the VpnServerConfigurationPolicyGroup resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    type: { readOnly: true, type: 'string', description: 'Resource type.' }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'VpnServerConfigurationPolicyGroup Resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/virtualWan.json"},"here"),"."))}f.isMDXComponent=!0}}]);