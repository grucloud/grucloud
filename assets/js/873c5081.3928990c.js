"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[68701],{3905:(n,e,r)=>{r.d(e,{Zo:()=>_,kt:()=>u});var t=r(67294);function a(n,e,r){return e in n?Object.defineProperty(n,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[e]=r,n}function i(n,e){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(n);e&&(t=t.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),r.push.apply(r,t)}return r}function o(n){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?i(Object(r),!0).forEach((function(e){a(n,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(r,e))}))}return n}function d(n,e){if(null==n)return{};var r,t,a=function(n,e){if(null==n)return{};var r,t,a={},i=Object.keys(n);for(t=0;t<i.length;t++)r=i[t],e.indexOf(r)>=0||(a[r]=n[r]);return a}(n,e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(n);for(t=0;t<i.length;t++)r=i[t],e.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(n,r)&&(a[r]=n[r])}return a}var s=t.createContext({}),c=function(n){var e=t.useContext(s),r=e;return n&&(r="function"==typeof n?n(e):o(o({},e),n)),r},_=function(n){var e=c(n.components);return t.createElement(s.Provider,{value:e},n.children)},S={inlineCode:"code",wrapper:function(n){var e=n.children;return t.createElement(t.Fragment,{},e)}},p=t.forwardRef((function(n,e){var r=n.components,a=n.mdxType,i=n.originalType,s=n.parentName,_=d(n,["components","mdxType","originalType","parentName"]),p=c(r),u=a,m=p["".concat(s,".").concat(u)]||p[u]||S[u]||i;return r?t.createElement(m,o(o({ref:e},_),{},{components:r})):t.createElement(m,o({ref:e},_))}));function u(n,e){var r=arguments,a=e&&e.mdxType;if("string"==typeof n||a){var i=r.length,o=new Array(i);o[0]=p;var d={};for(var s in e)hasOwnProperty.call(e,s)&&(d[s]=e[s]);d.originalType=n,d.mdxType="string"==typeof n?n:a,o[1]=d;for(var c=2;c<i;c++)o[c]=r[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}p.displayName="MDXCreateElement"},36209:(n,e,r)=>{r.r(e),r.d(e,{assets:()=>s,contentTitle:()=>o,default:()=>S,frontMatter:()=>i,metadata:()=>d,toc:()=>c});var t=r(87462),a=(r(67294),r(3905));const i={id:"ContainerService",title:"ContainerService"},o=void 0,d={unversionedId:"azure/resources/ContainerService/ContainerService",id:"azure/resources/ContainerService/ContainerService",title:"ContainerService",description:"Provides a ContainerService from the ContainerService group",source:"@site/docs/azure/resources/ContainerService/ContainerService.md",sourceDirName:"azure/resources/ContainerService",slug:"/azure/resources/ContainerService/",permalink:"/docs/azure/resources/ContainerService/",draft:!1,tags:[],version:"current",frontMatter:{id:"ContainerService",title:"ContainerService"},sidebar:"docs",previous:{title:"Webhook",permalink:"/docs/azure/resources/ContainerRegistry/Webhook"},next:{title:"AgentPool",permalink:"/docs/azure/resources/ContainerService/AgentPool"}},s={},c=[{value:"Examples",id:"examples",level:2},{value:"Create/Update Container Service",id:"createupdate-container-service",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],_={toc:c};function S(n){let{components:e,...r}=n;return(0,a.kt)("wrapper",(0,t.Z)({},_,r,{components:e,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"ContainerService")," from the ",(0,a.kt)("strong",{parentName:"p"},"ContainerService")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"createupdate-container-service"},"Create/Update Container Service"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ContainerService",\n    group: "ContainerService",\n    name: "myContainerService",\n    properties: () => ({ location: "location1" }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vault: "myVault",\n      sshPublicKeys: ["mySshPublicKey"],\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/KeyVault/Vault"},"Vault")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Compute/SshPublicKey"},"SshPublicKey"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: {\n          type: 'string',\n          description: 'Resource location',\n          'x-ms-mutability': [ 'read', 'create' ]\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    },\n    {\n      properties: {\n        properties: {\n          description: 'Properties of the container service.',\n          'x-ms-client-flatten': true,\n          properties: {\n            provisioningState: {\n              readOnly: true,\n              type: 'string',\n              description: 'The current deployment or provisioning state, which only appears in the response.'\n            },\n            orchestratorProfile: {\n              description: 'Profile for the container service orchestrator.',\n              properties: {\n                orchestratorType: {\n                  type: 'string',\n                  enum: [\n                    'Kubernetes',\n                    'Swarm',\n                    'DCOS',\n                    'DockerCE',\n                    'Custom'\n                  ],\n                  'x-ms-enum': {\n                    name: 'ContainerServiceOrchestratorTypes',\n                    modelAsString: true\n                  },\n                  description: 'The orchestrator to use to manage container service cluster resources. Valid values are Kubernetes, Swarm, DCOS, DockerCE and Custom.'\n                },\n                orchestratorVersion: {\n                  type: 'string',\n                  description: 'The version of the orchestrator to use. You can specify the major.minor.patch part of the actual version.For example, you can specify version as \"1.6.11\".'\n                }\n              },\n              required: [ 'orchestratorType' ]\n            },\n            customProfile: {\n              description: 'Properties to configure a custom container service cluster.',\n              properties: {\n                orchestrator: {\n                  type: 'string',\n                  description: 'The name of the custom orchestrator to use.'\n                }\n              },\n              required: [ 'orchestrator' ]\n            },\n            servicePrincipalProfile: {\n              description: 'Information about a service principal identity for the cluster to use for manipulating Azure APIs. Exact one of secret or keyVaultSecretRef need to be specified.',\n              properties: {\n                clientId: {\n                  type: 'string',\n                  description: 'The ID for the service principal.'\n                },\n                secret: {\n                  type: 'string',\n                  description: 'The secret password associated with the service principal in plain text.'\n                },\n                keyVaultSecretRef: {\n                  description: 'Reference to a secret stored in Azure Key Vault.',\n                  properties: {\n                    vaultID: {\n                      type: 'string',\n                      description: 'Key vault identifier.'\n                    },\n                    secretName: { type: 'string', description: 'The secret name.' },\n                    version: {\n                      type: 'string',\n                      description: 'The secret version.'\n                    }\n                  },\n                  required: [ 'vaultID', 'secretName' ]\n                }\n              },\n              required: [ 'clientId' ]\n            },\n            masterProfile: {\n              description: 'Profile for the container service master.',\n              properties: {\n                count: {\n                  type: 'integer',\n                  format: 'int32',\n                  enum: [ 1, 3, 5 ],\n                  'x-ms-enum': { name: 'Count', modelAsString: false },\n                  description: 'Number of masters (VMs) in the container service cluster. Allowed values are 1, 3, and 5. The default value is 1.',\n                  default: 1\n                },\n                dnsPrefix: {\n                  type: 'string',\n                  description: 'DNS prefix to be used to create the FQDN for the master pool.'\n                },\n                vmSize: {\n                  description: 'Size of agent VMs.',\n                  type: 'string',\n                  'x-ms-enum': {\n                    name: 'ContainerServiceVMSizeTypes',\n                    modelAsString: true\n                  },\n                  enum: [\n                    'Standard_A1',\n                    'Standard_A10',\n                    'Standard_A11',\n                    'Standard_A1_v2',\n                    'Standard_A2',\n                    'Standard_A2_v2',\n                    'Standard_A2m_v2',\n                    'Standard_A3',\n                    'Standard_A4',\n                    'Standard_A4_v2',\n                    'Standard_A4m_v2',\n                    'Standard_A5',\n                    'Standard_A6',\n                    'Standard_A7',\n                    'Standard_A8',\n                    'Standard_A8_v2',\n                    'Standard_A8m_v2',\n                    'Standard_A9',\n                    'Standard_B2ms',\n                    'Standard_B2s',\n                    'Standard_B4ms',\n                    'Standard_B8ms',\n                    'Standard_D1',\n                    'Standard_D11',\n                    'Standard_D11_v2',\n                    'Standard_D11_v2_Promo',\n                    'Standard_D12',\n                    'Standard_D12_v2',\n                    'Standard_D12_v2_Promo',\n                    'Standard_D13',\n                    'Standard_D13_v2',\n                    'Standard_D13_v2_Promo',\n                    'Standard_D14',\n                    'Standard_D14_v2',\n                    'Standard_D14_v2_Promo',\n                    'Standard_D15_v2',\n                    'Standard_D16_v3',\n                    'Standard_D16s_v3',\n                    'Standard_D1_v2',\n                    'Standard_D2',\n                    'Standard_D2_v2',\n                    'Standard_D2_v2_Promo',\n                    'Standard_D2_v3',\n                    'Standard_D2s_v3',\n                    'Standard_D3',\n                    'Standard_D32_v3',\n                    'Standard_D32s_v3',\n                    'Standard_D3_v2',\n                    'Standard_D3_v2_Promo',\n                    'Standard_D4',\n                    'Standard_D4_v2',\n                    'Standard_D4_v2_Promo',\n                    'Standard_D4_v3',\n                    'Standard_D4s_v3',\n                    'Standard_D5_v2',\n                    'Standard_D5_v2_Promo',\n                    'Standard_D64_v3',\n                    'Standard_D64s_v3',\n                    'Standard_D8_v3',\n                    'Standard_D8s_v3',\n                    'Standard_DS1',\n                    'Standard_DS11',\n                    'Standard_DS11_v2',\n                    'Standard_DS11_v2_Promo',\n                    'Standard_DS12',\n                    'Standard_DS12_v2',\n                    'Standard_DS12_v2_Promo',\n                    'Standard_DS13',\n                    'Standard_DS13-2_v2',\n                    'Standard_DS13-4_v2',\n                    'Standard_DS13_v2',\n                    'Standard_DS13_v2_Promo',\n                    'Standard_DS14',\n                    'Standard_DS14-4_v2',\n                    'Standard_DS14-8_v2',\n                    'Standard_DS14_v2',\n                    'Standard_DS14_v2_Promo',\n                    'Standard_DS15_v2',\n                    'Standard_DS1_v2',\n                    'Standard_DS2',\n                    'Standard_DS2_v2',\n                    'Standard_DS2_v2_Promo',\n                    'Standard_DS3',\n                    'Standard_DS3_v2',\n                    'Standard_DS3_v2_Promo',\n                    'Standard_DS4',\n                    'Standard_DS4_v2',\n                    'Standard_DS4_v2_Promo',\n                    'Standard_DS5_v2',\n                    'Standard_DS5_v2_Promo',\n                    'Standard_E16_v3',\n                    'Standard_E16s_v3',\n                    'Standard_E2_v3',\n                    'Standard_E2s_v3',\n                    'Standard_E32-16s_v3',\n                    'Standard_E32-8s_v3',\n                    'Standard_E32_v3',\n                    'Standard_E32s_v3',\n                    'Standard_E4_v3',\n                    'Standard_E4s_v3',\n                    ... 74 more items\n                  ]\n                },\n                osDiskSizeGB: {\n                  description: 'OS Disk Size in GB to be used to specify the disk size for every machine in this master/agent pool. If you specify 0, it will apply the default osDisk size according to the vmSize specified.',\n                  type: 'integer',\n                  format: 'int32',\n                  maximum: 1023,\n                  minimum: 0\n                },\n                vnetSubnetID: {\n                  description: \"VNet SubnetID specifies the VNet's subnet identifier.\",\n                  type: 'string'\n                },\n                firstConsecutiveStaticIP: {\n                  type: 'string',\n                  description: 'FirstConsecutiveStaticIP used to specify the first static ip of masters.',\n                  default: '10.240.255.5'\n                },\n                storageProfile: {\n                  description: 'Storage profile specifies what kind of storage used. Choose from StorageAccount and ManagedDisks. Leave it empty, we will choose for you based on the orchestrator choice.',\n                  type: 'string',\n                  'x-ms-enum': {\n                    name: 'ContainerServiceStorageProfileTypes',\n                    modelAsString: true\n                  },\n                  enum: [ 'StorageAccount', 'ManagedDisks' ]\n                },\n                fqdn: {\n                  readOnly: true,\n                  type: 'string',\n                  description: 'FQDN for the master pool.'\n                }\n              },\n              required: [ 'dnsPrefix', 'vmSize' ]\n            },\n            agentPoolProfiles: {\n              type: 'array',\n              items: {\n                properties: {\n                  name: {\n                    type: 'string',\n                    description: 'Unique name of the agent pool profile in the context of the subscription and resource group.'\n                  },\n                  count: {\n                    type: 'integer',\n                    format: 'int32',\n                    maximum: 100,\n                    minimum: 1,\n                    description: 'Number of agents (VMs) to host docker containers. Allowed values must be in the range of 1 to 100 (inclusive). The default value is 1. ',\n                    default: 1\n                  },\n                  vmSize: {\n                    description: 'Size of agent VMs.',\n                    type: 'string',\n                    'x-ms-enum': {\n                      name: 'ContainerServiceVMSizeTypes',\n                      modelAsString: true\n                    },\n                    enum: [\n                      'Standard_A1',\n                      'Standard_A10',\n                      'Standard_A11',\n                      'Standard_A1_v2',\n                      'Standard_A2',\n                      'Standard_A2_v2',\n                      'Standard_A2m_v2',\n                      'Standard_A3',\n                      'Standard_A4',\n                      'Standard_A4_v2',\n                      'Standard_A4m_v2',\n                      'Standard_A5',\n                      'Standard_A6',\n                      'Standard_A7',\n                      'Standard_A8',\n                      'Standard_A8_v2',\n                      'Standard_A8m_v2',\n                      'Standard_A9',\n                      'Standard_B2ms',\n                      'Standard_B2s',\n                      'Standard_B4ms',\n                      'Standard_B8ms',\n                      'Standard_D1',\n                      'Standard_D11',\n                      'Standard_D11_v2',\n                      'Standard_D11_v2_Promo',\n                      'Standard_D12',\n                      'Standard_D12_v2',\n                      'Standard_D12_v2_Promo',\n                      'Standard_D13',\n                      'Standard_D13_v2',\n                      'Standard_D13_v2_Promo',\n                      'Standard_D14',\n                      'Standard_D14_v2',\n                      'Standard_D14_v2_Promo',\n                      'Standard_D15_v2',\n                      'Standard_D16_v3',\n                      'Standard_D16s_v3',\n                      'Standard_D1_v2',\n                      'Standard_D2',\n                      'Standard_D2_v2',\n                      'Standard_D2_v2_Promo',\n                      'Standard_D2_v3',\n                      'Standard_D2s_v3',\n                      'Standard_D3',\n                      'Standard_D32_v3',\n                      'Standard_D32s_v3',\n                      'Standard_D3_v2',\n                      'Standard_D3_v2_Promo',\n                      'Standard_D4',\n                      'Standard_D4_v2',\n                      'Standard_D4_v2_Promo',\n                      'Standard_D4_v3',\n                      'Standard_D4s_v3',\n                      'Standard_D5_v2',\n                      'Standard_D5_v2_Promo',\n                      'Standard_D64_v3',\n                      'Standard_D64s_v3',\n                      'Standard_D8_v3',\n                      'Standard_D8s_v3',\n                      'Standard_DS1',\n                      'Standard_DS11',\n                      'Standard_DS11_v2',\n                      'Standard_DS11_v2_Promo',\n                      'Standard_DS12',\n                      'Standard_DS12_v2',\n                      'Standard_DS12_v2_Promo',\n                      'Standard_DS13',\n                      'Standard_DS13-2_v2',\n                      'Standard_DS13-4_v2',\n                      'Standard_DS13_v2',\n                      'Standard_DS13_v2_Promo',\n                      'Standard_DS14',\n                      'Standard_DS14-4_v2',\n                      'Standard_DS14-8_v2',\n                      'Standard_DS14_v2',\n                      'Standard_DS14_v2_Promo',\n                      'Standard_DS15_v2',\n                      'Standard_DS1_v2',\n                      'Standard_DS2',\n                      'Standard_DS2_v2',\n                      'Standard_DS2_v2_Promo',\n                      'Standard_DS3',\n                      'Standard_DS3_v2',\n                      'Standard_DS3_v2_Promo',\n                      'Standard_DS4',\n                      'Standard_DS4_v2',\n                      'Standard_DS4_v2_Promo',\n                      'Standard_DS5_v2',\n                      'Standard_DS5_v2_Promo',\n                      'Standard_E16_v3',\n                      'Standard_E16s_v3',\n                      'Standard_E2_v3',\n                      'Standard_E2s_v3',\n                      'Standard_E32-16s_v3',\n                      'Standard_E32-8s_v3',\n                      'Standard_E32_v3',\n                      'Standard_E32s_v3',\n                      'Standard_E4_v3',\n                      'Standard_E4s_v3',\n                      ... 74 more items\n                    ]\n                  },\n                  osDiskSizeGB: {\n                    description: 'OS Disk Size in GB to be used to specify the disk size for every machine in this master/agent pool. If you specify 0, it will apply the default osDisk size according to the vmSize specified.',\n                    type: 'integer',\n                    format: 'int32',\n                    maximum: 1023,\n                    minimum: 0\n                  },\n                  dnsPrefix: {\n                    type: 'string',\n                    description: 'DNS prefix to be used to create the FQDN for the agent pool.'\n                  },\n                  fqdn: {\n                    readOnly: true,\n                    type: 'string',\n                    description: 'FQDN for the agent pool.'\n                  },\n                  ports: {\n                    type: 'array',\n                    items: { type: 'integer', minimum: 1, maximum: 65535 },\n                    description: 'Ports number array used to expose on this agent pool. The default opened ports are different based on your choice of orchestrator.'\n                  },\n                  storageProfile: {\n                    description: 'Storage profile specifies what kind of storage used. Choose from StorageAccount and ManagedDisks. Leave it empty, we will choose for you based on the orchestrator choice.',\n                    type: 'string',\n                    'x-ms-enum': {\n                      name: 'ContainerServiceStorageProfileTypes',\n                      modelAsString: true\n                    },\n                    enum: [ 'StorageAccount', 'ManagedDisks' ]\n                  },\n                  vnetSubnetID: {\n                    description: \"VNet SubnetID specifies the VNet's subnet identifier.\",\n                    type: 'string'\n                  },\n                  osType: {\n                    description: 'OsType to be used to specify os type. Choose from Linux and Windows. Default to Linux.',\n                    type: 'string',\n                    default: 'Linux',\n                    enum: [ 'Linux', 'Windows' ],\n                    'x-ms-enum': { name: 'OSType', modelAsString: true }\n                  }\n                },\n                required: [ 'name', 'vmSize' ],\n                description: 'Profile for the container service agent pool.'\n              },\n              description: 'Properties of the agent pool.'\n            },\n            windowsProfile: {\n              description: 'Profile for Windows VMs in the container service cluster.',\n              properties: {\n                adminUsername: {\n                  type: 'string',\n                  description: 'The administrator username to use for Windows VMs.',\n                  pattern: '^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$'\n                },\n                adminPassword: {\n                  type: 'string',\n                  description: 'The administrator password to use for Windows VMs.',\n                  pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%\\\\^&\\\\*\\\\(\\\\)])[a-zA-Z\\\\d!@#$%\\\\^&\\\\*\\\\(\\\\)]{12,123}$'\n                }\n              },\n              required: [ 'adminUsername', 'adminPassword' ]\n            },\n            linuxProfile: {\n              description: 'Profile for Linux VMs in the container service cluster.',\n              properties: {\n                adminUsername: {\n                  type: 'string',\n                  description: 'The administrator username to use for Linux VMs.',\n                  pattern: '^[A-Za-z][-A-Za-z0-9_]*$'\n                },\n                ssh: {\n                  description: 'SSH configuration for Linux-based VMs running on Azure.',\n                  properties: {\n                    publicKeys: {\n                      type: 'array',\n                      items: {\n                        properties: {\n                          keyData: {\n                            type: 'string',\n                            description: 'Certificate public key used to authenticate with VMs through SSH. The certificate must be in PEM format with or without headers.'\n                          }\n                        },\n                        required: [ 'keyData' ],\n                        description: 'Contains information about SSH certificate public key data.'\n                      },\n                      description: 'The list of SSH public keys used to authenticate with Linux-based VMs. Only expect one key specified.'\n                    }\n                  },\n                  required: [ 'publicKeys' ]\n                }\n              },\n              required: [ 'adminUsername', 'ssh' ]\n            },\n            diagnosticsProfile: {\n              description: 'Profile for diagnostics in the container service cluster.',\n              properties: {\n                vmDiagnostics: {\n                  description: 'Profile for diagnostics on the container service VMs.',\n                  properties: {\n                    enabled: {\n                      type: 'boolean',\n                      description: 'Whether the VM diagnostic agent is provisioned on the VM.'\n                    },\n                    storageUri: {\n                      readOnly: true,\n                      type: 'string',\n                      description: 'The URI of the storage account where diagnostics are stored.'\n                    }\n                  },\n                  required: [ 'enabled' ]\n                }\n              },\n              required: [ 'vmDiagnostics' ]\n            }\n          },\n          required: [ 'orchestratorProfile', 'masterProfile', 'linuxProfile' ]\n        }\n      }\n    }\n  ],\n  description: 'Container service.'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2017-07-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2017-07-01/containerService.json"},"here"),"."))}S.isMDXComponent=!0}}]);