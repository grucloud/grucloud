"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[80374],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>y});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var d=r.createContext({}),c=function(e){var n=r.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(d.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,s=e.originalType,d=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),l=c(t),y=i,m=l["".concat(d,".").concat(y)]||l[y]||u[y]||s;return t?r.createElement(m,o(o({ref:n},p),{},{components:t})):r.createElement(m,o({ref:n},p))}));function y(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var s=t.length,o=new Array(s);o[0]=l;var a={};for(var d in n)hasOwnProperty.call(n,d)&&(a[d]=n[d]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var c=2;c<s;c++)o[c]=t[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},67322:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>d,contentTitle:()=>o,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var r=t(87462),i=(t(67294),t(3905));const s={id:"Registry",title:"Registry"},o=void 0,a={unversionedId:"azure/resources/ContainerRegistry/Registry",id:"azure/resources/ContainerRegistry/Registry",title:"Registry",description:"Provides a Registry from the ContainerRegistry group",source:"@site/docs/azure/resources/ContainerRegistry/Registry.md",sourceDirName:"azure/resources/ContainerRegistry",slug:"/azure/resources/ContainerRegistry/Registry",permalink:"/docs/azure/resources/ContainerRegistry/Registry",draft:!1,tags:[],version:"current",frontMatter:{id:"Registry",title:"Registry"},sidebar:"docs",previous:{title:"PrivateEndpointConnection",permalink:"/docs/azure/resources/ContainerRegistry/PrivateEndpointConnection"},next:{title:"RegistryProperties",permalink:"/docs/azure/resources/ContainerRegistry/RegistryProperties"}},d={},c=[{value:"Examples",id:"examples",level:2},{value:"RegistryCreate",id:"registrycreate",level:3},{value:"RegistryCreateZoneRedundant",id:"registrycreatezoneredundant",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:c};function u(e){let{components:n,...t}=e;return(0,i.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"Registry")," from the ",(0,i.kt)("strong",{parentName:"p"},"ContainerRegistry")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"registrycreate"},"RegistryCreate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Registry",\n    group: "ContainerRegistry",\n    name: "myRegistry",\n    properties: () => ({\n      location: "westus",\n      tags: { key: "value" },\n      sku: { name: "Standard" },\n      properties: { adminUserEnabled: true },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n    }),\n  },\n];\n\n')),(0,i.kt)("h3",{id:"registrycreatezoneredundant"},"RegistryCreateZoneRedundant"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Registry",\n    group: "ContainerRegistry",\n    name: "myRegistry",\n    properties: () => ({\n      location: "westus",\n      tags: { key: "value" },\n      sku: { name: "Standard" },\n      properties: { zoneRedundancy: "Enabled" },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/ManagedIdentity/UserAssignedIdentity"},"UserAssignedIdentity"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'An object that represents a container registry.',\n  required: [ 'sku' ],\n  type: 'object',\n  allOf: [\n    {\n      description: 'An Azure resource.',\n      required: [ 'location' ],\n      properties: {\n        id: {\n          description: 'The resource ID.',\n          type: 'string',\n          readOnly: true\n        },\n        name: {\n          description: 'The name of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        type: {\n          description: 'The type of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        location: {\n          description: 'The location of the resource. This cannot be changed after the resource is created.',\n          type: 'string',\n          'x-ms-mutability': [ 'read', 'create' ]\n        },\n        tags: {\n          description: 'The tags of the resource.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        },\n        systemData: {\n          description: 'Metadata pertaining to creation and last modification of the resource.',\n          type: 'object',\n          readOnly: true,\n          properties: {\n            createdBy: {\n              description: 'The identity that created the resource.',\n              type: 'string'\n            },\n            createdByType: {\n              description: 'The type of identity that created the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'createdByType', modelAsString: true }\n            },\n            createdAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource creation (UTC).',\n              type: 'string'\n            },\n            lastModifiedBy: {\n              description: 'The identity that last modified the resource.',\n              type: 'string'\n            },\n            lastModifiedByType: {\n              description: 'The type of identity that last modified the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }\n            },\n            lastModifiedAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource modification (UTC).',\n              type: 'string'\n            }\n          }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    sku: {\n      description: 'The SKU of the container registry.',\n      required: [ 'name' ],\n      type: 'object',\n      properties: {\n        name: {\n          description: 'The SKU name of the container registry. Required for registry creation.',\n          enum: [ 'Classic', 'Basic', 'Standard', 'Premium' ],\n          type: 'string',\n          'x-ms-enum': { name: 'SkuName', modelAsString: true }\n        },\n        tier: {\n          description: 'The SKU tier based on the SKU name.',\n          enum: [ 'Classic', 'Basic', 'Standard', 'Premium' ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'SkuTier', modelAsString: true }\n        }\n      }\n    },\n    identity: {\n      description: 'The identity of the container registry.',\n      type: 'object',\n      properties: {\n        principalId: {\n          description: 'The principal ID of resource identity.',\n          type: 'string'\n        },\n        tenantId: { description: 'The tenant ID of resource.', type: 'string' },\n        type: {\n          description: 'The identity type.',\n          enum: [\n            'SystemAssigned',\n            'UserAssigned',\n            'SystemAssigned, UserAssigned',\n            'None'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }\n        },\n        userAssignedIdentities: {\n          description: 'The list of user identities associated with the resource. The user identity \\r\\n' +\n            'dictionary key references will be ARM resource ids in the form: \\r\\n' +\n            \"'/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/\\r\\n\" +\n            \"    providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.\",\n          type: 'object',\n          additionalProperties: {\n            type: 'object',\n            properties: {\n              principalId: {\n                description: 'The principal id of user assigned identity.',\n                type: 'string'\n              },\n              clientId: {\n                description: 'The client id of user assigned identity.',\n                type: 'string'\n              }\n            }\n          }\n        }\n      }\n    },\n    properties: {\n      description: 'The properties of the container registry.',\n      'x-ms-client-flatten': true,\n      type: 'object',\n      properties: {\n        loginServer: {\n          description: 'The URL that can be used to log into the container registry.',\n          type: 'string',\n          readOnly: true\n        },\n        creationDate: {\n          format: 'date-time',\n          description: 'The creation date of the container registry in ISO8601 format.',\n          type: 'string',\n          readOnly: true\n        },\n        provisioningState: {\n          description: 'The provisioning state of the container registry at the time the operation was called.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        status: {\n          description: 'The status of the container registry at the time the operation was called.',\n          readOnly: true,\n          type: 'object',\n          properties: {\n            displayStatus: {\n              description: 'The short label for the status.',\n              type: 'string',\n              readOnly: true\n            },\n            message: {\n              description: 'The detailed message for the status, including alerts and error messages.',\n              type: 'string',\n              readOnly: true\n            },\n            timestamp: {\n              format: 'date-time',\n              description: 'The timestamp when the status was changed to the current value.',\n              type: 'string',\n              readOnly: true\n            }\n          }\n        },\n        adminUserEnabled: {\n          description: 'The value that indicates whether the admin user is enabled.',\n          default: false,\n          type: 'boolean'\n        },\n        networkRuleSet: {\n          description: 'The network rule set for a container registry.',\n          required: [ 'defaultAction' ],\n          type: 'object',\n          properties: {\n            defaultAction: {\n              description: 'The default action of allow or deny when no other rules match.',\n              default: 'Allow',\n              enum: [ 'Allow', 'Deny' ],\n              type: 'string',\n              'x-ms-enum': { name: 'DefaultAction', modelAsString: true }\n            },\n            ipRules: {\n              description: 'The IP ACL rules.',\n              type: 'array',\n              items: {\n                description: 'IP rule with specific IP or IP range in CIDR format.',\n                required: [ 'value' ],\n                type: 'object',\n                properties: {\n                  action: {\n                    description: 'The action of IP ACL rule.',\n                    default: 'Allow',\n                    enum: [ 'Allow' ],\n                    type: 'string',\n                    'x-ms-enum': { name: 'Action', modelAsString: true }\n                  },\n                  value: {\n                    description: 'Specifies the IP or IP range in CIDR format. Only IPV4 address is allowed.',\n                    type: 'string',\n                    'x-ms-client-name': 'IPAddressOrRange'\n                  }\n                }\n              },\n              'x-ms-identifiers': []\n            }\n          }\n        },\n        policies: {\n          description: 'The policies for a container registry.',\n          type: 'object',\n          properties: {\n            quarantinePolicy: {\n              description: 'The quarantine policy for a container registry.',\n              type: 'object',\n              properties: {\n                status: {\n                  description: 'The value that indicates whether the policy is enabled or not.',\n                  default: 'disabled',\n                  enum: [ 'enabled', 'disabled' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'PolicyStatus', modelAsString: true }\n                }\n              }\n            },\n            trustPolicy: {\n              description: 'The content trust policy for a container registry.',\n              type: 'object',\n              properties: {\n                type: {\n                  description: 'The type of trust policy.',\n                  default: 'Notary',\n                  enum: [ 'Notary' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'TrustPolicyType', modelAsString: true }\n                },\n                status: {\n                  description: 'The value that indicates whether the policy is enabled or not.',\n                  default: 'disabled',\n                  enum: [ 'enabled', 'disabled' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'PolicyStatus', modelAsString: true }\n                }\n              }\n            },\n            retentionPolicy: {\n              description: 'The retention policy for a container registry.',\n              type: 'object',\n              properties: {\n                days: {\n                  format: 'int32',\n                  description: 'The number of days to retain an untagged manifest after which it gets purged.',\n                  default: 7,\n                  type: 'integer'\n                },\n                lastUpdatedTime: {\n                  format: 'date-time',\n                  description: 'The timestamp when the policy was last updated.',\n                  type: 'string',\n                  readOnly: true\n                },\n                status: {\n                  description: 'The value that indicates whether the policy is enabled or not.',\n                  default: 'disabled',\n                  enum: [ 'enabled', 'disabled' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'PolicyStatus', modelAsString: true }\n                }\n              }\n            },\n            exportPolicy: {\n              description: 'The export policy for a container registry.',\n              type: 'object',\n              properties: {\n                status: {\n                  description: 'The value that indicates whether the policy is enabled or not.',\n                  default: 'enabled',\n                  enum: [ 'enabled', 'disabled' ],\n                  type: 'string',\n                  'x-ms-enum': { name: 'ExportPolicyStatus', modelAsString: true }\n                }\n              }\n            }\n          }\n        },\n        encryption: {\n          description: 'The encryption settings of container registry.',\n          type: 'object',\n          properties: {\n            status: {\n              description: 'Indicates whether or not the encryption is enabled for container registry.',\n              enum: [ 'enabled', 'disabled' ],\n              type: 'string',\n              'x-ms-enum': { name: 'EncryptionStatus', modelAsString: true }\n            },\n            keyVaultProperties: {\n              description: 'Key vault properties.',\n              type: 'object',\n              properties: {\n                keyIdentifier: {\n                  description: 'Key vault uri to access the encryption key.',\n                  type: 'string'\n                },\n                versionedKeyIdentifier: {\n                  description: 'The fully qualified key identifier that includes the version of the key that is actually used for encryption.',\n                  type: 'string',\n                  readOnly: true\n                },\n                identity: {\n                  description: 'The client id of the identity which will be used to access key vault.',\n                  type: 'string'\n                },\n                keyRotationEnabled: {\n                  description: 'Auto key rotation status for a CMK enabled registry.',\n                  type: 'boolean',\n                  readOnly: true\n                },\n                lastKeyRotationTimestamp: {\n                  format: 'date-time',\n                  description: 'Timestamp of the last successful key rotation.',\n                  type: 'string',\n                  readOnly: true\n                }\n              }\n            }\n          }\n        },\n        dataEndpointEnabled: {\n          description: 'Enable a single data endpoint per region for serving data.',\n          type: 'boolean'\n        },\n        dataEndpointHostNames: {\n          description: 'List of host names that will serve data when dataEndpointEnabled is true.',\n          type: 'array',\n          items: { type: 'string' },\n          readOnly: true\n        },\n        privateEndpointConnections: {\n          description: 'List of private endpoint connections for a container registry.',\n          type: 'array',\n          items: {\n            description: 'An object that represents a private endpoint connection for a container registry.',\n            type: 'object',\n            allOf: [\n              {\n                description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',\n                properties: {\n                  id: {\n                    description: 'The resource ID.',\n                    type: 'string',\n                    readOnly: true\n                  },\n                  name: {\n                    description: 'The name of the resource.',\n                    type: 'string',\n                    readOnly: true\n                  },\n                  type: {\n                    description: 'The type of the resource.',\n                    type: 'string',\n                    readOnly: true\n                  },\n                  systemData: {\n                    description: 'Metadata pertaining to creation and last modification of the resource.',\n                    type: 'object',\n                    readOnly: true,\n                    properties: {\n                      createdBy: {\n                        description: 'The identity that created the resource.',\n                        type: 'string'\n                      },\n                      createdByType: {\n                        description: 'The type of identity that created the resource.',\n                        enum: [\n                          'User',\n                          'Application',\n                          'ManagedIdentity',\n                          'Key'\n                        ],\n                        type: 'string',\n                        'x-ms-enum': { name: 'createdByType', modelAsString: true }\n                      },\n                      createdAt: {\n                        format: 'date-time',\n                        description: 'The timestamp of resource creation (UTC).',\n                        type: 'string'\n                      },\n                      lastModifiedBy: {\n                        description: 'The identity that last modified the resource.',\n                        type: 'string'\n                      },\n                      lastModifiedByType: {\n                        description: 'The type of identity that last modified the resource.',\n                        enum: [\n                          'User',\n                          'Application',\n                          'ManagedIdentity',\n                          'Key'\n                        ],\n                        type: 'string',\n                        'x-ms-enum': {\n                          name: 'lastModifiedByType',\n                          modelAsString: true\n                        }\n                      },\n                      lastModifiedAt: {\n                        format: 'date-time',\n                        description: 'The timestamp of resource modification (UTC).',\n                        type: 'string'\n                      }\n                    }\n                  }\n                },\n                'x-ms-azure-resource': true\n              }\n            ],\n            properties: {\n              properties: {\n                description: 'The properties of a private endpoint connection.',\n                'x-ms-client-flatten': true,\n                type: 'object',\n                properties: {\n                  privateEndpoint: {\n                    description: 'The resource of private endpoint.',\n                    type: 'object',\n                    properties: {\n                      id: {\n                        description: 'This is private endpoint resource created with Microsoft.Network resource provider.',\n                        type: 'string'\n                      }\n                    }\n                  },\n                  privateLinkServiceConnectionState: {\n                    description: 'A collection of information about the state of the connection between service consumer and provider.',\n                    type: 'object',\n                    properties: {\n                      status: {\n                        description: 'The private link service connection status.',\n                        enum: [\n                          'Approved',\n                          'Pending',\n                          'Rejected',\n                          'Disconnected'\n                        ],\n                        type: 'string',\n                        'x-ms-enum': {\n                          name: 'ConnectionStatus',\n                          modelAsString: true\n                        }\n                      },\n                      description: {\n                        description: 'The description for connection status. For example if connection is rejected it can indicate reason for rejection.',\n                        type: 'string'\n                      },\n                      actionsRequired: {\n                        description: 'A message indicating if changes on the service provider require any updates on the consumer.',\n                        enum: [ 'None', 'Recreate' ],\n                        type: 'string',\n                        'x-ms-enum': {\n                          name: 'ActionsRequired',\n                          modelAsString: true\n                        }\n                      }\n                    }\n                  },\n                  provisioningState: {\n                    description: 'The provisioning state of private endpoint connection resource.',\n                    enum: [\n                      'Creating',\n                      'Updating',\n                      'Deleting',\n                      'Succeeded',\n                      'Failed',\n                      'Canceled'\n                    ],\n                    type: 'string',\n                    readOnly: true,\n                    'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n                  }\n                }\n              }\n            }\n          },\n          readOnly: true\n        },\n        publicNetworkAccess: {\n          description: 'Whether or not public network access is allowed for the container registry.',\n          default: 'Enabled',\n          enum: [ 'Enabled', 'Disabled' ],\n          type: 'string',\n          'x-ms-enum': { name: 'PublicNetworkAccess', modelAsString: true }\n        },\n        networkRuleBypassOptions: {\n          description: 'Whether to allow trusted Azure services to access a network restricted registry.',\n          default: 'AzureServices',\n          enum: [ 'AzureServices', 'None' ],\n          type: 'string',\n          'x-ms-enum': { name: 'NetworkRuleBypassOptions', modelAsString: true }\n        },\n        zoneRedundancy: {\n          description: 'Whether or not zone redundancy is enabled for this container registry',\n          default: 'Disabled',\n          enum: [ 'Enabled', 'Disabled' ],\n          type: 'string',\n          'x-ms-enum': { name: 'ZoneRedundancy', modelAsString: true }\n        }\n      }\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-09-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/stable/2021-09-01/containerregistry.json"},"here"),"."))}u.isMDXComponent=!0}}]);