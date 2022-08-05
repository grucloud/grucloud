"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[33747],{3905:(e,n,r)=>{r.d(n,{Zo:()=>u,kt:()=>m});var t=r(67294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function o(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function s(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?o(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)r=o[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var p=t.createContext({}),c=function(e){var n=t.useContext(p),r=n;return e&&(r="function"==typeof e?e(n):s(s({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(p.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},l=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),l=c(r),m=i,y=l["".concat(p,".").concat(m)]||l[m]||d[m]||o;return r?t.createElement(y,s(s({ref:n},u),{},{components:r})):t.createElement(y,s({ref:n},u))}));function m(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=r.length,s=new Array(o);s[0]=l;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var c=2;c<o;c++)s[c]=r[c];return t.createElement.apply(null,s)}return t.createElement.apply(null,r)}l.displayName="MDXCreateElement"},83452:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>p,contentTitle:()=>s,default:()=>d,frontMatter:()=>o,metadata:()=>a,toc:()=>c});var t=r(87462),i=(r(67294),r(3905));const o={id:"AppServiceEnvironment",title:"AppServiceEnvironment"},s=void 0,a={unversionedId:"azure/resources/Web/AppServiceEnvironment",id:"azure/resources/Web/AppServiceEnvironment",title:"AppServiceEnvironment",description:"Provides a AppServiceEnvironment from the Web group",source:"@site/docs/azure/resources/Web/AppServiceEnvironment.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/AppServiceEnvironment",permalink:"/docs/azure/resources/Web/AppServiceEnvironment",draft:!1,tags:[],version:"current",frontMatter:{id:"AppServiceEnvironment",title:"AppServiceEnvironment"},sidebar:"docs",previous:{title:"TableService",permalink:"/docs/azure/resources/Storage/TableService"},next:{title:"AppServiceEnvironmentAseCustomDnsSuffixConfiguration",permalink:"/docs/azure/resources/Web/AppServiceEnvironmentAseCustomDnsSuffixConfiguration"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Create or update an App Service Environment.",id:"create-or-update-an-app-service-environment",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c};function d(e){let{components:n,...r}=e;return(0,i.kt)("wrapper",(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"AppServiceEnvironment")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-or-update-an-app-service-environment"},"Create or update an App Service Environment."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "AppServiceEnvironment",\n    group: "Web",\n    name: "myAppServiceEnvironment",\n    properties: () => ({\n      kind: "Asev3",\n      location: "South Central US",\n      properties: {\n        virtualNetwork: {\n          id: "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourceGroups/test-rg/providers/Microsoft.Network/virtualNetworks/test-vnet/subnets/delegated",\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      virtualNetwork: "myVirtualNetwork",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualNetwork"},"VirtualNetwork"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'App Service Environment ARM resource.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure resource. This resource is tracked in Azure Resource Manager',\n      required: [ 'location' ],\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        location: { description: 'Resource Location.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        },\n        tags: {\n          description: 'Resource tags.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Core resource properties',\n      type: 'object',\n      'x-ms-client-flatten': true,\n      required: [ 'virtualNetwork' ],\n      properties: {\n        provisioningState: {\n          description: 'Provisioning state of the App Service Environment.',\n          enum: [\n            'Succeeded',\n            'Failed',\n            'Canceled',\n            'InProgress',\n            'Deleting'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }\n        },\n        status: {\n          description: 'Current status of the App Service Environment.',\n          enum: [ 'Preparing', 'Ready', 'Scaling', 'Deleting' ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'HostingEnvironmentStatus', modelAsString: false }\n        },\n        virtualNetwork: {\n          description: 'Description of the Virtual Network.',\n          required: [ 'id' ],\n          type: 'object',\n          properties: {\n            id: {\n              description: 'Resource id of the Virtual Network.',\n              type: 'string'\n            },\n            name: {\n              description: 'Name of the Virtual Network (read-only).',\n              type: 'string',\n              readOnly: true\n            },\n            type: {\n              description: 'Resource type of the Virtual Network (read-only).',\n              type: 'string',\n              readOnly: true\n            },\n            subnet: {\n              description: 'Subnet within the Virtual Network.',\n              type: 'string'\n            }\n          }\n        },\n        internalLoadBalancingMode: {\n          description: 'Specifies which endpoints to serve internally in the Virtual Network for the App Service Environment.',\n          enum: [ 'None', 'Web', 'Publishing', 'Web, Publishing' ],\n          type: 'string',\n          'x-ms-enum': { name: 'LoadBalancingMode', modelAsString: true }\n        },\n        multiSize: {\n          description: 'Front-end VM size, e.g. \"Medium\", \"Large\".',\n          type: 'string'\n        },\n        multiRoleCount: {\n          format: 'int32',\n          description: 'Number of front-end instances.',\n          type: 'integer',\n          readOnly: true\n        },\n        ipsslAddressCount: {\n          format: 'int32',\n          description: 'Number of IP SSL addresses reserved for the App Service Environment.',\n          type: 'integer'\n        },\n        dnsSuffix: {\n          description: 'DNS suffix of the App Service Environment.',\n          type: 'string'\n        },\n        maximumNumberOfMachines: {\n          format: 'int32',\n          description: 'Maximum number of VMs in the App Service Environment.',\n          type: 'integer',\n          readOnly: true\n        },\n        frontEndScaleFactor: {\n          format: 'int32',\n          description: 'Scale factor for front-ends.',\n          type: 'integer'\n        },\n        suspended: {\n          description: '<code>true</code> if the App Service Environment is suspended; otherwise, <code>false</code>. The environment can be suspended, e.g. when the management endpoint is no longer available\\n' +\n            ' (most likely because NSG blocked the incoming traffic).',\n          type: 'boolean',\n          readOnly: true\n        },\n        clusterSettings: {\n          description: 'Custom settings for changing the behavior of the App Service Environment.',\n          type: 'array',\n          items: {\n            description: 'Name value pair.',\n            type: 'object',\n            properties: {\n              name: { description: 'Pair name.', type: 'string' },\n              value: { description: 'Pair value.', type: 'string' }\n            }\n          },\n          'x-ms-identifiers': [ 'name' ]\n        },\n        userWhitelistedIpRanges: {\n          description: 'User added ip ranges to whitelist on ASE db',\n          type: 'array',\n          items: { type: 'string' }\n        },\n        hasLinuxWorkers: {\n          description: 'Flag that displays whether an ASE has linux workers or not',\n          type: 'boolean',\n          readOnly: true\n        },\n        upgradePreference: {\n          description: 'Upgrade Preference',\n          default: 'None',\n          enum: [ 'None', 'Early', 'Late', 'Manual' ],\n          type: 'string',\n          'x-ms-enum': {\n            name: 'UpgradePreference',\n            modelAsString: true,\n            values: [\n              {\n                value: 'None',\n                description: 'No preference on when this App Service Environment will be upgraded'\n              },\n              {\n                value: 'Early',\n                description: \"This App Service Environment will be upgraded before others in the same region that have Upgrade Preference 'Late'\"\n              },\n              {\n                value: 'Late',\n                description: \"This App Service Environment will be upgraded after others in the same region that have Upgrade Preference 'Early'\"\n              },\n              {\n                value: 'Manual',\n                description: 'ASEv3 only. Once an upgrade is available, this App Service Environment will wait 10 days for the upgrade to be manually initiated. After 10 days the upgrade will begin automatically'\n              }\n            ]\n          }\n        },\n        dedicatedHostCount: {\n          format: 'int32',\n          description: 'Dedicated Host Count',\n          type: 'integer'\n        },\n        zoneRedundant: {\n          description: 'Whether or not this App Service Environment is zone-redundant.',\n          type: 'boolean'\n        },\n        customDnsSuffixConfiguration: {\n          description: 'Full view of the custom domain suffix configuration for ASEv3.',\n          type: 'object',\n          allOf: [\n            {\n              description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n              type: 'object',\n              properties: {\n                id: {\n                  description: 'Resource Id.',\n                  type: 'string',\n                  readOnly: true\n                },\n                name: {\n                  description: 'Resource Name.',\n                  type: 'string',\n                  readOnly: true\n                },\n                kind: { description: 'Kind of resource.', type: 'string' },\n                type: {\n                  description: 'Resource type.',\n                  type: 'string',\n                  readOnly: true\n                }\n              },\n              'x-ms-azure-resource': true\n            }\n          ],\n          properties: {\n            properties: {\n              description: 'CustomDnsSuffixConfiguration resource specific properties',\n              type: 'object',\n              properties: {\n                provisioningState: {\n                  enum: [ 'Succeeded', 'Failed', 'Degraded', 'InProgress' ],\n                  type: 'string',\n                  readOnly: true,\n                  'x-ms-enum': {\n                    name: 'CustomDnsSuffixProvisioningState',\n                    modelAsString: false\n                  }\n                },\n                provisioningDetails: { type: 'string', readOnly: true },\n                dnsSuffix: {\n                  description: 'The default custom domain suffix to use for all sites deployed on the ASE.',\n                  type: 'string'\n                },\n                certificateUrl: {\n                  description: 'The URL referencing the Azure Key Vault certificate secret that should be used as the default SSL/TLS certificate for sites with the custom domain suffix.',\n                  type: 'string'\n                },\n                keyVaultReferenceIdentity: {\n                  description: 'The user-assigned identity to use for resolving the key vault certificate reference. If not specified, the system-assigned ASE identity will be used if available.',\n                  type: 'string'\n                }\n              },\n              'x-ms-client-flatten': true\n            }\n          }\n        },\n        networkingConfiguration: {\n          description: 'Full view of networking configuration for an ASE.',\n          type: 'object',\n          allOf: [\n            {\n              description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n              type: 'object',\n              properties: {\n                id: {\n                  description: 'Resource Id.',\n                  type: 'string',\n                  readOnly: true\n                },\n                name: {\n                  description: 'Resource Name.',\n                  type: 'string',\n                  readOnly: true\n                },\n                kind: { description: 'Kind of resource.', type: 'string' },\n                type: {\n                  description: 'Resource type.',\n                  type: 'string',\n                  readOnly: true\n                }\n              },\n              'x-ms-azure-resource': true\n            }\n          ],\n          properties: {\n            properties: {\n              description: 'AseV3NetworkingConfiguration resource specific properties',\n              type: 'object',\n              properties: {\n                windowsOutboundIpAddresses: {\n                  type: 'array',\n                  items: { type: 'string' },\n                  readOnly: true\n                },\n                linuxOutboundIpAddresses: {\n                  type: 'array',\n                  items: { type: 'string' },\n                  readOnly: true\n                },\n                externalInboundIpAddresses: {\n                  type: 'array',\n                  items: { type: 'string' },\n                  readOnly: true\n                },\n                internalInboundIpAddresses: {\n                  type: 'array',\n                  items: { type: 'string' },\n                  readOnly: true\n                },\n                allowNewPrivateEndpointConnections: {\n                  description: 'Property to enable and disable new private endpoint connection creation on ASE',\n                  type: 'boolean'\n                },\n                ftpEnabled: {\n                  description: 'Property to enable and disable FTP on ASEV3',\n                  type: 'boolean'\n                },\n                remoteDebugEnabled: {\n                  description: 'Property to enable and disable Remote Debug on ASEV3',\n                  type: 'boolean'\n                },\n                inboundIpAddressOverride: {\n                  description: 'Customer provided Inbound IP Address. Only able to be set on Ase create.',\n                  type: 'string'\n                }\n              },\n              'x-ms-client-flatten': true\n            }\n          }\n        },\n        upgradeAvailability: {\n          description: 'Whether an upgrade is available for this App Service Environment.',\n          enum: [ 'None', 'Ready' ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': {\n            name: 'UpgradeAvailability',\n            modelAsString: true,\n            values: [\n              {\n                value: 'None',\n                description: 'No upgrade is currently available for this App Service Environment'\n              },\n              {\n                value: 'Ready',\n                description: 'An upgrade is ready to be manually initiated on this App Service Environment'\n              }\n            ]\n          }\n        }\n      }\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/AppServiceEnvironments.json"},"here"),"."))}d.isMDXComponent=!0}}]);