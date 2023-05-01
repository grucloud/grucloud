"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2645],{3905:(e,n,t)=>{t.d(n,{Zo:()=>l,kt:()=>m});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=r.createContext({}),c=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},l=function(e){var n=c(e.components);return r.createElement(p.Provider,{value:n},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},y=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,s=e.originalType,p=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),d=c(t),y=i,m=d["".concat(p,".").concat(y)]||d[y]||u[y]||s;return t?r.createElement(m,o(o({ref:n},l),{},{components:t})):r.createElement(m,o({ref:n},l))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var s=t.length,o=new Array(s);o[0]=y;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a[d]="string"==typeof e?e:i,o[1]=a;for(var c=2;c<s;c++)o[c]=t[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}y.displayName="MDXCreateElement"},88130:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>o,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>c});var r=t(87462),i=(t(67294),t(3905));const s={id:"FirewallPolicy",title:"FirewallPolicy"},o=void 0,a={unversionedId:"azure/resources/Network/FirewallPolicy",id:"azure/resources/Network/FirewallPolicy",title:"FirewallPolicy",description:"Provides a FirewallPolicy from the Network group",source:"@site/docs/azure/resources/Network/FirewallPolicy.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/FirewallPolicy",permalink:"/docs/azure/resources/Network/FirewallPolicy",draft:!1,tags:[],version:"current",frontMatter:{id:"FirewallPolicy",title:"FirewallPolicy"},sidebar:"docs",previous:{title:"ExpressRoutePortAuthorization",permalink:"/docs/azure/resources/Network/ExpressRoutePortAuthorization"},next:{title:"FirewallPolicyIdpsSignaturesOverride",permalink:"/docs/azure/resources/Network/FirewallPolicyIdpsSignaturesOverride"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Create FirewallPolicy",id:"create-firewallpolicy",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:c},d="wrapper";function u(e){let{components:n,...t}=e;return(0,i.kt)(d,(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"FirewallPolicy")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-firewallpolicy"},"Create FirewallPolicy"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FirewallPolicy",\n    group: "Network",\n    name: "myFirewallPolicy",\n    properties: () => ({\n      tags: { key1: "value1" },\n      location: "West US",\n      properties: {\n        threatIntelMode: "Alert",\n        threatIntelWhitelist: {\n          ipAddresses: ["20.3.4.5"],\n          fqdns: ["*.microsoft.com"],\n        },\n        insights: {\n          isEnabled: true,\n          retentionDays: 100,\n          logAnalyticsResources: {\n            workspaces: [\n              {\n                region: "westus",\n                workspaceId: {\n                  id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/workspace1",\n                },\n              },\n              {\n                region: "eastus",\n                workspaceId: {\n                  id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/workspace2",\n                },\n              },\n            ],\n            defaultWorkspaceId: {\n              id: "/subscriptions/subid/resourcegroups/rg1/providers/microsoft.operationalinsights/workspaces/defaultWorkspace",\n            },\n          },\n        },\n        snat: { privateRanges: ["IANAPrivateRanges"] },\n        sql: { allowSqlRedirect: true },\n        dnsSettings: {\n          servers: ["30.3.4.5"],\n          enableProxy: true,\n          requireProxyForNetworkRules: false,\n        },\n        explicitProxy: {\n          enableExplicitProxy: true,\n          httpPort: 8087,\n          httpsPort: 8087,\n          enablePacFile: true,\n          pacFilePort: 8087,\n          pacFile:\n            "https://tinawstorage.file.core.windows.net/?sv=2020-02-10&ss=bfqt&srt=sco&sp=rwdlacuptfx&se=2021-06-04T07:01:12Z&st=2021-06-03T23:01:12Z&sip=68.65.171.11&spr=https&sig=Plsa0RRVpGbY0IETZZOT6znOHcSro71LLTTbzquYPgs%3D",\n        },\n        sku: { tier: "Premium" },\n        intrusionDetection: {\n          mode: "Alert",\n          configuration: {\n            signatureOverrides: [{ id: "2525004", mode: "Deny" }],\n            bypassTrafficSettings: [\n              {\n                name: "bypassRule1",\n                description: "Rule 1",\n                protocol: "TCP",\n                sourceAddresses: ["1.2.3.4"],\n                destinationAddresses: ["5.6.7.8"],\n                destinationPorts: ["*"],\n              },\n            ],\n          },\n        },\n        transportSecurity: {\n          certificateAuthority: {\n            name: "clientcert",\n            keyVaultSecretId: "https://kv/secret",\n          },\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      managedIdentities: ["myUserAssignedIdentity"],\n      workspace: ["myWorkspace"],\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/ManagedIdentity/UserAssignedIdentity"},"UserAssignedIdentity")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/OperationalInsights/Workspace"},"Workspace"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the firewall policy.',\n      type: 'object',\n      properties: {\n        ruleCollectionGroups: {\n          type: 'array',\n          readOnly: true,\n          description: 'List of references to FirewallPolicyRuleCollectionGroups.',\n          items: {\n            properties: { id: { type: 'string', description: 'Resource ID.' } },\n            description: 'Reference to another subresource.',\n            'x-ms-azure-resource': true\n          }\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the firewall policy resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        basePolicy: {\n          readOnly: false,\n          description: 'The parent firewall policy from which rules are inherited.',\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          'x-ms-azure-resource': true\n        },\n        firewalls: {\n          type: 'array',\n          readOnly: true,\n          description: 'List of references to Azure Firewalls that this Firewall Policy is associated with.',\n          items: {\n            properties: { id: { type: 'string', description: 'Resource ID.' } },\n            description: 'Reference to another subresource.',\n            'x-ms-azure-resource': true\n          }\n        },\n        childPolicies: {\n          type: 'array',\n          readOnly: true,\n          description: 'List of references to Child Firewall Policies.',\n          items: {\n            properties: { id: { type: 'string', description: 'Resource ID.' } },\n            description: 'Reference to another subresource.',\n            'x-ms-azure-resource': true\n          }\n        },\n        threatIntelMode: {\n          description: 'The operation mode for Threat Intelligence.',\n          type: 'string',\n          enum: [ 'Alert', 'Deny', 'Off' ],\n          'x-ms-enum': { name: 'AzureFirewallThreatIntelMode', modelAsString: true }\n        },\n        threatIntelWhitelist: {\n          description: 'ThreatIntel Whitelist for Firewall Policy.',\n          type: 'object',\n          properties: {\n            ipAddresses: {\n              type: 'array',\n              description: 'List of IP addresses for the ThreatIntel Whitelist.',\n              items: { type: 'string' }\n            },\n            fqdns: {\n              type: 'array',\n              description: 'List of FQDNs for the ThreatIntel Whitelist.',\n              items: { type: 'string' }\n            }\n          }\n        },\n        insights: {\n          description: 'Insights on Firewall Policy.',\n          type: 'object',\n          properties: {\n            isEnabled: {\n              type: 'boolean',\n              description: 'A flag to indicate if the insights are enabled on the policy.'\n            },\n            retentionDays: {\n              type: 'integer',\n              format: 'int32',\n              description: 'Number of days the insights should be enabled on the policy.'\n            },\n            logAnalyticsResources: {\n              description: 'Workspaces needed to configure the Firewall Policy Insights.',\n              type: 'object',\n              properties: {\n                workspaces: {\n                  type: 'array',\n                  description: 'List of workspaces for Firewall Policy Insights.',\n                  items: {\n                    type: 'object',\n                    description: 'Log Analytics Workspace for Firewall Policy Insights.',\n                    properties: {\n                      region: {\n                        type: 'string',\n                        description: 'Region to configure the Workspace.'\n                      },\n                      workspaceId: {\n                        description: 'The workspace Id for Firewall Policy Insights.',\n                        properties: {\n                          id: {\n                            type: 'string',\n                            description: 'Resource ID.'\n                          }\n                        },\n                        'x-ms-azure-resource': true\n                      }\n                    }\n                  },\n                  'x-ms-identifiers': []\n                },\n                defaultWorkspaceId: {\n                  description: 'The default workspace Id for Firewall Policy Insights.',\n                  properties: {\n                    id: { type: 'string', description: 'Resource ID.' }\n                  },\n                  'x-ms-azure-resource': true\n                }\n              }\n            }\n          }\n        },\n        snat: {\n          description: 'The private IP addresses/IP ranges to which traffic will not be SNAT.',\n          type: 'object',\n          properties: {\n            privateRanges: {\n              type: 'array',\n              description: 'List of private IP addresses/IP address ranges to not be SNAT.',\n              items: { type: 'string' }\n            },\n            autoLearnPrivateRanges: {\n              type: 'string',\n              description: 'The operation mode for automatically learning private ranges to not be SNAT',\n              enum: [ 'Enabled', 'Disabled' ],\n              'x-ms-enum': {\n                name: 'AutoLearnPrivateRangesMode',\n                modelAsString: true\n              }\n            }\n          }\n        },\n        sql: {\n          description: 'SQL Settings definition.',\n          type: 'object',\n          properties: {\n            allowSqlRedirect: {\n              type: 'boolean',\n              description: 'A flag to indicate if SQL Redirect traffic filtering is enabled. Turning on the flag requires no rule using port 11000-11999.'\n            }\n          }\n        },\n        dnsSettings: {\n          description: 'DNS Proxy Settings definition.',\n          type: 'object',\n          properties: {\n            servers: {\n              type: 'array',\n              description: 'List of Custom DNS Servers.',\n              items: { type: 'string' }\n            },\n            enableProxy: {\n              type: 'boolean',\n              description: 'Enable DNS Proxy on Firewalls attached to the Firewall Policy.'\n            },\n            requireProxyForNetworkRules: {\n              type: 'boolean',\n              description: 'FQDNs in Network Rules are supported when set to true.',\n              'x-nullable': true\n            }\n          }\n        },\n        explicitProxy: {\n          description: 'Explicit Proxy Settings definition.',\n          type: 'object',\n          properties: {\n            enableExplicitProxy: {\n              type: 'boolean',\n              description: 'When set to true, explicit proxy mode is enabled.',\n              'x-nullable': true\n            },\n            httpPort: {\n              type: 'integer',\n              format: 'int32',\n              maximum: 64000,\n              exclusiveMaximum: false,\n              minimum: 0,\n              exclusiveMinimum: false,\n              description: 'Port number for explicit proxy http protocol, cannot be greater than 64000.'\n            },\n            httpsPort: {\n              type: 'integer',\n              format: 'int32',\n              maximum: 64000,\n              exclusiveMaximum: false,\n              minimum: 0,\n              exclusiveMinimum: false,\n              description: 'Port number for explicit proxy https protocol, cannot be greater than 64000.'\n            },\n            enablePacFile: {\n              type: 'boolean',\n              description: 'When set to true, pac file port and url needs to be provided.',\n              'x-nullable': true\n            },\n            pacFilePort: {\n              type: 'integer',\n              format: 'int32',\n              maximum: 64000,\n              exclusiveMaximum: false,\n              minimum: 0,\n              exclusiveMinimum: false,\n              description: 'Port number for firewall to serve PAC file.'\n            },\n            pacFile: { type: 'string', description: 'SAS URL for PAC file.' }\n          }\n        },\n        intrusionDetection: {\n          description: 'The configuration for Intrusion detection.',\n          type: 'object',\n          properties: {\n            mode: {\n              description: 'Intrusion detection general state.',\n              type: 'string',\n              enum: [ 'Off', 'Alert', 'Deny' ],\n              'x-ms-enum': {\n                name: 'FirewallPolicyIntrusionDetectionStateType',\n                modelAsString: true\n              }\n            },\n            configuration: {\n              description: 'Intrusion detection configuration properties.',\n              type: 'object',\n              properties: {\n                signatureOverrides: {\n                  type: 'array',\n                  description: 'List of specific signatures states.',\n                  items: {\n                    type: 'object',\n                    properties: {\n                      id: { type: 'string', description: 'Signature id.' },\n                      mode: {\n                        description: 'The signature state.',\n                        type: 'string',\n                        enum: [ 'Off', 'Alert', 'Deny' ],\n                        'x-ms-enum': {\n                          name: 'FirewallPolicyIntrusionDetectionStateType',\n                          modelAsString: true\n                        }\n                      }\n                    },\n                    description: 'Intrusion detection signatures specification states.'\n                  }\n                },\n                bypassTrafficSettings: {\n                  type: 'array',\n                  description: 'List of rules for traffic to bypass.',\n                  items: {\n                    type: 'object',\n                    properties: {\n                      name: {\n                        type: 'string',\n                        description: 'Name of the bypass traffic rule.'\n                      },\n                      description: {\n                        type: 'string',\n                        description: 'Description of the bypass traffic rule.'\n                      },\n                      protocol: {\n                        type: 'string',\n                        description: 'The rule bypass protocol.',\n                        enum: [ 'TCP', 'UDP', 'ICMP', 'ANY' ],\n                        'x-ms-enum': {\n                          name: 'FirewallPolicyIntrusionDetectionProtocol',\n                          modelAsString: true\n                        }\n                      },\n                      sourceAddresses: {\n                        type: 'array',\n                        description: 'List of source IP addresses or ranges for this rule.',\n                        items: { type: 'string' }\n                      },\n                      destinationAddresses: {\n                        type: 'array',\n                        description: 'List of destination IP addresses or ranges for this rule.',\n                        items: { type: 'string' }\n                      },\n                      destinationPorts: {\n                        type: 'array',\n                        description: 'List of destination ports or ranges.',\n                        items: { type: 'string' }\n                      },\n                      sourceIpGroups: {\n                        type: 'array',\n                        description: 'List of source IpGroups for this rule.',\n                        items: { type: 'string' }\n                      },\n                      destinationIpGroups: {\n                        type: 'array',\n                        description: 'List of destination IpGroups for this rule.',\n                        items: { type: 'string' }\n                      }\n                    },\n                    description: 'Intrusion detection bypass traffic specification.'\n                  },\n                  'x-ms-identifiers': []\n                },\n                privateRanges: {\n                  type: 'array',\n                  description: 'IDPS Private IP address ranges are used to identify traffic direction (i.e. inbound, outbound, etc.). By default, only ranges defined by IANA RFC 1918 are considered private IP addresses. To modify default ranges, specify your Private IP address ranges with this property',\n                  items: { type: 'string' },\n                  'x-ms-identifiers': []\n                }\n              }\n            }\n          }\n        },\n        transportSecurity: {\n          description: 'TLS Configuration definition.',\n          type: 'object',\n          properties: {\n            certificateAuthority: {\n              description: 'The CA used for intermediate CA generation.',\n              type: 'object',\n              properties: {\n                keyVaultSecretId: {\n                  type: 'string',\n                  description: \"Secret Id of (base-64 encoded unencrypted pfx) 'Secret' or 'Certificate' object stored in KeyVault.\"\n                },\n                name: {\n                  type: 'string',\n                  description: 'Name of the CA certificate.'\n                }\n              }\n            }\n          }\n        },\n        sku: {\n          description: 'The Firewall Policy SKU.',\n          type: 'object',\n          properties: {\n            tier: {\n              type: 'string',\n              description: 'Tier of Firewall Policy.',\n              enum: [ 'Standard', 'Premium', 'Basic' ],\n              'x-ms-enum': { name: 'FirewallPolicySkuTier', modelAsString: true }\n            }\n          }\n        }\n      }\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    },\n    identity: {\n      description: 'The identity of the firewall policy.',\n      properties: {\n        principalId: {\n          readOnly: true,\n          type: 'string',\n          description: 'The principal id of the system assigned identity. This property will only be provided for a system assigned identity.'\n        },\n        tenantId: {\n          readOnly: true,\n          type: 'string',\n          description: 'The tenant id of the system assigned identity. This property will only be provided for a system assigned identity.'\n        },\n        type: {\n          type: 'string',\n          description: \"The type of identity used for the resource. The type 'SystemAssigned, UserAssigned' includes both an implicitly created identity and a set of user assigned identities. The type 'None' will remove any identities from the virtual machine.\",\n          enum: [\n            'SystemAssigned',\n            'UserAssigned',\n            'SystemAssigned, UserAssigned',\n            'None'\n          ],\n          'x-ms-enum': { name: 'ResourceIdentityType', modelAsString: false }\n        },\n        userAssignedIdentities: {\n          type: 'object',\n          additionalProperties: {\n            type: 'object',\n            properties: {\n              principalId: {\n                readOnly: true,\n                type: 'string',\n                description: 'The principal id of user assigned identity.'\n              },\n              clientId: {\n                readOnly: true,\n                type: 'string',\n                description: 'The client id of user assigned identity.'\n              }\n            }\n          },\n          description: \"The list of user identities associated with resource. The user identity dictionary key references will be ARM resource ids in the form: '/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'.\"\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'FirewallPolicy Resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-01-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/firewallPolicy.json"},"here"),"."))}u.isMDXComponent=!0}}]);