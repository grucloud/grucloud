"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[63790],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return u}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},s=Object.keys(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var d=r.createContext({}),p=function(e){var n=r.useContext(d),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},c=function(e){var n=p(e.components);return r.createElement(d.Provider,{value:n},e.children)},m={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,s=e.originalType,d=e.parentName,c=a(e,["components","mdxType","originalType","parentName"]),l=p(t),u=i,g=l["".concat(d,".").concat(u)]||l[u]||m[u]||s;return t?r.createElement(g,o(o({ref:n},c),{},{components:t})):r.createElement(g,o({ref:n},c))}));function u(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var s=t.length,o=new Array(s);o[0]=l;var a={};for(var d in n)hasOwnProperty.call(n,d)&&(a[d]=n[d]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var p=2;p<s;p++)o[p]=t[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},56046:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return d},metadata:function(){return p},toc:function(){return c},default:function(){return l}});var r=t(87462),i=t(63366),s=(t(67294),t(3905)),o=["components"],a={id:"Domain",title:"Domain"},d=void 0,p={unversionedId:"azure/resources/DomainRegistration/Domain",id:"azure/resources/DomainRegistration/Domain",isDocsHomePage:!1,title:"Domain",description:"Provides a Domain from the DomainRegistration group",source:"@site/docs/azure/resources/DomainRegistration/Domain.md",sourceDirName:"azure/resources/DomainRegistration",slug:"/azure/resources/DomainRegistration/Domain",permalink:"/docs/azure/resources/DomainRegistration/Domain",tags:[],version:"current",frontMatter:{id:"Domain",title:"Domain"},sidebar:"docs",previous:{title:"TableResourceTableThroughput",permalink:"/docs/azure/resources/DocumentDB/TableResourceTableThroughput"},next:{title:"DomainOwnershipIdentifier",permalink:"/docs/azure/resources/DomainRegistration/DomainOwnershipIdentifier"}},c=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],m={toc:c};function l(e){var n=e.components,t=(0,i.Z)(e,o);return(0,s.kt)("wrapper",(0,r.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provides a ",(0,s.kt)("strong",{parentName:"p"},"Domain")," from the ",(0,s.kt)("strong",{parentName:"p"},"DomainRegistration")," group"),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,s.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Information about a domain.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure resource. This resource is tracked in Azure Resource Manager',\n      required: [ 'location' ],\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        location: { description: 'Resource Location.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        },\n        tags: {\n          description: 'Resource tags.',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Domain resource specific properties',\n      required: [\n        'contactAdmin',\n        'contactBilling',\n        'contactRegistrant',\n        'contactTech',\n        'consent'\n      ],\n      type: 'object',\n      properties: {\n        contactAdmin: {\n          description: 'Administrative contact.',\n          'x-ms-mutability': [ 'create' ],\n          required: [ 'email', 'nameFirst', 'nameLast', 'phone' ],\n          type: 'object',\n          properties: {\n            addressMailing: {\n              description: 'Mailing address.',\n              required: [ 'address1', 'city', 'country', 'postalCode', 'state' ],\n              type: 'object',\n              properties: {\n                address1: {\n                  description: 'First line of an Address.',\n                  type: 'string'\n                },\n                address2: {\n                  description: 'The second line of the Address. Optional.',\n                  type: 'string'\n                },\n                city: {\n                  description: 'The city for the address.',\n                  type: 'string'\n                },\n                country: {\n                  description: 'The country for the address.',\n                  type: 'string'\n                },\n                postalCode: {\n                  description: 'The postal code for the address.',\n                  type: 'string'\n                },\n                state: {\n                  description: 'The state or province for the address.',\n                  type: 'string'\n                }\n              }\n            },\n            email: { description: 'Email address.', type: 'string' },\n            fax: { description: 'Fax number.', type: 'string' },\n            jobTitle: { description: 'Job title.', type: 'string' },\n            nameFirst: { description: 'First name.', type: 'string' },\n            nameLast: { description: 'Last name.', type: 'string' },\n            nameMiddle: { description: 'Middle name.', type: 'string' },\n            organization: {\n              description: 'Organization contact belongs to.',\n              type: 'string'\n            },\n            phone: { description: 'Phone number.', type: 'string' }\n          }\n        },\n        contactBilling: {\n          description: 'Billing contact.',\n          'x-ms-mutability': [ 'create' ],\n          required: [ 'email', 'nameFirst', 'nameLast', 'phone' ],\n          type: 'object',\n          properties: {\n            addressMailing: {\n              description: 'Mailing address.',\n              required: [ 'address1', 'city', 'country', 'postalCode', 'state' ],\n              type: 'object',\n              properties: {\n                address1: {\n                  description: 'First line of an Address.',\n                  type: 'string'\n                },\n                address2: {\n                  description: 'The second line of the Address. Optional.',\n                  type: 'string'\n                },\n                city: {\n                  description: 'The city for the address.',\n                  type: 'string'\n                },\n                country: {\n                  description: 'The country for the address.',\n                  type: 'string'\n                },\n                postalCode: {\n                  description: 'The postal code for the address.',\n                  type: 'string'\n                },\n                state: {\n                  description: 'The state or province for the address.',\n                  type: 'string'\n                }\n              }\n            },\n            email: { description: 'Email address.', type: 'string' },\n            fax: { description: 'Fax number.', type: 'string' },\n            jobTitle: { description: 'Job title.', type: 'string' },\n            nameFirst: { description: 'First name.', type: 'string' },\n            nameLast: { description: 'Last name.', type: 'string' },\n            nameMiddle: { description: 'Middle name.', type: 'string' },\n            organization: {\n              description: 'Organization contact belongs to.',\n              type: 'string'\n            },\n            phone: { description: 'Phone number.', type: 'string' }\n          }\n        },\n        contactRegistrant: {\n          description: 'Registrant contact.',\n          'x-ms-mutability': [ 'create' ],\n          required: [ 'email', 'nameFirst', 'nameLast', 'phone' ],\n          type: 'object',\n          properties: {\n            addressMailing: {\n              description: 'Mailing address.',\n              required: [ 'address1', 'city', 'country', 'postalCode', 'state' ],\n              type: 'object',\n              properties: {\n                address1: {\n                  description: 'First line of an Address.',\n                  type: 'string'\n                },\n                address2: {\n                  description: 'The second line of the Address. Optional.',\n                  type: 'string'\n                },\n                city: {\n                  description: 'The city for the address.',\n                  type: 'string'\n                },\n                country: {\n                  description: 'The country for the address.',\n                  type: 'string'\n                },\n                postalCode: {\n                  description: 'The postal code for the address.',\n                  type: 'string'\n                },\n                state: {\n                  description: 'The state or province for the address.',\n                  type: 'string'\n                }\n              }\n            },\n            email: { description: 'Email address.', type: 'string' },\n            fax: { description: 'Fax number.', type: 'string' },\n            jobTitle: { description: 'Job title.', type: 'string' },\n            nameFirst: { description: 'First name.', type: 'string' },\n            nameLast: { description: 'Last name.', type: 'string' },\n            nameMiddle: { description: 'Middle name.', type: 'string' },\n            organization: {\n              description: 'Organization contact belongs to.',\n              type: 'string'\n            },\n            phone: { description: 'Phone number.', type: 'string' }\n          }\n        },\n        contactTech: {\n          description: 'Technical contact.',\n          'x-ms-mutability': [ 'create' ],\n          required: [ 'email', 'nameFirst', 'nameLast', 'phone' ],\n          type: 'object',\n          properties: {\n            addressMailing: {\n              description: 'Mailing address.',\n              required: [ 'address1', 'city', 'country', 'postalCode', 'state' ],\n              type: 'object',\n              properties: {\n                address1: {\n                  description: 'First line of an Address.',\n                  type: 'string'\n                },\n                address2: {\n                  description: 'The second line of the Address. Optional.',\n                  type: 'string'\n                },\n                city: {\n                  description: 'The city for the address.',\n                  type: 'string'\n                },\n                country: {\n                  description: 'The country for the address.',\n                  type: 'string'\n                },\n                postalCode: {\n                  description: 'The postal code for the address.',\n                  type: 'string'\n                },\n                state: {\n                  description: 'The state or province for the address.',\n                  type: 'string'\n                }\n              }\n            },\n            email: { description: 'Email address.', type: 'string' },\n            fax: { description: 'Fax number.', type: 'string' },\n            jobTitle: { description: 'Job title.', type: 'string' },\n            nameFirst: { description: 'First name.', type: 'string' },\n            nameLast: { description: 'Last name.', type: 'string' },\n            nameMiddle: { description: 'Middle name.', type: 'string' },\n            organization: {\n              description: 'Organization contact belongs to.',\n              type: 'string'\n            },\n            phone: { description: 'Phone number.', type: 'string' }\n          }\n        },\n        registrationStatus: {\n          description: 'Domain registration status.',\n          enum: [\n            'Active',              'Awaiting',\n            'Cancelled',           'Confiscated',\n            'Disabled',            'Excluded',\n            'Expired',             'Failed',\n            'Held',                'Locked',\n            'Parked',              'Pending',\n            'Reserved',            'Reverted',\n            'Suspended',           'Transferred',\n            'Unknown',             'Unlocked',\n            'Unparked',            'Updated',\n            'JsonConverterFailed'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'DomainStatus', modelAsString: false }\n        },\n        provisioningState: {\n          description: 'Domain provisioning state.',\n          enum: [\n            'Succeeded',\n            'Failed',\n            'Canceled',\n            'InProgress',\n            'Deleting'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: false }\n        },\n        nameServers: {\n          description: 'Name servers.',\n          type: 'array',\n          items: { type: 'string' },\n          readOnly: true\n        },\n        privacy: {\n          description: '<code>true</code> if domain privacy is enabled for this domain; otherwise, <code>false</code>.',\n          type: 'boolean'\n        },\n        createdTime: {\n          format: 'date-time',\n          description: 'Domain creation timestamp.',\n          type: 'string',\n          readOnly: true\n        },\n        expirationTime: {\n          format: 'date-time',\n          description: 'Domain expiration timestamp.',\n          type: 'string',\n          readOnly: true\n        },\n        lastRenewedTime: {\n          format: 'date-time',\n          description: 'Timestamp when the domain was renewed last time.',\n          type: 'string',\n          readOnly: true\n        },\n        autoRenew: {\n          description: '<code>true</code> if the domain should be automatically renewed; otherwise, <code>false</code>.',\n          default: true,\n          type: 'boolean'\n        },\n        readyForDnsRecordManagement: {\n          description: '<code>true</code> if Azure can assign this domain to App Service apps; otherwise, <code>false</code>. This value will be <code>true</code> if domain registration status is active and \\n' +\n            ' it is hosted on name servers Azure has programmatic access to.',\n          type: 'boolean',\n          readOnly: true\n        },\n        managedHostNames: {\n          description: 'All hostnames derived from the domain and assigned to Azure resources.',\n          type: 'array',\n          items: {\n            description: 'Details of a hostname derived from a domain.',\n            type: 'object',\n            properties: {\n              name: { description: 'Name of the hostname.', type: 'string' },\n              siteNames: {\n                description: 'List of apps the hostname is assigned to. This list will have more than one app only if the hostname is pointing to a Traffic Manager.',\n                type: 'array',\n                items: { type: 'string' }\n              },\n              azureResourceName: {\n                description: 'Name of the Azure resource the hostname is assigned to. If it is assigned to a Traffic Manager then it will be the Traffic Manager name otherwise it will be the app name.',\n                type: 'string'\n              },\n              azureResourceType: {\n                description: 'Type of the Azure resource the hostname is assigned to.',\n                enum: [ 'Website', 'TrafficManager' ],\n                type: 'string',\n                'x-ms-enum': { name: 'AzureResourceType', modelAsString: false }\n              },\n              customHostNameDnsRecordType: {\n                description: 'Type of the DNS record.',\n                enum: [ 'CName', 'A' ],\n                type: 'string',\n                'x-ms-enum': {\n                  name: 'CustomHostNameDnsRecordType',\n                  modelAsString: false\n                }\n              },\n              hostNameType: {\n                description: 'Type of the hostname.',\n                enum: [ 'Verified', 'Managed' ],\n                type: 'string',\n                'x-ms-enum': { name: 'HostNameType', modelAsString: false }\n              }\n            }\n          },\n          readOnly: true,\n          'x-ms-identifiers': [ 'name' ]\n        },\n        consent: {\n          description: 'Legal agreement consent.',\n          'x-ms-mutability': [ 'create' ],\n          type: 'object',\n          properties: {\n            agreementKeys: {\n              description: 'List of applicable legal agreement keys. This list can be retrieved using ListLegalAgreements API under <code>TopLevelDomain</code> resource.',\n              type: 'array',\n              items: { type: 'string' }\n            },\n            agreedBy: { description: 'Client IP address.', type: 'string' },\n            agreedAt: {\n              format: 'date-time',\n              description: 'Timestamp when the agreements were accepted.',\n              type: 'string'\n            }\n          }\n        },\n        domainNotRenewableReasons: {\n          description: 'Reasons why domain is not renewable.',\n          type: 'array',\n          items: {\n            enum: [\n              'RegistrationStatusNotSupportedForRenewal',\n              'ExpirationNotInRenewalTimeRange',\n              'SubscriptionNotActive'\n            ],\n            type: 'string'\n          },\n          readOnly: true\n        },\n        dnsType: {\n          description: 'Current DNS type',\n          enum: [ 'AzureDns', 'DefaultDomainRegistrarDns' ],\n          type: 'string',\n          'x-ms-enum': { name: 'DnsType', modelAsString: false }\n        },\n        dnsZoneId: { description: 'Azure DNS Zone to use', type: 'string' },\n        targetDnsType: {\n          description: 'Target DNS type (would be used for migration)',\n          enum: [ 'AzureDns', 'DefaultDomainRegistrarDns' ],\n          type: 'string',\n          'x-ms-enum': { name: 'DnsType', modelAsString: false }\n        },\n        authCode: { type: 'string', 'x-ms-mutability': [ 'create', 'read' ] }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,s.kt)("h2",{id:"misc"},"Misc"),(0,s.kt)("p",null,"The resource version is ",(0,s.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,s.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.DomainRegistration/stable/2021-03-01/Domains.json"},"here"),"."))}l.isMDXComponent=!0}}]);