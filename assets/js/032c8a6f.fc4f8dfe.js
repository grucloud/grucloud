"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2550],{3905:(e,n,r)=>{r.d(n,{Zo:()=>p,kt:()=>g});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var u=t.createContext({}),c=function(e){var n=t.useContext(u),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},p=function(e){var n=c(e.components);return t.createElement(u.Provider,{value:n},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},f=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,i=e.originalType,u=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),l=c(r),f=o,g=l["".concat(u,".").concat(f)]||l[f]||d[f]||i;return r?t.createElement(g,a(a({ref:n},p),{},{components:r})):t.createElement(g,a({ref:n},p))}));function g(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=f;var s={};for(var u in n)hasOwnProperty.call(n,u)&&(s[u]=n[u]);s.originalType=e,s[l]="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=r[c];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}f.displayName="MDXCreateElement"},73816:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>u,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var t=r(87462),o=(r(67294),r(3905));const i={id:"Configuration",title:"Configuration"},a=void 0,s={unversionedId:"azure/resources/DBforPostgreSQL/Configuration",id:"azure/resources/DBforPostgreSQL/Configuration",title:"Configuration",description:"Provides a Configuration from the DBforPostgreSQL group",source:"@site/docs/azure/resources/DBforPostgreSQL/Configuration.md",sourceDirName:"azure/resources/DBforPostgreSQL",slug:"/azure/resources/DBforPostgreSQL/Configuration",permalink:"/docs/azure/resources/DBforPostgreSQL/Configuration",draft:!1,tags:[],version:"current",frontMatter:{id:"Configuration",title:"Configuration"},sidebar:"docs",previous:{title:"TrustedAccessRoleBinding",permalink:"/docs/azure/resources/ContainerService/TrustedAccessRoleBinding"},next:{title:"Database",permalink:"/docs/azure/resources/DBforPostgreSQL/Database"}},u={},c=[{value:"Examples",id:"examples",level:2},{value:"Update a user configuration",id:"update-a-user-configuration",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:c},l="wrapper";function d(e){let{components:n,...r}=e;return(0,o.kt)(l,(0,t.Z)({},p,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"Configuration")," from the ",(0,o.kt)("strong",{parentName:"p"},"DBforPostgreSQL")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"update-a-user-configuration"},"Update a user configuration"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Configuration",\n    group: "DBforPostgreSQL",\n    name: "myConfiguration",\n    properties: () => ({\n      properties: { value: "on", source: "user-override" },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      server: "myFlexibleServer",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/DBforPostgreSQL/FlexibleServer"},"FlexibleServer"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'The properties of a configuration.',\n      properties: {\n        value: { type: 'string', description: 'Value of the configuration.' },\n        description: {\n          type: 'string',\n          readOnly: true,\n          description: 'Description of the configuration.'\n        },\n        defaultValue: {\n          type: 'string',\n          readOnly: true,\n          description: 'Default value of the configuration.'\n        },\n        dataType: {\n          type: 'string',\n          readOnly: true,\n          description: 'Data type of the configuration.',\n          enum: [ 'Boolean', 'Numeric', 'Integer', 'Enumeration' ],\n          'x-ms-enum': { name: 'ConfigurationDataType', modelAsString: true }\n        },\n        allowedValues: {\n          type: 'string',\n          readOnly: true,\n          description: 'Allowed values of the configuration.'\n        },\n        source: { type: 'string', description: 'Source of the configuration.' },\n        isDynamicConfig: {\n          type: 'boolean',\n          readOnly: true,\n          description: 'Configuration dynamic or static.'\n        },\n        isReadOnly: {\n          type: 'boolean',\n          readOnly: true,\n          description: 'Configuration read-only or not.'\n        },\n        isConfigPendingRestart: {\n          type: 'boolean',\n          readOnly: true,\n          description: 'Configuration is pending restart or not.'\n        },\n        unit: {\n          type: 'string',\n          readOnly: true,\n          description: 'Configuration unit.'\n        },\n        documentationLink: {\n          type: 'string',\n          readOnly: true,\n          description: 'Configuration documentation link.'\n        }\n      }\n    },\n    systemData: {\n      readOnly: true,\n      description: 'The system metadata relating to this resource.',\n      type: 'object',\n      properties: {\n        createdBy: {\n          type: 'string',\n          description: 'The identity that created the resource.'\n        },\n        createdByType: {\n          type: 'string',\n          description: 'The type of identity that created the resource.',\n          enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n          'x-ms-enum': { name: 'createdByType', modelAsString: true }\n        },\n        createdAt: {\n          type: 'string',\n          format: 'date-time',\n          description: 'The timestamp of resource creation (UTC).'\n        },\n        lastModifiedBy: {\n          type: 'string',\n          description: 'The identity that last modified the resource.'\n        },\n        lastModifiedByType: {\n          type: 'string',\n          description: 'The type of identity that last modified the resource.',\n          enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n          'x-ms-enum': { name: 'createdByType', modelAsString: true }\n        },\n        lastModifiedAt: {\n          type: 'string',\n          format: 'date-time',\n          description: 'The timestamp of resource last modification (UTC)'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      title: 'Proxy Resource',\n      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',\n      type: 'object',\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  description: 'Represents a Configuration.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-06-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2021-06-01/postgresql.json"},"here"),"."))}d.isMDXComponent=!0}}]);