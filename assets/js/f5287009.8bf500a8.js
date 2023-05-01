"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[22775],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>m});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var d=n.createContext({}),c=function(e){var t=n.useContext(d),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(d.Provider,{value:t},e.children)},p="mdxType",l={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},y=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,d=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),p=c(r),y=a,m=p["".concat(d,".").concat(y)]||p[y]||l[y]||i;return r?n.createElement(m,s(s({ref:t},u),{},{components:r})):n.createElement(m,s({ref:t},u))}));function m(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,s=new Array(i);s[0]=y;var o={};for(var d in t)hasOwnProperty.call(t,d)&&(o[d]=t[d]);o.originalType=e,o[p]="string"==typeof e?e:a,s[1]=o;for(var c=2;c<i;c++)s[c]=r[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}y.displayName="MDXCreateElement"},2440:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>d,contentTitle:()=>s,default:()=>l,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var n=r(87462),a=(r(67294),r(3905));const i={id:"FederatedIdentityCredential",title:"FederatedIdentityCredential"},s=void 0,o={unversionedId:"azure/resources/ManagedIdentity/FederatedIdentityCredential",id:"azure/resources/ManagedIdentity/FederatedIdentityCredential",title:"FederatedIdentityCredential",description:"Provides a FederatedIdentityCredential from the ManagedIdentity group",source:"@site/docs/azure/resources/ManagedIdentity/FederatedIdentityCredential.md",sourceDirName:"azure/resources/ManagedIdentity",slug:"/azure/resources/ManagedIdentity/FederatedIdentityCredential",permalink:"/docs/azure/resources/ManagedIdentity/FederatedIdentityCredential",draft:!1,tags:[],version:"current",frontMatter:{id:"FederatedIdentityCredential",title:"FederatedIdentityCredential"},sidebar:"docs",previous:{title:"Vault",permalink:"/docs/azure/resources/KeyVault/Vault"},next:{title:"UserAssignedIdentity",permalink:"/docs/azure/resources/ManagedIdentity/UserAssignedIdentity"}},d={},c=[{value:"Examples",id:"examples",level:2},{value:"FederatedIdentityCredentialCreate",id:"federatedidentitycredentialcreate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c},p="wrapper";function l(e){let{components:t,...r}=e;return(0,a.kt)(p,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"FederatedIdentityCredential")," from the ",(0,a.kt)("strong",{parentName:"p"},"ManagedIdentity")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"federatedidentitycredentialcreate"},"FederatedIdentityCredentialCreate"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FederatedIdentityCredential",\n    group: "ManagedIdentity",\n    name: "myFederatedIdentityCredential",\n    properties: () => ({\n      properties: {\n        issuer: "https://oidc.prod-aks.azure.com/IssuerGUID",\n        subject: "system:serviceaccount:ns:svcaccount",\n        audiences: ["api://AzureADTokenExchange"],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      resource: "myUserAssignedIdentity",\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/ManagedIdentity/UserAssignedIdentity"},"UserAssignedIdentity"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"{\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'The properties associated with the federated identity credential.',\n      type: 'object',\n      title: 'Federated identity credential properties.',\n      required: [ 'issuer', 'subject', 'audiences' ],\n      properties: {\n        issuer: {\n          type: 'string',\n          format: 'uri',\n          description: 'The URL of the issuer to be trusted.'\n        },\n        subject: {\n          type: 'string',\n          description: 'The identifier of the external identity.'\n        },\n        audiences: {\n          type: 'array',\n          items: { type: 'string' },\n          description: 'The list of audiences that can appear in the issued token.'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      title: 'Proxy Resource',\n      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',\n      type: 'object',\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  description: 'Describes a federated identity credential.'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2022-01-31-preview"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/msi/resource-manager/Microsoft.ManagedIdentity/preview/2022-01-31-preview/ManagedIdentity.json"},"here"),"."))}l.isMDXComponent=!0}}]);