"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[46433],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>y});var n=r(67294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function s(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),u=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):s(s({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(c.Provider,{value:t},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,p=o(e,["components","mdxType","originalType","parentName"]),l=u(r),m=a,y=l["".concat(c,".").concat(m)]||l[m]||d[m]||i;return r?n.createElement(y,s(s({ref:t},p),{},{components:r})):n.createElement(y,s({ref:t},p))}));function y(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,s=new Array(i);s[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o[l]="string"==typeof e?e:a,s[1]=o;for(var u=2;u<i;u++)s[u]=r[u];return n.createElement.apply(null,s)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},6750:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>i,metadata:()=>o,toc:()=>u});var n=r(87462),a=(r(67294),r(3905));const i={id:"Secret",title:"Secret"},s=void 0,o={unversionedId:"azure/resources/KeyVault/Secret",id:"azure/resources/KeyVault/Secret",title:"Secret",description:"Provides a Secret from the KeyVault group",source:"@site/docs/azure/resources/KeyVault/Secret.md",sourceDirName:"azure/resources/KeyVault",slug:"/azure/resources/KeyVault/Secret",permalink:"/docs/azure/resources/KeyVault/Secret",draft:!1,tags:[],version:"current",frontMatter:{id:"Secret",title:"Secret"},sidebar:"docs",previous:{title:"PrivateEndpointConnection",permalink:"/docs/azure/resources/KeyVault/PrivateEndpointConnection"},next:{title:"Vault",permalink:"/docs/azure/resources/KeyVault/Vault"}},c={},u=[{value:"Examples",id:"examples",level:2},{value:"Create a secret",id:"create-a-secret",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:u},l="wrapper";function d(e){let{components:t,...r}=e;return(0,a.kt)(l,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"Secret")," from the ",(0,a.kt)("strong",{parentName:"p"},"KeyVault")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"create-a-secret"},"Create a secret"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Secret",\n    group: "KeyVault",\n    name: "mySecret",\n    properties: () => ({ properties: { value: "secret-value" } }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      vault: "myVault",\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/KeyVault/Vault"},"Vault"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    tags: {\n      type: 'object',\n      additionalProperties: { type: 'string' },\n      description: 'The tags that will be assigned to the secret. '\n    },\n    properties: {\n      description: 'Properties of the secret',\n      properties: {\n        value: {\n          type: 'string',\n          description: \"The value of the secret. NOTE: 'value' will never be returned from the service, as APIs using this model are is intended for internal use in ARM deployments. Users should use the data-plane REST service for interaction with vault secrets.\"\n        },\n        contentType: {\n          type: 'string',\n          description: 'The content type of the secret.'\n        },\n        attributes: {\n          description: 'The attributes of the secret.',\n          allOf: [\n            {\n              properties: {\n                enabled: {\n                  type: 'boolean',\n                  description: 'Determines whether the object is enabled.'\n                },\n                nbf: {\n                  'x-ms-client-name': 'NotBefore',\n                  type: 'integer',\n                  format: 'unixtime',\n                  description: 'Not before date in seconds since 1970-01-01T00:00:00Z.'\n                },\n                exp: {\n                  'x-ms-client-name': 'Expires',\n                  type: 'integer',\n                  format: 'unixtime',\n                  description: 'Expiry date in seconds since 1970-01-01T00:00:00Z.'\n                },\n                created: {\n                  type: 'integer',\n                  format: 'unixtime',\n                  readOnly: true,\n                  description: 'Creation time in seconds since 1970-01-01T00:00:00Z.'\n                },\n                updated: {\n                  type: 'integer',\n                  format: 'unixtime',\n                  readOnly: true,\n                  description: 'Last updated time in seconds since 1970-01-01T00:00:00Z.'\n                }\n              },\n              description: 'The object attributes managed by the KeyVault service.',\n              type: 'object'\n            }\n          ],\n          type: 'object'\n        },\n        secretUri: {\n          type: 'string',\n          description: 'The URI to retrieve the current version of the secret.',\n          readOnly: true\n        },\n        secretUriWithVersion: {\n          type: 'string',\n          description: 'The URI to retrieve the specific version of the secret.',\n          readOnly: true\n        }\n      },\n      type: 'object'\n    }\n  },\n  description: 'Parameters for creating or updating a secret',\n  required: [ 'properties' ],\n  'x-ms-azure-resource': true,\n  type: 'object'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2022-07-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/keyvault/resource-manager/Microsoft.KeyVault/stable/2022-07-01/secrets.json"},"here"),"."))}d.isMDXComponent=!0}}]);