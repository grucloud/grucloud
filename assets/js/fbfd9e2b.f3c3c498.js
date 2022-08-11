"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[36554],{3905:(e,n,t)=>{t.d(n,{Zo:()=>l,kt:()=>d});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=r.createContext({}),c=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},l=function(e){var n=c(e.components);return r.createElement(p.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},y=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),y=c(t),d=i,m=y["".concat(p,".").concat(d)]||y[d]||u[d]||o;return t?r.createElement(m,a(a({ref:n},l),{},{components:t})):r.createElement(m,a({ref:n},l))}));function d(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=y;var s={};for(var p in n)hasOwnProperty.call(n,p)&&(s[p]=n[p]);s.originalType=e,s.mdxType="string"==typeof e?e:i,a[1]=s;for(var c=2;c<o;c++)a[c]=t[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}y.displayName="MDXCreateElement"},66636:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>a,default:()=>u,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=t(87462),i=(t(67294),t(3905));const o={id:"Key",title:"Key"},a=void 0,s={unversionedId:"azure/resources/KeyVault/Key",id:"azure/resources/KeyVault/Key",title:"Key",description:"Provides a Key from the KeyVault group",source:"@site/docs/azure/resources/KeyVault/Key.md",sourceDirName:"azure/resources/KeyVault",slug:"/azure/resources/KeyVault/Key",permalink:"/docs/azure/resources/KeyVault/Key",draft:!1,tags:[],version:"current",frontMatter:{id:"Key",title:"Key"},sidebar:"docs",previous:{title:"DomainOwnershipIdentifier",permalink:"/docs/azure/resources/DomainRegistration/DomainOwnershipIdentifier"},next:{title:"MHSMPrivateEndpointConnection",permalink:"/docs/azure/resources/KeyVault/MHSMPrivateEndpointConnection"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Create a key",id:"create-a-key",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:c};function u(e){let{components:n,...t}=e;return(0,i.kt)("wrapper",(0,r.Z)({},l,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"Key")," from the ",(0,i.kt)("strong",{parentName:"p"},"KeyVault")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-a-key"},"Create a key"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Key",\n    group: "KeyVault",\n    name: "myKey",\n    properties: () => ({ properties: { kty: "RSA" } }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vault: "myVault",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/KeyVault/Vault"},"Vault"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    tags: {\n      type: 'object',\n      additionalProperties: { type: 'string' },\n      description: 'The tags that will be assigned to the key.'\n    },\n    properties: {\n      description: 'The properties of the key to be created.',\n      properties: {\n        attributes: {\n          description: 'The attributes of the key.',\n          properties: {\n            enabled: {\n              type: 'boolean',\n              description: 'Determines whether or not the object is enabled.'\n            },\n            nbf: {\n              'x-ms-client-name': 'NotBefore',\n              type: 'integer',\n              format: 'int64',\n              description: 'Not before date in seconds since 1970-01-01T00:00:00Z.'\n            },\n            exp: {\n              'x-ms-client-name': 'Expires',\n              type: 'integer',\n              format: 'int64',\n              description: 'Expiry date in seconds since 1970-01-01T00:00:00Z.'\n            },\n            created: {\n              type: 'integer',\n              format: 'int64',\n              readOnly: true,\n              description: 'Creation time in seconds since 1970-01-01T00:00:00Z.'\n            },\n            updated: {\n              type: 'integer',\n              format: 'int64',\n              readOnly: true,\n              description: 'Last updated time in seconds since 1970-01-01T00:00:00Z.'\n            },\n            recoveryLevel: {\n              type: 'string',\n              description: \"The deletion recovery level currently in effect for the object. If it contains 'Purgeable', then the object can be permanently deleted by a privileged user; otherwise, only the system can purge the object at the end of the retention interval.\",\n              enum: [\n                'Purgeable',\n                'Recoverable+Purgeable',\n                'Recoverable',\n                'Recoverable+ProtectedSubscription'\n              ],\n              'x-ms-enum': { name: 'DeletionRecoveryLevel', modelAsString: true },\n              readOnly: true,\n              'x-nullable': false\n            },\n            exportable: {\n              type: 'boolean',\n              description: 'Indicates if the private key can be exported.'\n            }\n          },\n          type: 'object'\n        },\n        kty: {\n          type: 'string',\n          minLength: 1,\n          description: 'The type of the key. For valid values, see JsonWebKeyType.',\n          enum: [ 'EC', 'EC-HSM', 'RSA', 'RSA-HSM' ],\n          'x-ms-enum': { name: 'JsonWebKeyType', modelAsString: true }\n        },\n        keyOps: {\n          type: 'array',\n          items: {\n            type: 'string',\n            description: 'The permitted JSON web key operations of the key. For more information, see JsonWebKeyOperation.',\n            enum: [\n              'encrypt', 'decrypt',\n              'sign',    'verify',\n              'wrapKey', 'unwrapKey',\n              'import',  'release'\n            ],\n            'x-ms-enum': { name: 'JsonWebKeyOperation', modelAsString: true }\n          }\n        },\n        keySize: {\n          type: 'integer',\n          format: 'int32',\n          description: 'The key size in bits. For example: 2048, 3072, or 4096 for RSA.'\n        },\n        curveName: {\n          type: 'string',\n          description: 'The elliptic curve name. For valid values, see JsonWebKeyCurveName.',\n          enum: [ 'P-256', 'P-384', 'P-521', 'P-256K' ],\n          'x-ms-enum': { name: 'JsonWebKeyCurveName', modelAsString: true }\n        },\n        keyUri: {\n          type: 'string',\n          description: 'The URI to retrieve the current version of the key.',\n          readOnly: true\n        },\n        keyUriWithVersion: {\n          type: 'string',\n          description: 'The URI to retrieve the specific version of the key.',\n          readOnly: true\n        },\n        rotationPolicy: {\n          description: 'Key rotation policy in response. It will be used for both output and input. Omitted if empty',\n          properties: {\n            attributes: {\n              description: 'The attributes of key rotation policy.',\n              properties: {\n                created: {\n                  type: 'integer',\n                  format: 'int64',\n                  readOnly: true,\n                  description: 'Creation time in seconds since 1970-01-01T00:00:00Z.'\n                },\n                updated: {\n                  type: 'integer',\n                  format: 'int64',\n                  readOnly: true,\n                  description: 'Last updated time in seconds since 1970-01-01T00:00:00Z.'\n                },\n                expiryTime: {\n                  type: 'string',\n                  description: \"The expiration time for the new key version. It should be in ISO8601 format. Eg: 'P90D', 'P1Y'.\"\n                }\n              },\n              type: 'object'\n            },\n            lifetimeActions: {\n              type: 'array',\n              items: {\n                properties: {\n                  trigger: {\n                    description: 'The trigger of key rotation policy lifetimeAction.',\n                    properties: {\n                      timeAfterCreate: {\n                        type: 'string',\n                        description: \"The time duration after key creation to rotate the key. It only applies to rotate. It will be in ISO 8601 duration format. Eg: 'P90D', 'P1Y'.\"\n                      },\n                      timeBeforeExpiry: {\n                        type: 'string',\n                        description: \"The time duration before key expiring to rotate or notify. It will be in ISO 8601 duration format. Eg: 'P90D', 'P1Y'.\"\n                      }\n                    },\n                    type: 'object'\n                  },\n                  action: {\n                    description: 'The action of key rotation policy lifetimeAction.',\n                    properties: {\n                      type: {\n                        type: 'string',\n                        description: 'The type of action.',\n                        enum: [ 'rotate', 'notify' ],\n                        'x-ms-enum': {\n                          name: 'KeyRotationPolicyActionType',\n                          modelAsString: false\n                        }\n                      }\n                    },\n                    type: 'object'\n                  }\n                },\n                type: 'object'\n              },\n              description: 'The lifetimeActions for key rotation action.'\n            }\n          },\n          type: 'object'\n        },\n        release_policy: {\n          description: 'Key release policy in response. It will be used for both output and input. Omitted if empty',\n          properties: {\n            contentType: {\n              description: 'Content type and version of key release policy',\n              type: 'string',\n              default: 'application/json; charset=utf-8'\n            },\n            data: {\n              description: 'Blob encoding the policy rules under which the key can be released.',\n              type: 'string',\n              format: 'base64url'\n            }\n          },\n          type: 'object'\n        }\n      },\n      type: 'object'\n    }\n  },\n  description: 'The parameters used to create a key.',\n  required: [ 'properties' ],\n  'x-ms-azure-resource': true,\n  type: 'object'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-07-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/stable/2022-07-01/keys.json"},"here"),"."))}u.isMDXComponent=!0}}]);