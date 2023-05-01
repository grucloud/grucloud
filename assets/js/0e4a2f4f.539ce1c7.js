"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[41328],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>m});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},s=Object.keys(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)t=s[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),u=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},p=function(e){var r=u(e.components);return n.createElement(c.Provider,{value:r},e.children)},l="mdxType",y={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,s=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),l=u(t),d=o,m=l["".concat(c,".").concat(d)]||l[d]||y[d]||s;return t?n.createElement(m,a(a({ref:r},p),{},{components:t})):n.createElement(m,a({ref:r},p))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var s=t.length,a=new Array(s);a[0]=d;var i={};for(var c in r)hasOwnProperty.call(r,c)&&(i[c]=r[c]);i.originalType=e,i[l]="string"==typeof e?e:o,a[1]=i;for(var u=2;u<s;u++)a[u]=t[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},6757:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>a,default:()=>y,frontMatter:()=>s,metadata:()=>i,toc:()=>u});var n=t(87462),o=(t(67294),t(3905));const s={id:"ServerKey",title:"ServerKey"},a=void 0,i={unversionedId:"azure/resources/DBforPostgreSQL/ServerKey",id:"azure/resources/DBforPostgreSQL/ServerKey",title:"ServerKey",description:"Provides a ServerKey from the DBforPostgreSQL group",source:"@site/docs/azure/resources/DBforPostgreSQL/ServerKey.md",sourceDirName:"azure/resources/DBforPostgreSQL",slug:"/azure/resources/DBforPostgreSQL/ServerKey",permalink:"/docs/azure/resources/DBforPostgreSQL/ServerKey",draft:!1,tags:[],version:"current",frontMatter:{id:"ServerKey",title:"ServerKey"},sidebar:"docs",previous:{title:"ServerAdministrator",permalink:"/docs/azure/resources/DBforPostgreSQL/ServerAdministrator"},next:{title:"ServerSecurityAlertPolicy",permalink:"/docs/azure/resources/DBforPostgreSQL/ServerSecurityAlertPolicy"}},c={},u=[{value:"Examples",id:"examples",level:2},{value:"Creates or updates a PostgreSQL Server key",id:"creates-or-updates-a-postgresql-server-key",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:u},l="wrapper";function y(e){let{components:r,...t}=e;return(0,o.kt)(l,(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"ServerKey")," from the ",(0,o.kt)("strong",{parentName:"p"},"DBforPostgreSQL")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"creates-or-updates-a-postgresql-server-key"},"Creates or updates a PostgreSQL Server key"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'provider.DBforPostgreSQL.makeServerKey({\n  name: "myServerKey",\n  properties: () => ({\n    properties: {\n      serverKeyType: "AzureKeyVault",\n      uri: "https://someVault.vault.azure.net/keys/someKey/01234567890123456789012345678901",\n    },\n  }),\n  dependencies: ({ resources }) => ({\n    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],\n    server: resources.DBforPostgreSQL.Server["myServer"],\n  }),\n});\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DBforPostgreSQL/Server"},"Server"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'A PostgreSQL Server key.',\n  type: 'object',\n  allOf: [\n    {\n      title: 'Proxy Resource',\n      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',\n      type: 'object',\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  properties: {\n    kind: {\n      description: 'Kind of encryption protector used to protect the key.',\n      type: 'string',\n      readOnly: true\n    },\n    properties: {\n      description: 'Properties of the ServerKey Resource.',\n      'x-ms-client-flatten': true,\n      required: [ 'serverKeyType' ],\n      type: 'object',\n      properties: {\n        serverKeyType: {\n          description: \"The key type like 'AzureKeyVault'.\",\n          enum: [ 'AzureKeyVault' ],\n          type: 'string',\n          'x-ms-enum': { name: 'ServerKeyType', modelAsString: true }\n        },\n        uri: { description: 'The URI of the key.', type: 'string' },\n        creationDate: {\n          format: 'date-time',\n          description: 'The key creation date.',\n          type: 'string',\n          readOnly: true\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2020-01-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2020-01-01/DataEncryptionKeys.json"},"here"),"."))}y.isMDXComponent=!0}}]);