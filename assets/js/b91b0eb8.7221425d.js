"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[78585],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>f});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},d=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},u="mdxType",l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),u=p(n),m=i,f=u["".concat(c,".").concat(m)]||u[m]||l[m]||a;return n?r.createElement(f,s(s({ref:t},d),{},{components:n})):r.createElement(f,s({ref:t},d))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,s=new Array(a);s[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[u]="string"==typeof e?e:i,s[1]=o;for(var p=2;p<a;p++)s[p]=n[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},55710:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>l,frontMatter:()=>a,metadata:()=>o,toc:()=>p});var r=n(87462),i=(n(67294),n(3905));const a={id:"AppServiceCertificateOrder",title:"AppServiceCertificateOrder"},s=void 0,o={unversionedId:"azure/resources/CertificateRegistration/AppServiceCertificateOrder",id:"azure/resources/CertificateRegistration/AppServiceCertificateOrder",title:"AppServiceCertificateOrder",description:"Provides a AppServiceCertificateOrder from the CertificateRegistration group",source:"@site/docs/azure/resources/CertificateRegistration/AppServiceCertificateOrder.md",sourceDirName:"azure/resources/CertificateRegistration",slug:"/azure/resources/CertificateRegistration/AppServiceCertificateOrder",permalink:"/docs/azure/resources/CertificateRegistration/AppServiceCertificateOrder",draft:!1,tags:[],version:"current",frontMatter:{id:"AppServiceCertificateOrder",title:"AppServiceCertificateOrder"},sidebar:"docs",previous:{title:"ScopeAccessReviewScheduleDefinitionById",permalink:"/docs/azure/resources/Authorization/ScopeAccessReviewScheduleDefinitionById"},next:{title:"AppServiceCertificateOrderCertificate",permalink:"/docs/azure/resources/CertificateRegistration/AppServiceCertificateOrderCertificate"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"Create Certificate order",id:"create-certificate-order",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],d={toc:p},u="wrapper";function l(e){let{components:t,...n}=e;return(0,i.kt)(u,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"AppServiceCertificateOrder")," from the ",(0,i.kt)("strong",{parentName:"p"},"CertificateRegistration")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-certificate-order"},"Create Certificate order"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "AppServiceCertificateOrder",\n    group: "CertificateRegistration",\n    name: "myAppServiceCertificateOrder",\n    properties: () => ({\n      location: "Global",\n      properties: {\n        certificates: {\n          SampleCertName1: {\n            keyVaultId:\n              "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourcegroups/testrg123/providers/microsoft.keyvault/vaults/SamplevaultName",\n            keyVaultSecretName: "SampleSecretName1",\n          },\n          SampleCertName2: {\n            keyVaultId:\n              "/subscriptions/34adfa4f-cedf-4dc0-ba29-b6d1a69ab345/resourcegroups/testrg123/providers/microsoft.keyvault/vaults/SamplevaultName",\n            keyVaultSecretName: "SampleSecretName2",\n          },\n        },\n        distinguishedName: "CN=SampleCustomDomain.com",\n        validityInYears: 2,\n        keySize: 2048,\n        productType: "StandardDomainValidatedSsl",\n        autoRenew: true,\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'SSL certificate purchase order.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure resource. This resource is tracked in Azure Resource Manager',\n      required: [ 'location' ],\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        location: { description: 'Resource Location.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        },\n        tags: {\n          description: 'Resource tags.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'AppServiceCertificateOrder resource specific properties',\n      required: [ 'productType' ],\n      type: 'object',\n      properties: {\n        certificates: {\n          description: 'State of the Key Vault secret.',\n          type: 'object',\n          additionalProperties: {\n            description: 'Key Vault container for a certificate that is purchased through Azure.',\n            type: 'object',\n            properties: {\n              keyVaultId: { description: 'Key Vault resource Id.', type: 'string' },\n              keyVaultSecretName: { description: 'Key Vault secret name.', type: 'string' },\n              provisioningState: {\n                description: 'Status of the Key Vault secret.',\n                enum: [\n                  'Initialized',\n                  'WaitingOnCertificateOrder',\n                  'Succeeded',\n                  'CertificateOrderFailed',\n                  'OperationNotPermittedOnKeyVault',\n                  'AzureServiceUnauthorizedToAccessKeyVault',\n                  'KeyVaultDoesNotExist',\n                  'KeyVaultSecretDoesNotExist',\n                  'UnknownError',\n                  'ExternalPrivateKey',\n                  'Unknown'\n                ],\n                type: 'string',\n                readOnly: true,\n                'x-ms-enum': { name: 'KeyVaultSecretStatus', modelAsString: false }\n              }\n            }\n          }\n        },\n        distinguishedName: {\n          description: 'Certificate distinguished name.',\n          type: 'string',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        domainVerificationToken: {\n          description: 'Domain verification token.',\n          type: 'string',\n          readOnly: true\n        },\n        validityInYears: {\n          format: 'int32',\n          description: 'Duration in years (must be 1).',\n          default: 1,\n          type: 'integer',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        keySize: {\n          format: 'int32',\n          description: 'Certificate key size.',\n          default: 2048,\n          type: 'integer',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        productType: {\n          description: 'Certificate product type.',\n          enum: [\n            'StandardDomainValidatedSsl',\n            'StandardDomainValidatedWildCardSsl'\n          ],\n          type: 'string',\n          'x-ms-enum': { name: 'CertificateProductType', modelAsString: false },\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        autoRenew: {\n          description: '<code>true</code> if the certificate should be automatically renewed when it expires; otherwise, <code>false</code>.',\n          default: true,\n          type: 'boolean'\n        },\n        provisioningState: {\n          description: 'Status of certificate order.',\n          enum: [\n            'Succeeded',\n            'Failed',\n            'Canceled',\n            'InProgress',\n            'Deleting'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }\n        },\n        status: {\n          description: 'Current order status.',\n          enum: [\n            'Pendingissuance',\n            'Issued',\n            'Revoked',\n            'Canceled',\n            'Denied',\n            'Pendingrevocation',\n            'PendingRekey',\n            'Unused',\n            'Expired',\n            'NotSubmitted'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'CertificateOrderStatus', modelAsString: false }\n        },\n        signedCertificate: {\n          description: 'Signed certificate.',\n          readOnly: true,\n          type: 'object',\n          properties: {\n            version: {\n              format: 'int32',\n              description: 'Certificate Version.',\n              type: 'integer',\n              readOnly: true\n            },\n            serialNumber: {\n              description: 'Certificate Serial Number.',\n              type: 'string',\n              readOnly: true\n            },\n            thumbprint: {\n              description: 'Certificate Thumbprint.',\n              type: 'string',\n              readOnly: true\n            },\n            subject: {\n              description: 'Certificate Subject.',\n              type: 'string',\n              readOnly: true\n            },\n            notBefore: {\n              format: 'date-time',\n              description: 'Date Certificate is valid from.',\n              type: 'string',\n              readOnly: true\n            },\n            notAfter: {\n              format: 'date-time',\n              description: 'Date Certificate is valid to.',\n              type: 'string',\n              readOnly: true\n            },\n            signatureAlgorithm: {\n              description: 'Certificate Signature algorithm.',\n              type: 'string',\n              readOnly: true\n            },\n            issuer: {\n              description: 'Certificate Issuer.',\n              type: 'string',\n              readOnly: true\n            },\n            rawData: {\n              description: 'Raw certificate data.',\n              type: 'string',\n              readOnly: true\n            }\n          }\n        },\n        csr: {\n          description: 'Last CSR that was created for this order.',\n          type: 'string',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        intermediate: {\n          description: 'Intermediate certificate.',\n          readOnly: true,\n          type: 'object',\n          properties: {\n            version: {\n              format: 'int32',\n              description: 'Certificate Version.',\n              type: 'integer',\n              readOnly: true\n            },\n            serialNumber: {\n              description: 'Certificate Serial Number.',\n              type: 'string',\n              readOnly: true\n            },\n            thumbprint: {\n              description: 'Certificate Thumbprint.',\n              type: 'string',\n              readOnly: true\n            },\n            subject: {\n              description: 'Certificate Subject.',\n              type: 'string',\n              readOnly: true\n            },\n            notBefore: {\n              format: 'date-time',\n              description: 'Date Certificate is valid from.',\n              type: 'string',\n              readOnly: true\n            },\n            notAfter: {\n              format: 'date-time',\n              description: 'Date Certificate is valid to.',\n              type: 'string',\n              readOnly: true\n            },\n            signatureAlgorithm: {\n              description: 'Certificate Signature algorithm.',\n              type: 'string',\n              readOnly: true\n            },\n            issuer: {\n              description: 'Certificate Issuer.',\n              type: 'string',\n              readOnly: true\n            },\n            rawData: {\n              description: 'Raw certificate data.',\n              type: 'string',\n              readOnly: true\n            }\n          }\n        },\n        root: {\n          description: 'Root certificate.',\n          readOnly: true,\n          type: 'object',\n          properties: {\n            version: {\n              format: 'int32',\n              description: 'Certificate Version.',\n              type: 'integer',\n              readOnly: true\n            },\n            serialNumber: {\n              description: 'Certificate Serial Number.',\n              type: 'string',\n              readOnly: true\n            },\n            thumbprint: {\n              description: 'Certificate Thumbprint.',\n              type: 'string',\n              readOnly: true\n            },\n            subject: {\n              description: 'Certificate Subject.',\n              type: 'string',\n              readOnly: true\n            },\n            notBefore: {\n              format: 'date-time',\n              description: 'Date Certificate is valid from.',\n              type: 'string',\n              readOnly: true\n            },\n            notAfter: {\n              format: 'date-time',\n              description: 'Date Certificate is valid to.',\n              type: 'string',\n              readOnly: true\n            },\n            signatureAlgorithm: {\n              description: 'Certificate Signature algorithm.',\n              type: 'string',\n              readOnly: true\n            },\n            issuer: {\n              description: 'Certificate Issuer.',\n              type: 'string',\n              readOnly: true\n            },\n            rawData: {\n              description: 'Raw certificate data.',\n              type: 'string',\n              readOnly: true\n            }\n          }\n        },\n        serialNumber: {\n          description: 'Current serial number of the certificate.',\n          type: 'string',\n          readOnly: true\n        },\n        lastCertificateIssuanceTime: {\n          format: 'date-time',\n          description: 'Certificate last issuance time.',\n          type: 'string',\n          readOnly: true\n        },\n        expirationTime: {\n          format: 'date-time',\n          description: 'Certificate expiration time.',\n          type: 'string',\n          readOnly: true\n        },\n        isPrivateKeyExternal: {\n          description: '<code>true</code> if private key is external; otherwise, <code>false</code>.',\n          type: 'boolean',\n          readOnly: true\n        },\n        appServiceCertificateNotRenewableReasons: {\n          description: 'Reasons why App Service Certificate is not renewable at the current moment.',\n          type: 'array',\n          items: {\n            enum: [\n              'RegistrationStatusNotSupportedForRenewal',\n              'ExpirationNotInRenewalTimeRange',\n              'SubscriptionNotActive'\n            ],\n            type: 'string',\n            'x-ms-enum': { name: 'ResourceNotRenewableReason', modelAsString: true }\n          },\n          readOnly: true\n        },\n        nextAutoRenewalTimeStamp: {\n          format: 'date-time',\n          description: 'Time stamp when the certificate would be auto renewed next',\n          type: 'string',\n          readOnly: true\n        },\n        contact: {\n          description: 'Contact info',\n          readOnly: true,\n          type: 'object',\n          properties: {\n            email: { type: 'string' },\n            nameFirst: { type: 'string' },\n            nameLast: { type: 'string' },\n            phone: { type: 'string' }\n          }\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.CertificateRegistration/stable/2022-03-01/AppServiceCertificateOrders.json"},"here"),"."))}l.isMDXComponent=!0}}]);