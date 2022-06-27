"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[71338],{3905:function(e,n,t){t.d(n,{Zo:function(){return l},kt:function(){return f}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var c=r.createContext({}),p=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},l=function(e){var n=p(e.components);return r.createElement(c.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),d=p(t),f=i,h=d["".concat(c,".").concat(f)]||d[f]||u[f]||o;return t?r.createElement(h,s(s({ref:n},l),{},{components:t})):r.createElement(h,s({ref:n},l))}));function f(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,s=new Array(o);s[0]=d;var a={};for(var c in n)hasOwnProperty.call(n,c)&&(a[c]=n[c]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var p=2;p<o;p++)s[p]=t[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},82047:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return l},default:function(){return d}});var r=t(87462),i=t(63366),o=(t(67294),t(3905)),s=["components"],a={id:"CloudService",title:"CloudService"},c=void 0,p={unversionedId:"azure/resources/Compute/CloudService",id:"azure/resources/Compute/CloudService",isDocsHomePage:!1,title:"CloudService",description:"Provides a CloudService from the Compute group",source:"@site/docs/azure/resources/Compute/CloudService.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/CloudService",permalink:"/docs/azure/resources/Compute/CloudService",tags:[],version:"current",frontMatter:{id:"CloudService",title:"CloudService"},sidebar:"docs",previous:{title:"CapacityReservationGroup",permalink:"/docs/azure/resources/Compute/CapacityReservationGroup"},next:{title:"CloudServiceRoleInstance",permalink:"/docs/azure/resources/Compute/CloudServiceRoleInstance"}},l=[{value:"Examples",id:"examples",children:[{value:"Create New Cloud Service with Single Role",id:"create-new-cloud-service-with-single-role",children:[],level:3},{value:"Create New Cloud Service with Single Role and RDP Extension",id:"create-new-cloud-service-with-single-role-and-rdp-extension",children:[],level:3},{value:"Create New Cloud Service with Multiple Roles",id:"create-new-cloud-service-with-multiple-roles",children:[],level:3},{value:"Create New Cloud Service with Single Role and Certificate from Key Vault",id:"create-new-cloud-service-with-single-role-and-certificate-from-key-vault",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:l};function d(e){var n=e.components,t=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"CloudService")," from the ",(0,o.kt)("strong",{parentName:"p"},"Compute")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-new-cloud-service-with-single-role"},"Create New Cloud Service with Single Role"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "CloudService",\n    group: "Compute",\n    name: "myCloudService",\n    properties: () => ({\n      location: "westus",\n      properties: {\n        networkProfile: {\n          loadBalancerConfigurations: [\n            {\n              properties: {\n                frontendIPConfigurations: [\n                  {\n                    properties: {\n                      publicIPAddress: {\n                        id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.Network/publicIPAddresses/myPublicIP",\n                      },\n                    },\n                    name: "myfe",\n                  },\n                ],\n              },\n              name: "myLoadBalancer",\n            },\n          ],\n        },\n        roleProfile: {\n          roles: [\n            {\n              sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },\n              name: "ContosoFrontend",\n            },\n          ],\n        },\n        configuration: "{ServiceConfiguration}",\n        packageUrl: "{PackageUrl}",\n        upgradeMode: "Auto",\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vault: ["myVault"],\n      publicIpAddress: ["myPublicIPAddress"],\n      subnet: ["mySubnet"],\n    }),\n  },\n];\n\n')),(0,o.kt)("h3",{id:"create-new-cloud-service-with-single-role-and-rdp-extension"},"Create New Cloud Service with Single Role and RDP Extension"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "CloudService",\n    group: "Compute",\n    name: "myCloudService",\n    properties: () => ({\n      properties: {\n        extensionProfile: {\n          extensions: [\n            {\n              properties: {\n                type: "RDP",\n                autoUpgradeMinorVersion: false,\n                protectedSettings:\n                  "<PrivateConfig><Password>{password}</Password></PrivateConfig>",\n                publisher: "Microsoft.Windows.Azure.Extensions",\n                settings:\n                  "<PublicConfig><UserName>UserAzure</UserName><Expiration>10/22/2021 15:05:45</Expiration></PublicConfig>",\n                typeHandlerVersion: "1.2.1",\n              },\n              name: "RDPExtension",\n            },\n          ],\n        },\n        networkProfile: {\n          loadBalancerConfigurations: [\n            {\n              properties: {\n                frontendIPConfigurations: [\n                  {\n                    properties: {\n                      publicIPAddress: {\n                        id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.Network/publicIPAddresses/contosopublicip",\n                      },\n                    },\n                    name: "contosofe",\n                  },\n                ],\n              },\n              name: "contosolb",\n            },\n          ],\n        },\n        roleProfile: {\n          roles: [\n            {\n              sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },\n              name: "ContosoFrontend",\n            },\n          ],\n        },\n        configuration: "{ServiceConfiguration}",\n        packageUrl: "{PackageUrl}",\n        upgradeMode: "Auto",\n      },\n      location: "westus",\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vault: ["myVault"],\n      publicIpAddress: ["myPublicIPAddress"],\n      subnet: ["mySubnet"],\n    }),\n  },\n];\n\n')),(0,o.kt)("h3",{id:"create-new-cloud-service-with-multiple-roles"},"Create New Cloud Service with Multiple Roles"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "CloudService",\n    group: "Compute",\n    name: "myCloudService",\n    properties: () => ({\n      properties: {\n        networkProfile: {\n          loadBalancerConfigurations: [\n            {\n              properties: {\n                frontendIPConfigurations: [\n                  {\n                    properties: {\n                      publicIPAddress: {\n                        id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.Network/publicIPAddresses/contosopublicip",\n                      },\n                    },\n                    name: "contosofe",\n                  },\n                ],\n              },\n              name: "contosolb",\n            },\n          ],\n        },\n        roleProfile: {\n          roles: [\n            {\n              sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },\n              name: "ContosoFrontend",\n            },\n            {\n              sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },\n              name: "ContosoBackend",\n            },\n          ],\n        },\n        configuration: "{ServiceConfiguration}",\n        packageUrl: "{PackageUrl}",\n        upgradeMode: "Auto",\n      },\n      location: "westus",\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vault: ["myVault"],\n      publicIpAddress: ["myPublicIPAddress"],\n      subnet: ["mySubnet"],\n    }),\n  },\n];\n\n')),(0,o.kt)("h3",{id:"create-new-cloud-service-with-single-role-and-certificate-from-key-vault"},"Create New Cloud Service with Single Role and Certificate from Key Vault"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "CloudService",\n    group: "Compute",\n    name: "myCloudService",\n    properties: () => ({\n      location: "westus",\n      properties: {\n        networkProfile: {\n          loadBalancerConfigurations: [\n            {\n              properties: {\n                frontendIPConfigurations: [\n                  {\n                    properties: {\n                      publicIPAddress: {\n                        id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.Network/publicIPAddresses/contosopublicip",\n                      },\n                    },\n                    name: "contosofe",\n                  },\n                ],\n              },\n              name: "contosolb",\n            },\n          ],\n        },\n        osProfile: {\n          secrets: [\n            {\n              sourceVault: {\n                id: "/subscriptions/{subscription-id}/resourceGroups/ConstosoRG/providers/Microsoft.KeyVault/vaults/{keyvault-name}",\n              },\n              vaultCertificates: [\n                {\n                  certificateUrl:\n                    "https://{keyvault-name}.vault.azure.net:443/secrets/ContosoCertificate/{secret-id}",\n                },\n              ],\n            },\n          ],\n        },\n        roleProfile: {\n          roles: [\n            {\n              sku: { name: "Standard_D1_v2", capacity: 1, tier: "Standard" },\n              name: "ContosoFrontend",\n            },\n          ],\n        },\n        configuration: "{ServiceConfiguration}",\n        packageUrl: "{PackageUrl}",\n        upgradeMode: "Auto",\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vault: ["myVault"],\n      publicIpAddress: ["myPublicIPAddress"],\n      subnet: ["mySubnet"],\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/KeyVault/Vault"},"Vault")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/PublicIPAddress"},"PublicIPAddress")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/Subnet"},"Subnet"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Describes the cloud service.',\n  type: 'object',\n  properties: {\n    id: { description: 'Resource Id.', type: 'string', readOnly: true },\n    name: { description: 'Resource name.', type: 'string', readOnly: true },\n    type: { description: 'Resource type.', type: 'string', readOnly: true },\n    location: { description: 'Resource location.', type: 'string' },\n    tags: {\n      description: 'Resource tags.',\n      type: 'object',\n      additionalProperties: { type: 'string' }\n    },\n    properties: {\n      description: 'Cloud service properties',\n      type: 'object',\n      properties: {\n        packageUrl: {\n          description: 'Specifies a URL that refers to the location of the service package in the Blob service. The service package URL can be Shared Access Signature (SAS) URI from any storage account.\\r\\n' +\n            'This is a write-only property and is not returned in GET calls.',\n          type: 'string'\n        },\n        configuration: {\n          description: 'Specifies the XML service configuration (.cscfg) for the cloud service.',\n          type: 'string'\n        },\n        configurationUrl: {\n          description: 'Specifies a URL that refers to the location of the service configuration in the Blob service. The service package URL  can be Shared Access Signature (SAS) URI from any storage account.\\r\\n' +\n            'This is a write-only property and is not returned in GET calls.',\n          type: 'string'\n        },\n        startCloudService: {\n          description: '(Optional) Indicates whether to start the cloud service immediately after it is created. The default value is `true`.\\r\\n' +\n            'If false, the service model is still deployed, but the code is not run immediately. Instead, the service is PoweredOff until you call Start, at which time the service will be started. A deployed service still incurs charges, even if it is poweredoff.',\n          type: 'boolean'\n        },\n        allowModelOverride: {\n          description: '(Optional) Indicates whether the role sku properties (roleProfile.roles.sku) specified in the model/template should override the role instance count and vm size specified in the .cscfg and .csdef respectively.\\r\\n' +\n            'The default value is `false`.',\n          type: 'boolean'\n        },\n        upgradeMode: {\n          description: 'Update mode for the cloud service. Role instances are allocated to update domains when the service is deployed. Updates can be initiated manually in each update domain or initiated automatically in all update domains.\\r\\n' +\n            'Possible Values are <br /><br />**Auto**<br /><br />**Manual** <br /><br />**Simultaneous**<br /><br />\\r\\n' +\n            'If not specified, the default value is Auto. If set to Manual, PUT UpdateDomain must be called to apply the update. If set to Auto, the update is automatically applied to each update domain in sequence.',\n          enum: [ 'Auto', 'Manual', 'Simultaneous' ],\n          type: 'string',\n          'x-ms-enum': { name: 'CloudServiceUpgradeMode', modelAsString: true }\n        },\n        roleProfile: {\n          description: 'Describes the role profile for the cloud service.',\n          type: 'object',\n          properties: {\n            roles: {\n              description: 'List of roles for the cloud service.',\n              type: 'array',\n              items: {\n                description: 'Describes the role properties.',\n                type: 'object',\n                properties: {\n                  name: { description: 'Resource name.', type: 'string' },\n                  sku: {\n                    description: 'Describes the cloud service role sku.',\n                    type: 'object',\n                    properties: {\n                      name: {\n                        description: 'The sku name. NOTE: If the new SKU is not supported on the hardware the cloud service is currently on, you need to delete and recreate the cloud service or move back to the old sku.',\n                        type: 'string'\n                      },\n                      tier: {\n                        description: 'Specifies the tier of the cloud service. Possible Values are <br /><br /> **Standard** <br /><br /> **Basic**',\n                        type: 'string'\n                      },\n                      capacity: {\n                        format: 'int64',\n                        description: 'Specifies the number of role instances in the cloud service.',\n                        type: 'integer'\n                      }\n                    }\n                  }\n                }\n              },\n              'x-ms-identifiers': [ 'name' ]\n            }\n          }\n        },\n        osProfile: {\n          description: 'Describes the OS profile for the cloud service.',\n          type: 'object',\n          properties: {\n            secrets: {\n              description: 'Specifies set of certificates that should be installed onto the role instances.',\n              type: 'array',\n              items: {\n                description: 'Describes a set of certificates which are all in the same Key Vault.',\n                type: 'object',\n                properties: {\n                  sourceVault: {\n                    description: 'The relative URL of the Key Vault containing all of the certificates in VaultCertificates.',\n                    type: 'object',\n                    properties: {\n                      id: { description: 'Resource Id', type: 'string' }\n                    },\n                    'x-ms-azure-resource': true\n                  },\n                  vaultCertificates: {\n                    description: 'The list of key vault references in SourceVault which contain certificates.',\n                    type: 'array',\n                    items: {\n                      description: 'Describes a single certificate reference in a Key Vault, and where the certificate should reside on the role instance.',\n                      type: 'object',\n                      properties: {\n                        certificateUrl: {\n                          description: 'This is the URL of a certificate that has been uploaded to Key Vault as a secret.',\n                          type: 'string'\n                        }\n                      }\n                    },\n                    'x-ms-identifiers': [ 'certificateUrl' ]\n                  }\n                }\n              },\n              'x-ms-identifiers': [ 'sourceVault/id' ]\n            }\n          }\n        },\n        networkProfile: {\n          description: 'Network Profile for the cloud service.',\n          type: 'object',\n          properties: {\n            loadBalancerConfigurations: {\n              description: 'List of Load balancer configurations. Cloud service can have up to two load balancer configurations, corresponding to a Public Load Balancer and an Internal Load Balancer.',\n              type: 'array',\n              items: {\n                description: 'Describes the load balancer configuration.',\n                type: 'object',\n                properties: {\n                  id: { description: 'Resource Id', type: 'string' },\n                  name: {\n                    description: 'The name of the Load balancer',\n                    type: 'string'\n                  },\n                  properties: {\n                    description: 'Properties of the load balancer configuration.',\n                    type: 'object',\n                    properties: {\n                      frontendIPConfigurations: {\n                        description: 'Specifies the frontend IP to be used for the load balancer. Only IPv4 frontend IP address is supported. Each load balancer configuration must have exactly one frontend IP configuration.',\n                        type: 'array',\n                        items: {\n                          type: 'object',\n                          properties: {\n                            name: {\n                              description: 'The name of the resource that is unique within the set of frontend IP configurations used by the load balancer. This name can be used to access the resource.',\n                              type: 'string'\n                            },\n                            properties: {\n                              description: 'Properties of load balancer frontend ip configuration.',\n                              type: 'object',\n                              properties: {\n                                publicIPAddress: [Object],\n                                subnet: [Object],\n                                privateIPAddress: [Object]\n                              }\n                            }\n                          },\n                          required: [ 'name', 'properties' ]\n                        },\n                        'x-ms-identifiers': [ 'name' ]\n                      }\n                    },\n                    required: [ 'frontendIPConfigurations' ]\n                  }\n                },\n                required: [ 'name', 'properties' ]\n              }\n            },\n            swappableCloudService: {\n              description: 'The id reference of the cloud service containing the target IP with which the subject cloud service can perform a swap. This property cannot be updated once it is set. The swappable cloud service referred by this id must be present otherwise an error will be thrown.',\n              type: 'object',\n              properties: { id: { description: 'Resource Id', type: 'string' } },\n              'x-ms-azure-resource': true\n            }\n          }\n        },\n        extensionProfile: {\n          description: 'Describes a cloud service extension profile.',\n          type: 'object',\n          properties: {\n            extensions: {\n              description: 'List of extensions for the cloud service.',\n              type: 'array',\n              items: {\n                description: 'Describes a cloud service Extension.',\n                type: 'object',\n                properties: {\n                  name: {\n                    description: 'The name of the extension.',\n                    type: 'string'\n                  },\n                  properties: {\n                    description: 'Extension Properties.',\n                    type: 'object',\n                    properties: {\n                      publisher: {\n                        description: 'The name of the extension handler publisher.',\n                        type: 'string'\n                      },\n                      type: {\n                        description: 'Specifies the type of the extension.',\n                        type: 'string'\n                      },\n                      typeHandlerVersion: {\n                        description: 'Specifies the version of the extension. Specifies the version of the extension. If this element is not specified or an asterisk (*) is used as the value, the latest version of the extension is used. If the value is specified with a major version number and an asterisk as the minor version number (X.), the latest minor version of the specified major version is selected. If a major version number and a minor version number are specified (X.Y), the specific extension version is selected. If a version is specified, an auto-upgrade is performed on the role instance.',\n                        type: 'string'\n                      },\n                      autoUpgradeMinorVersion: {\n                        description: 'Explicitly specify whether platform can automatically upgrade typeHandlerVersion to higher minor versions when they become available.',\n                        type: 'boolean'\n                      },\n                      settings: {\n                        description: 'Public settings for the extension. For JSON extensions, this is the JSON settings for the extension. For XML Extension (like RDP), this is the XML setting for the extension.',\n                        type: 'string'\n                      },\n                      protectedSettings: {\n                        description: 'Protected settings for the extension which are encrypted before sent to the role instance.',\n                        type: 'string'\n                      },\n                      protectedSettingsFromKeyVault: {\n                        type: 'object',\n                        properties: {\n                          sourceVault: {\n                            type: 'object',\n                            properties: {\n                              id: {\n                                description: 'Resource Id',\n                                type: 'string'\n                              }\n                            },\n                            'x-ms-azure-resource': true\n                          },\n                          secretUrl: { type: 'string' }\n                        }\n                      },\n                      forceUpdateTag: {\n                        description: 'Tag to force apply the provided public and protected settings.\\r\\n' +\n                          'Changing the tag value allows for re-running the extension without changing any of the public or protected settings.\\r\\n' +\n                          'If forceUpdateTag is not changed, updates to public or protected settings would still be applied by the handler.\\r\\n' +\n                          'If neither forceUpdateTag nor any of public or protected settings change, extension would flow to the role instance with the same sequence-number, and\\r\\n' +\n                          'it is up to handler implementation whether to re-run it or not',\n                        type: 'string'\n                      },\n                      provisioningState: {\n                        description: 'The provisioning state, which only appears in the response.',\n                        type: 'string',\n                        readOnly: true\n                      },\n                      rolesAppliedTo: {\n                        description: \"Optional list of roles to apply this extension. If property is not specified or '*' is specified, extension is applied to all roles in the cloud service.\",\n                        type: 'array',\n                        items: { type: 'string' }\n                      }\n                    }\n                  }\n                }\n              },\n              'x-ms-identifiers': [ 'name' ]\n            }\n          }\n        },\n        provisioningState: {\n          description: 'The provisioning state, which only appears in the response.',\n          type: 'string',\n          readOnly: true\n        },\n        uniqueId: {\n          description: 'The unique identifier for the cloud service.',\n          type: 'string',\n          readOnly: true\n        }\n      }\n    }\n  },\n  'x-ms-azure-resource': true,\n  required: [ 'location' ]\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-03-01/cloudService.json"},"here"),"."))}d.isMDXComponent=!0}}]);