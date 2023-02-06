"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[32341],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>m});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},d=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},l=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,s=e.originalType,c=e.parentName,d=a(e,["components","mdxType","originalType","parentName"]),l=p(n),m=i,g=l["".concat(c,".").concat(m)]||l[m]||u[m]||s;return n?r.createElement(g,o(o({ref:t},d),{},{components:n})):r.createElement(g,o({ref:t},d))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var s=n.length,o=new Array(s);o[0]=l;var a={};for(var c in t)hasOwnProperty.call(t,c)&&(a[c]=t[c]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var p=2;p<s;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}l.displayName="MDXCreateElement"},88222:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>p});var r=n(87462),i=(n(67294),n(3905));const s={id:"CertificateOrder",title:"CertificateOrder"},o=void 0,a={unversionedId:"azure/resources/Web/CertificateOrder",id:"azure/resources/Web/CertificateOrder",title:"CertificateOrder",description:"Provides a CertificateOrder from the Web group",source:"@site/docs/azure/resources/Web/CertificateOrder.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/CertificateOrder",permalink:"/docs/azure/resources/Web/CertificateOrder",draft:!1,tags:[],version:"current",frontMatter:{id:"CertificateOrder",title:"CertificateOrder"},sidebar:"docs",previous:{title:"Certificate",permalink:"/docs/azure/resources/Web/Certificate"},next:{title:"CertificateOrderCertificate",permalink:"/docs/azure/resources/Web/CertificateOrderCertificate"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],d={toc:p};function u(e){let{components:t,...n}=e;return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"CertificateOrder")," from the ",(0,i.kt)("strong",{parentName:"p"},"Web")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Certificate"},"Certificate"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Certificate purchase order',\n  type: 'object',\n  allOf: [\n    {\n      required: [ 'location' ],\n      properties: {\n        id: { description: 'Resource Id', type: 'string' },\n        name: { description: 'Resource Name', type: 'string' },\n        kind: { description: 'Kind of resource', type: 'string' },\n        location: { description: 'Resource Location', type: 'string' },\n        type: { description: 'Resource type', type: 'string' },\n        tags: {\n          description: 'Resource tags',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      properties: {\n        certificates: {\n          description: 'State of the Key Vault secret',\n          type: 'object',\n          additionalProperties: {\n            description: 'Class representing the Key Vault container for certificate purchased through Azure',\n            type: 'object',\n            allOf: [\n              {\n                required: [ 'location' ],\n                properties: {\n                  id: { description: 'Resource Id', type: 'string' },\n                  name: { description: 'Resource Name', type: 'string' },\n                  kind: { description: 'Kind of resource', type: 'string' },\n                  location: { description: 'Resource Location', type: 'string' },\n                  type: { description: 'Resource type', type: 'string' },\n                  tags: {\n                    description: 'Resource tags',\n                    type: 'object',\n                    additionalProperties: { type: 'string' }\n                  }\n                },\n                'x-ms-azure-resource': true\n              }\n            ],\n            properties: {\n              properties: {\n                properties: {\n                  keyVaultId: {\n                    description: 'Key Vault Csm resource Id',\n                    type: 'string'\n                  },\n                  keyVaultSecretName: {\n                    description: 'Key Vault secret name',\n                    type: 'string'\n                  },\n                  provisioningState: {\n                    description: 'Status of the Key Vault secret',\n                    enum: [\n                      'Initialized',\n                      'WaitingOnCertificateOrder',\n                      'Succeeded',\n                      'CertificateOrderFailed',\n                      'OperationNotPermittedOnKeyVault',\n                      'AzureServiceUnauthorizedToAccessKeyVault',\n                      'KeyVaultDoesNotExist',\n                      'KeyVaultSecretDoesNotExist',\n                      'UnknownError',\n                      'Unknown'\n                    ],\n                    type: 'string',\n                    'x-ms-enum': {\n                      name: 'KeyVaultSecretStatus',\n                      modelAsString: false\n                    }\n                  }\n                },\n                'x-ms-client-flatten': true\n              }\n            }\n          }\n        },\n        distinguishedName: {\n          description: 'Certificate distinguished name',\n          type: 'string'\n        },\n        domainVerificationToken: { description: 'Domain Verification Token', type: 'string' },\n        validityInYears: {\n          format: 'int32',\n          description: 'Duration in years (must be between 1 and 3)',\n          type: 'integer'\n        },\n        keySize: {\n          format: 'int32',\n          description: 'Certificate Key Size',\n          type: 'integer'\n        },\n        productType: {\n          description: 'Certificate product type',\n          enum: [\n            'StandardDomainValidatedSsl',\n            'StandardDomainValidatedWildCardSsl'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'CertificateProductType', modelAsString: false }\n        },\n        autoRenew: { description: 'Auto renew', type: 'boolean' },\n        provisioningState: {\n          description: 'Status of certificate order',\n          enum: [\n            'Succeeded',\n            'Failed',\n            'Canceled',\n            'InProgress',\n            'Deleting'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }\n        },\n        status: {\n          description: 'Current order status',\n          enum: [\n            'Pendingissuance',\n            'Issued',\n            'Revoked',\n            'Canceled',\n            'Denied',\n            'Pendingrevocation',\n            'PendingRekey',\n            'Unused',\n            'Expired',\n            'NotSubmitted'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'CertificateOrderStatus', modelAsString: false }\n        },\n        signedCertificate: {\n          description: 'Signed certificate',\n          type: 'object',\n          allOf: [\n            {\n              required: [ 'location' ],\n              properties: {\n                id: { description: 'Resource Id', type: 'string' },\n                name: { description: 'Resource Name', type: 'string' },\n                kind: { description: 'Kind of resource', type: 'string' },\n                location: { description: 'Resource Location', type: 'string' },\n                type: { description: 'Resource type', type: 'string' },\n                tags: {\n                  description: 'Resource tags',\n                  type: 'object',\n                  additionalProperties: { type: 'string' }\n                }\n              },\n              'x-ms-azure-resource': true\n            }\n          ],\n          properties: {\n            properties: {\n              properties: {\n                version: {\n                  format: 'int32',\n                  description: 'Version',\n                  type: 'integer'\n                },\n                serialNumber: { description: 'Serial Number', type: 'string' },\n                thumbprint: { description: 'Thumbprint', type: 'string' },\n                subject: { description: 'Subject', type: 'string' },\n                notBefore: {\n                  format: 'date-time',\n                  description: 'Valid from',\n                  type: 'string'\n                },\n                notAfter: {\n                  format: 'date-time',\n                  description: 'Valid to',\n                  type: 'string'\n                },\n                signatureAlgorithm: { description: 'Signature Algorithm', type: 'string' },\n                issuer: { description: 'Issuer', type: 'string' },\n                rawData: { description: 'Raw certificate data', type: 'string' }\n              },\n              'x-ms-client-flatten': true\n            }\n          }\n        },\n        csr: {\n          description: 'Last CSR that was created for this order',\n          type: 'string'\n        },\n        intermediate: {\n          description: 'Intermediate certificate',\n          type: 'object',\n          allOf: [\n            {\n              required: [ 'location' ],\n              properties: {\n                id: { description: 'Resource Id', type: 'string' },\n                name: { description: 'Resource Name', type: 'string' },\n                kind: { description: 'Kind of resource', type: 'string' },\n                location: { description: 'Resource Location', type: 'string' },\n                type: { description: 'Resource type', type: 'string' },\n                tags: {\n                  description: 'Resource tags',\n                  type: 'object',\n                  additionalProperties: { type: 'string' }\n                }\n              },\n              'x-ms-azure-resource': true\n            }\n          ],\n          properties: {\n            properties: {\n              properties: {\n                version: {\n                  format: 'int32',\n                  description: 'Version',\n                  type: 'integer'\n                },\n                serialNumber: { description: 'Serial Number', type: 'string' },\n                thumbprint: { description: 'Thumbprint', type: 'string' },\n                subject: { description: 'Subject', type: 'string' },\n                notBefore: {\n                  format: 'date-time',\n                  description: 'Valid from',\n                  type: 'string'\n                },\n                notAfter: {\n                  format: 'date-time',\n                  description: 'Valid to',\n                  type: 'string'\n                },\n                signatureAlgorithm: { description: 'Signature Algorithm', type: 'string' },\n                issuer: { description: 'Issuer', type: 'string' },\n                rawData: { description: 'Raw certificate data', type: 'string' }\n              },\n              'x-ms-client-flatten': true\n            }\n          }\n        },\n        root: {\n          description: 'Root certificate',\n          type: 'object',\n          allOf: [\n            {\n              required: [ 'location' ],\n              properties: {\n                id: { description: 'Resource Id', type: 'string' },\n                name: { description: 'Resource Name', type: 'string' },\n                kind: { description: 'Kind of resource', type: 'string' },\n                location: { description: 'Resource Location', type: 'string' },\n                type: { description: 'Resource type', type: 'string' },\n                tags: {\n                  description: 'Resource tags',\n                  type: 'object',\n                  additionalProperties: { type: 'string' }\n                }\n              },\n              'x-ms-azure-resource': true\n            }\n          ],\n          properties: {\n            properties: {\n              properties: {\n                version: {\n                  format: 'int32',\n                  description: 'Version',\n                  type: 'integer'\n                },\n                serialNumber: { description: 'Serial Number', type: 'string' },\n                thumbprint: { description: 'Thumbprint', type: 'string' },\n                subject: { description: 'Subject', type: 'string' },\n                notBefore: {\n                  format: 'date-time',\n                  description: 'Valid from',\n                  type: 'string'\n                },\n                notAfter: {\n                  format: 'date-time',\n                  description: 'Valid to',\n                  type: 'string'\n                },\n                signatureAlgorithm: { description: 'Signature Algorithm', type: 'string' },\n                issuer: { description: 'Issuer', type: 'string' },\n                rawData: { description: 'Raw certificate data', type: 'string' }\n              },\n              'x-ms-client-flatten': true\n            }\n          }\n        },\n        serialNumber: {\n          description: 'Current serial number of the certificate',\n          type: 'string'\n        },\n        lastCertificateIssuanceTime: {\n          format: 'date-time',\n          description: 'Certificate last issuance time',\n          type: 'string'\n        },\n        expirationTime: {\n          format: 'date-time',\n          description: 'Certificate expiration time',\n          type: 'string'\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2015-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json"},"here"),"."))}u.isMDXComponent=!0}}]);