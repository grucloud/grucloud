"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1275],{3905:(e,n,r)=>{r.d(n,{Zo:()=>p,kt:()=>m});var t=r(67294);function s(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){s(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function a(e,n){if(null==e)return{};var r,t,s=function(e,n){if(null==e)return{};var r,t,s={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(s[r]=e[r]);return s}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(s[r]=e[r])}return s}var l=t.createContext({}),c=function(e){var n=t.useContext(l),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},p=function(e){var n=c(e.components);return t.createElement(l.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,s=e.mdxType,i=e.originalType,l=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),d=c(r),m=s,S=d["".concat(l,".").concat(m)]||d[m]||u[m]||i;return r?t.createElement(S,o(o({ref:n},p),{},{components:r})):t.createElement(S,o({ref:n},p))}));function m(e,n){var r=arguments,s=n&&n.mdxType;if("string"==typeof e||s){var i=r.length,o=new Array(i);o[0]=d;var a={};for(var l in n)hasOwnProperty.call(n,l)&&(a[l]=n[l]);a.originalType=e,a.mdxType="string"==typeof e?e:s,o[1]=a;for(var c=2;c<i;c++)o[c]=r[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},70058:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var t=r(87462),s=(r(67294),r(3905));const i={id:"FileService",title:"FileService"},o=void 0,a={unversionedId:"azure/resources/Storage/FileService",id:"azure/resources/Storage/FileService",title:"FileService",description:"Provides a FileService from the Storage group",source:"@site/docs/azure/resources/Storage/FileService.md",sourceDirName:"azure/resources/Storage",slug:"/azure/resources/Storage/FileService",permalink:"/docs/azure/resources/Storage/FileService",draft:!1,tags:[],version:"current",frontMatter:{id:"FileService",title:"FileService"},sidebar:"docs",previous:{title:"EncryptionScope",permalink:"/docs/azure/resources/Storage/EncryptionScope"},next:{title:"FileShare",permalink:"/docs/azure/resources/Storage/FileShare"}},l={},c=[{value:"Examples",id:"examples",level:2},{value:"PutFileServices",id:"putfileservices",level:3},{value:"PutFileServices_EnableSMBMultichannel",id:"putfileservices_enablesmbmultichannel",level:3},{value:"PutFileServices_EnableSecureSmbFeatures",id:"putfileservices_enablesecuresmbfeatures",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:c};function u(e){let{components:n,...r}=e;return(0,s.kt)("wrapper",(0,t.Z)({},p,r,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provides a ",(0,s.kt)("strong",{parentName:"p"},"FileService")," from the ",(0,s.kt)("strong",{parentName:"p"},"Storage")," group"),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h3",{id:"putfileservices"},"PutFileServices"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FileService",\n    group: "Storage",\n    name: "myFileService",\n    properties: () => ({\n      properties: {\n        cors: {\n          corsRules: [\n            {\n              allowedOrigins: [\n                "http://www.contoso.com",\n                "http://www.fabrikam.com",\n              ],\n              allowedMethods: [\n                "GET",\n                "HEAD",\n                "POST",\n                "OPTIONS",\n                "MERGE",\n                "PUT",\n              ],\n              maxAgeInSeconds: 100,\n              exposedHeaders: ["x-ms-meta-*"],\n              allowedHeaders: [\n                "x-ms-meta-abc",\n                "x-ms-meta-data*",\n                "x-ms-meta-target*",\n              ],\n            },\n            {\n              allowedOrigins: ["*"],\n              allowedMethods: ["GET"],\n              maxAgeInSeconds: 2,\n              exposedHeaders: ["*"],\n              allowedHeaders: ["*"],\n            },\n            {\n              allowedOrigins: [\n                "http://www.abc23.com",\n                "https://www.fabrikam.com/*",\n              ],\n              allowedMethods: ["GET", "PUT"],\n              maxAgeInSeconds: 2000,\n              exposedHeaders: [\n                "x-ms-meta-abc",\n                "x-ms-meta-data*",\n                "x-ms-meta-target*",\n              ],\n              allowedHeaders: ["x-ms-meta-12345675754564*"],\n            },\n          ],\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,s.kt)("h3",{id:"putfileservices_enablesmbmultichannel"},"PutFileServices_EnableSMBMultichannel"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FileService",\n    group: "Storage",\n    name: "myFileService",\n    properties: () => ({\n      properties: {\n        protocolSettings: { smb: { multichannel: { enabled: true } } },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,s.kt)("h3",{id:"putfileservices_enablesecuresmbfeatures"},"PutFileServices_EnableSecureSmbFeatures"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FileService",\n    group: "Storage",\n    name: "myFileService",\n    properties: () => ({\n      properties: {\n        protocolSettings: {\n          smb: {\n            versions: "SMB2.1;SMB3.0;SMB3.1.1",\n            authenticationMethods: "NTLMv2;Kerberos",\n            kerberosTicketEncryption: "RC4-HMAC;AES-256",\n            channelEncryption: "AES-128-CCM;AES-128-GCM;AES-256-GCM",\n          },\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/Storage/StorageAccount"},"StorageAccount"))),(0,s.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      properties: {\n        cors: {\n          description: 'Specifies CORS rules for the File service. You can include up to five CorsRule elements in the request. If no CorsRule elements are included in the request body, all CORS rules will be deleted, and CORS will be disabled for the File service.',\n          properties: {\n            corsRules: {\n              type: 'array',\n              items: {\n                description: 'Specifies a CORS rule for the Blob service. ',\n                properties: {\n                  allowedOrigins: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'Required if CorsRule element is present. A list of origin domains that will be allowed via CORS, or \"*\" to allow all domains'\n                  },\n                  allowedMethods: {\n                    type: 'array',\n                    items: {\n                      type: 'string',\n                      enum: [\n                        'DELETE', 'GET',\n                        'HEAD',   'MERGE',\n                        'POST',   'OPTIONS',\n                        'PUT',    'PATCH'\n                      ],\n                      'x-ms-enum': { name: 'AllowedMethods', modelAsString: true }\n                    },\n                    description: 'Required if CorsRule element is present. A list of HTTP methods that are allowed to be executed by the origin.'\n                  },\n                  maxAgeInSeconds: {\n                    type: 'integer',\n                    description: 'Required if CorsRule element is present. The number of seconds that the client/browser should cache a preflight response.'\n                  },\n                  exposedHeaders: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'Required if CorsRule element is present. A list of response headers to expose to CORS clients.'\n                  },\n                  allowedHeaders: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'Required if CorsRule element is present. A list of headers allowed to be part of the cross-origin request.'\n                  }\n                },\n                required: [\n                  'allowedOrigins',\n                  'allowedMethods',\n                  'maxAgeInSeconds',\n                  'exposedHeaders',\n                  'allowedHeaders'\n                ]\n              },\n              description: 'The List of CORS rules. You can include up to five CorsRule elements in the request. '\n            }\n          }\n        },\n        shareDeleteRetentionPolicy: {\n          description: 'The file service properties for share soft delete.',\n          properties: {\n            enabled: {\n              type: 'boolean',\n              description: 'Indicates whether DeleteRetentionPolicy is enabled.'\n            },\n            days: {\n              type: 'integer',\n              minimum: 1,\n              maximum: 365,\n              description: 'Indicates the number of days that the deleted item should be retained. The minimum specified value can be 1 and the maximum value can be 365.'\n            },\n            allowPermanentDelete: {\n              type: 'boolean',\n              description: 'This property when set to true allows deletion of the soft deleted blob versions and snapshots. This property cannot be used blob restore policy. This property only applies to blob service and does not apply to containers or file share.'\n            }\n          }\n        },\n        protocolSettings: {\n          description: 'Protocol settings for file service',\n          properties: {\n            smb: {\n              description: 'Setting for SMB protocol',\n              properties: {\n                multichannel: {\n                  description: 'Multichannel setting. Applies to Premium FileStorage only.',\n                  properties: {\n                    enabled: {\n                      type: 'boolean',\n                      description: 'Indicates whether multichannel is enabled'\n                    }\n                  }\n                },\n                versions: {\n                  type: 'string',\n                  description: \"SMB protocol versions supported by server. Valid values are SMB2.1, SMB3.0, SMB3.1.1. Should be passed as a string with delimiter ';'.\"\n                },\n                authenticationMethods: {\n                  type: 'string',\n                  description: \"SMB authentication methods supported by server. Valid values are NTLMv2, Kerberos. Should be passed as a string with delimiter ';'.\"\n                },\n                kerberosTicketEncryption: {\n                  type: 'string',\n                  description: \"Kerberos ticket encryption supported by server. Valid values are RC4-HMAC, AES-256. Should be passed as a string with delimiter ';'\"\n                },\n                channelEncryption: {\n                  type: 'string',\n                  description: \"SMB channel encryption supported by server. Valid values are AES-128-CCM, AES-128-GCM, AES-256-GCM. Should be passed as a string with delimiter ';'.\"\n                }\n              }\n            }\n          }\n        }\n      },\n      'x-ms-client-flatten': true,\n      'x-ms-client-name': 'FileServiceProperties',\n      description: 'The properties of File services in storage account.'\n    },\n    sku: {\n      readOnly: true,\n      description: 'Sku name and tier.',\n      properties: {\n        name: {\n          type: 'string',\n          description: 'The SKU name. Required for account creation; optional for update. Note that in older versions, SKU name was called accountType.',\n          enum: [\n            'Standard_LRS',\n            'Standard_GRS',\n            'Standard_RAGRS',\n            'Standard_ZRS',\n            'Premium_LRS',\n            'Premium_ZRS',\n            'Standard_GZRS',\n            'Standard_RAGZRS'\n          ],\n          'x-ms-enum': { name: 'SkuName', modelAsString: true }\n        },\n        tier: {\n          readOnly: true,\n          type: 'string',\n          description: 'The SKU tier. This is based on the SKU name.',\n          enum: [ 'Standard', 'Premium' ],\n          'x-ms-enum': { name: 'SkuTier', modelAsString: false }\n        }\n      },\n      required: [ 'name' ]\n    }\n  },\n  allOf: [\n    {\n      title: 'Resource',\n      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n      type: 'object',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the resource'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'The properties of File services in storage account.'\n}\n")),(0,s.kt)("h2",{id:"misc"},"Misc"),(0,s.kt)("p",null,"The resource version is ",(0,s.kt)("inlineCode",{parentName:"p"},"2022-05-01"),"."),(0,s.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2022-05-01/file.json"},"here"),"."))}u.isMDXComponent=!0}}]);