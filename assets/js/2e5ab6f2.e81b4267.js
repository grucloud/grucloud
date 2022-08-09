"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[62030],{3905:(e,n,r)=>{r.d(n,{Zo:()=>u,kt:()=>m});var t=r(67294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function s(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?s(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):s(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},s=Object.keys(e);for(t=0;t<s.length;t++)r=s[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(t=0;t<s.length;t++)r=s[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=t.createContext({}),c=function(e){var n=t.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(p.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,s=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=c(r),m=i,f=d["".concat(p,".").concat(m)]||d[m]||l[m]||s;return r?t.createElement(f,o(o({ref:n},u),{},{components:r})):t.createElement(f,o({ref:n},u))}));function m(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var s=r.length,o=new Array(s);o[0]=d;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var c=2;c<s;c++)o[c]=r[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},71364:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>p,contentTitle:()=>o,default:()=>l,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var t=r(87462),i=(r(67294),r(3905));const s={id:"PublicIPPrefix",title:"PublicIPPrefix"},o=void 0,a={unversionedId:"azure/resources/Network/PublicIPPrefix",id:"azure/resources/Network/PublicIPPrefix",title:"PublicIPPrefix",description:"Provides a PublicIPPrefix from the Network group",source:"@site/docs/azure/resources/Network/PublicIPPrefix.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/PublicIPPrefix",permalink:"/docs/azure/resources/Network/PublicIPPrefix",draft:!1,tags:[],version:"current",frontMatter:{id:"PublicIPPrefix",title:"PublicIPPrefix"},sidebar:"docs",previous:{title:"PublicIPAddress",permalink:"/docs/azure/resources/Network/PublicIPAddress"},next:{title:"Route",permalink:"/docs/azure/resources/Network/Route"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Create public IP prefix defaults",id:"create-public-ip-prefix-defaults",level:3},{value:"Create public IP prefix allocation method",id:"create-public-ip-prefix-allocation-method",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c};function l(e){let{components:n,...r}=e;return(0,i.kt)("wrapper",(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"PublicIPPrefix")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-public-ip-prefix-defaults"},"Create public IP prefix defaults"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PublicIPPrefix",\n    group: "Network",\n    name: "myPublicIPPrefix",\n    properties: () => ({\n      location: "westus",\n      properties: { prefixLength: 30 },\n      sku: { name: "Standard" },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      loadBalancer: "myLoadBalancer",\n      customIpPrefix: "myCustomIPPrefix",\n      natGateway: "myNatGateway",\n      publicIpAddresses: ["myPublicIPAddress"],\n    }),\n  },\n];\n\n')),(0,i.kt)("h3",{id:"create-public-ip-prefix-allocation-method"},"Create public IP prefix allocation method"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PublicIPPrefix",\n    group: "Network",\n    name: "myPublicIPPrefix",\n    properties: () => ["1"],\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      loadBalancer: "myLoadBalancer",\n      customIpPrefix: "myCustomIPPrefix",\n      natGateway: "myNatGateway",\n      publicIpAddresses: ["myPublicIPAddress"],\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/LoadBalancer"},"LoadBalancer")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/CustomIPPrefix"},"CustomIPPrefix")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/NatGateway"},"NatGateway")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/PublicIPAddress"},"PublicIPAddress"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    extendedLocation: {\n      description: 'The extended location of the public ip address.',\n      properties: {\n        name: {\n          type: 'string',\n          description: 'The name of the extended location.'\n        },\n        type: {\n          description: 'The type of the extended location.',\n          type: 'string',\n          enum: [ 'EdgeZone' ],\n          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }\n        }\n      }\n    },\n    sku: {\n      description: 'The public IP prefix SKU.',\n      properties: {\n        name: {\n          type: 'string',\n          description: 'Name of a public IP prefix SKU.',\n          enum: [ 'Standard' ],\n          'x-ms-enum': { name: 'PublicIPPrefixSkuName', modelAsString: true }\n        },\n        tier: {\n          type: 'string',\n          description: 'Tier of a public IP prefix SKU.',\n          enum: [ 'Regional', 'Global' ],\n          'x-ms-enum': { name: 'PublicIPPrefixSkuTier', modelAsString: true }\n        }\n      }\n    },\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Public IP prefix properties.',\n      properties: {\n        publicIPAddressVersion: {\n          description: 'The public IP address version.',\n          type: 'string',\n          enum: [ 'IPv4', 'IPv6' ],\n          'x-ms-enum': { name: 'IPVersion', modelAsString: true }\n        },\n        ipTags: {\n          type: 'array',\n          items: {\n            properties: {\n              ipTagType: {\n                type: 'string',\n                description: 'The IP tag type. Example: FirstPartyUsage.'\n              },\n              tag: {\n                type: 'string',\n                description: 'The value of the IP tag associated with the public IP. Example: SQL.'\n              }\n            },\n            description: 'Contains the IpTag associated with the object.'\n          },\n          description: 'The list of tags associated with the public IP prefix.'\n        },\n        prefixLength: {\n          type: 'integer',\n          format: 'int32',\n          description: 'The Length of the Public IP Prefix.'\n        },\n        ipPrefix: {\n          readOnly: true,\n          type: 'string',\n          description: 'The allocated Prefix.'\n        },\n        publicIPAddresses: {\n          readOnly: true,\n          type: 'array',\n          items: {\n            properties: {\n              id: {\n                type: 'string',\n                description: 'The PublicIPAddress Reference.'\n              }\n            },\n            description: 'Reference to a public IP address.'\n          },\n          description: 'The list of all referenced PublicIPAddresses.'\n        },\n        loadBalancerFrontendIpConfiguration: {\n          readOnly: true,\n          description: 'The reference to load balancer frontend IP configuration associated with the public IP prefix.',\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          'x-ms-azure-resource': true\n        },\n        customIPPrefix: {\n          description: 'The customIpPrefix that this prefix is associated with.',\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          'x-ms-azure-resource': true\n        },\n        resourceGuid: {\n          readOnly: true,\n          type: 'string',\n          description: 'The resource GUID property of the public IP prefix resource.'\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the public IP prefix resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        natGateway: {\n          description: 'NatGateway of Public IP Prefix.',\n          properties: {\n            sku: {\n              description: 'The nat gateway SKU.',\n              properties: {\n                name: {\n                  type: 'string',\n                  description: 'Name of Nat Gateway SKU.',\n                  enum: [ 'Standard' ],\n                  'x-ms-enum': { name: 'NatGatewaySkuName', modelAsString: true }\n                }\n              }\n            },\n            properties: {\n              'x-ms-client-flatten': true,\n              description: 'Nat Gateway properties.',\n              properties: {\n                idleTimeoutInMinutes: {\n                  type: 'integer',\n                  format: 'int32',\n                  description: 'The idle timeout of the nat gateway.'\n                },\n                publicIpAddresses: {\n                  type: 'array',\n                  items: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  },\n                  description: 'An array of public ip addresses associated with the nat gateway resource.'\n                },\n                publicIpPrefixes: {\n                  type: 'array',\n                  items: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  },\n                  description: 'An array of public ip prefixes associated with the nat gateway resource.'\n                },\n                subnets: {\n                  readOnly: true,\n                  type: 'array',\n                  items: {\n                    properties: {\n                      id: { type: 'string', description: 'Resource ID.' }\n                    },\n                    description: 'Reference to another subresource.',\n                    'x-ms-azure-resource': true\n                  },\n                  description: 'An array of references to the subnets using this nat gateway resource.'\n                },\n                resourceGuid: {\n                  readOnly: true,\n                  type: 'string',\n                  description: 'The resource GUID property of the NAT gateway resource.'\n                },\n                provisioningState: {\n                  readOnly: true,\n                  description: 'The provisioning state of the NAT gateway resource.',\n                  type: 'string',\n                  enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n                  'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                }\n              }\n            },\n            zones: {\n              type: 'array',\n              items: { type: 'string' },\n              description: 'A list of availability zones denoting the zone in which Nat Gateway should be deployed.'\n            },\n            etag: {\n              readOnly: true,\n              type: 'string',\n              description: 'A unique read-only string that changes whenever the resource is updated.'\n            }\n          },\n          allOf: [\n            {\n              properties: {\n                id: { type: 'string', description: 'Resource ID.' },\n                name: {\n                  readOnly: true,\n                  type: 'string',\n                  description: 'Resource name.'\n                },\n                type: {\n                  readOnly: true,\n                  type: 'string',\n                  description: 'Resource type.'\n                },\n                location: { type: 'string', description: 'Resource location.' },\n                tags: {\n                  type: 'object',\n                  additionalProperties: { type: 'string' },\n                  description: 'Resource tags.'\n                }\n              },\n              description: 'Common resource representation.',\n              'x-ms-azure-resource': true\n            }\n          ]\n        }\n      }\n    },\n    etag: {\n      readOnly: true,\n      type: 'string',\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    },\n    zones: {\n      type: 'array',\n      items: { type: 'string' },\n      description: 'A list of availability zones denoting the IP allocated for the resource needs to come from.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Public IP prefix resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-01-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/publicIpPrefix.json"},"here"),"."))}l.isMDXComponent=!0}}]);