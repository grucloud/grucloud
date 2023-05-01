"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[135],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},d="mdxType",l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,a=e.originalType,c=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=p(n),m=i,f=d["".concat(c,".").concat(m)]||d[m]||l[m]||a;return n?r.createElement(f,o(o({ref:t},u),{},{components:n})):r.createElement(f,o({ref:t},u))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var a=n.length,o=new Array(a);o[0]=m;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[d]="string"==typeof e?e:i,o[1]=s;for(var p=2;p<a;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},7017:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>l,frontMatter:()=>a,metadata:()=>s,toc:()=>p});var r=n(87462),i=(n(67294),n(3905));const a={id:"Certificate",title:"Certificate"},o=void 0,s={unversionedId:"azure/resources/App/Certificate",id:"azure/resources/App/Certificate",title:"Certificate",description:"Provides a Certificate from the App group",source:"@site/docs/azure/resources/App/Certificate.md",sourceDirName:"azure/resources/App",slug:"/azure/resources/App/Certificate",permalink:"/docs/azure/resources/App/Certificate",draft:!1,tags:[],version:"current",frontMatter:{id:"Certificate",title:"Certificate"},sidebar:"docs",previous:{title:"Resources List",permalink:"/docs/azure/ResourcesList"},next:{title:"ContainerApp",permalink:"/docs/azure/resources/App/ContainerApp"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"Create or Update Certificate",id:"create-or-update-certificate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:p},d="wrapper";function l(e){let{components:t,...n}=e;return(0,i.kt)(d,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"Certificate")," from the ",(0,i.kt)("strong",{parentName:"p"},"App")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-or-update-certificate"},"Create or Update Certificate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Certificate",\n    group: "App",\n    name: "myCertificate",\n    properties: () => ({\n      location: "East US",\n      properties: {\n        password: "private key password",\n        value: "PFX-or-PEM-blob",\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      environment: "myManagedEnvironment",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/App/ManagedEnvironment"},"ManagedEnvironment"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  description: 'Certificate used for Custom Domain bindings of Container Apps in a Managed Environment',\n  type: 'object',\n  allOf: [\n    {\n      title: 'Tracked Resource',\n      description: \"The resource model definition for an Azure Resource Manager tracked top level resource which has 'tags' and a 'location'\",\n      type: 'object',\n      properties: {\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          'x-ms-mutability': [ 'read', 'create', 'update' ],\n          description: 'Resource tags.'\n        },\n        location: {\n          type: 'string',\n          'x-ms-mutability': [ 'read', 'create' ],\n          description: 'The geo-location where the resource lives'\n        }\n      },\n      required: [ 'location' ],\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            },\n            systemData: {\n              readOnly: true,\n              type: 'object',\n              description: 'Azure Resource Manager metadata containing createdBy and modifiedBy information.',\n              properties: {\n                createdBy: {\n                  type: 'string',\n                  description: 'The identity that created the resource.'\n                },\n                createdByType: {\n                  type: 'string',\n                  description: 'The type of identity that created the resource.',\n                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n                  'x-ms-enum': { name: 'createdByType', modelAsString: true }\n                },\n                createdAt: {\n                  type: 'string',\n                  format: 'date-time',\n                  description: 'The timestamp of resource creation (UTC).'\n                },\n                lastModifiedBy: {\n                  type: 'string',\n                  description: 'The identity that last modified the resource.'\n                },\n                lastModifiedByType: {\n                  type: 'string',\n                  description: 'The type of identity that last modified the resource.',\n                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n                  'x-ms-enum': { name: 'createdByType', modelAsString: true }\n                },\n                lastModifiedAt: {\n                  type: 'string',\n                  format: 'date-time',\n                  description: 'The timestamp of resource last modification (UTC)'\n                }\n              }\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Certificate resource specific properties',\n      type: 'object',\n      properties: {\n        provisioningState: {\n          description: 'Provisioning state of the certificate.',\n          enum: [\n            'Succeeded',\n            'Failed',\n            'Canceled',\n            'DeleteFailed',\n            'Pending'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'CertificateProvisioningState', modelAsString: true }\n        },\n        password: {\n          description: 'Certificate password.',\n          type: 'string',\n          'x-ms-mutability': [ 'create' ],\n          'x-ms-secret': true\n        },\n        subjectName: {\n          description: 'Subject name of the certificate.',\n          type: 'string',\n          readOnly: true\n        },\n        value: {\n          format: 'byte',\n          description: 'PFX or PEM blob',\n          type: 'string',\n          'x-ms-mutability': [ 'create' ],\n          'x-ms-secret': true\n        },\n        issuer: {\n          description: 'Certificate issuer.',\n          type: 'string',\n          readOnly: true\n        },\n        issueDate: {\n          format: 'date-time',\n          description: 'Certificate issue Date.',\n          type: 'string',\n          readOnly: true\n        },\n        expirationDate: {\n          format: 'date-time',\n          description: 'Certificate expiration date.',\n          type: 'string',\n          readOnly: true\n        },\n        thumbprint: {\n          description: 'Certificate thumbprint.',\n          type: 'string',\n          readOnly: true\n        },\n        valid: {\n          description: 'Is the certificate valid?.',\n          type: 'boolean',\n          readOnly: true\n        },\n        publicKeyHash: {\n          description: 'Public key hash.',\n          type: 'string',\n          readOnly: true\n        }\n      }\n    }\n  },\n  'x-ms-client-flatten': true\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-03-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/app/resource-manager/Microsoft.App/stable/2022-03-01/ManagedEnvironments.json"},"here"),"."))}l.isMDXComponent=!0}}]);