"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5524],{3905:function(e,r,t){t.d(r,{Zo:function(){return p},kt:function(){return m}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),u=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},p=function(e){var r=u(e.components);return n.createElement(c.Provider,{value:r},e.children)},d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},l=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),l=u(t),m=o,f=l["".concat(c,".").concat(m)]||l[m]||d[m]||i;return t?n.createElement(f,s(s({ref:r},p),{},{components:t})):n.createElement(f,s({ref:r},p))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=t.length,s=new Array(i);s[0]=l;var a={};for(var c in r)hasOwnProperty.call(r,c)&&(a[c]=r[c]);a.originalType=e,a.mdxType="string"==typeof e?e:o,s[1]=a;for(var u=2;u<i;u++)s[u]=t[u];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}l.displayName="MDXCreateElement"},11979:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return a},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return p},default:function(){return l}});var n=t(87462),o=t(63366),i=(t(67294),t(3905)),s=["components"],a={id:"ServerAdministrator",title:"ServerAdministrator"},c=void 0,u={unversionedId:"azure/resources/DBforPostgreSQL/ServerAdministrator",id:"azure/resources/DBforPostgreSQL/ServerAdministrator",isDocsHomePage:!1,title:"ServerAdministrator",description:"Provides a ServerAdministrator from the DBforPostgreSQL group",source:"@site/docs/azure/resources/DBforPostgreSQL/ServerAdministrator.md",sourceDirName:"azure/resources/DBforPostgreSQL",slug:"/azure/resources/DBforPostgreSQL/ServerAdministrator",permalink:"/docs/azure/resources/DBforPostgreSQL/ServerAdministrator",tags:[],version:"current",frontMatter:{id:"ServerAdministrator",title:"ServerAdministrator"},sidebar:"docs",previous:{title:"Server",permalink:"/docs/azure/resources/DBforPostgreSQL/Server"},next:{title:"ServerKey",permalink:"/docs/azure/resources/DBforPostgreSQL/ServerKey"}},p=[{value:"Examples",id:"examples",children:[{value:"ServerAdministratorCreate",id:"serveradministratorcreate",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],d={toc:p};function l(e){var r=e.components,t=(0,o.Z)(e,s);return(0,i.kt)("wrapper",(0,n.Z)({},d,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"ServerAdministrator")," from the ",(0,i.kt)("strong",{parentName:"p"},"DBforPostgreSQL")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"serveradministratorcreate"},"ServerAdministratorCreate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'provider.DBforPostgreSQL.makeServerAdministrator({\n  name: "myServerAdministrator",\n  properties: () => ({\n    properties: {\n      administratorType: "ActiveDirectory",\n      login: "bob@contoso.com",\n      sid: "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c",\n      tenantId: "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c",\n    },\n  }),\n  dependencies: ({ resources }) => ({\n    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],\n    server: resources.DBforPostgreSQL.Server["myServer"],\n  }),\n});\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/DBforPostgreSQL/Server"},"Server"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the server AAD administrator.',\n      properties: {\n        administratorType: {\n          type: 'string',\n          description: 'The type of administrator.',\n          enum: [ 'ActiveDirectory' ],\n          'x-ms-enum': { name: 'AdministratorType' }\n        },\n        login: {\n          type: 'string',\n          description: 'The server administrator login account name.'\n        },\n        sid: {\n          type: 'string',\n          description: 'The server administrator Sid (Secure ID).',\n          format: 'uuid'\n        },\n        tenantId: {\n          type: 'string',\n          description: 'The server Active Directory Administrator tenant id.',\n          format: 'uuid'\n        }\n      },\n      required: [ 'tenantId', 'administratorType', 'login', 'sid' ]\n    }\n  },\n  description: 'Represents a and external administrator to be created.',\n  allOf: [\n    {\n      title: 'Proxy Resource',\n      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',\n      type: 'object',\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ]\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2017-12-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/postgresql.json"},"here"),"."))}l.isMDXComponent=!0}}]);