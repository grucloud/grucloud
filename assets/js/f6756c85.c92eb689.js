"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2954],{3905:function(e,r,n){n.d(r,{Zo:function(){return d},kt:function(){return m}});var t=n(67294);function i(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function s(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){i(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function c(e,r){if(null==e)return{};var n,t,i=function(e,r){if(null==e)return{};var n,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(i[n]=e[n]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var a=t.createContext({}),u=function(e){var r=t.useContext(a),n=r;return e&&(n="function"==typeof e?e(r):s(s({},r),e)),n},d=function(e){var r=u(e.components);return t.createElement(a.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},l=t.forwardRef((function(e,r){var n=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),l=u(n),m=i,g=l["".concat(a,".").concat(m)]||l[m]||p[m]||o;return n?t.createElement(g,s(s({ref:r},d),{},{components:n})):t.createElement(g,s({ref:r},d))}));function m(e,r){var n=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=n.length,s=new Array(o);s[0]=l;var c={};for(var a in r)hasOwnProperty.call(r,a)&&(c[a]=r[a]);c.originalType=e,c.mdxType="string"==typeof e?e:i,s[1]=c;for(var u=2;u<o;u++)s[u]=n[u];return t.createElement.apply(null,s)}return t.createElement.apply(null,n)}l.displayName="MDXCreateElement"},42513:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return c},contentTitle:function(){return a},metadata:function(){return u},toc:function(){return d},default:function(){return l}});var t=n(87462),i=n(63366),o=(n(67294),n(3905)),s=["components"],c={id:"TrustedAccessRoleBinding",title:"TrustedAccessRoleBinding"},a=void 0,u={unversionedId:"azure/resources/ContainerService/TrustedAccessRoleBinding",id:"azure/resources/ContainerService/TrustedAccessRoleBinding",isDocsHomePage:!1,title:"TrustedAccessRoleBinding",description:"Provides a TrustedAccessRoleBinding from the ContainerService group",source:"@site/docs/azure/resources/ContainerService/TrustedAccessRoleBinding.md",sourceDirName:"azure/resources/ContainerService",slug:"/azure/resources/ContainerService/TrustedAccessRoleBinding",permalink:"/docs/azure/resources/ContainerService/TrustedAccessRoleBinding",tags:[],version:"current",frontMatter:{id:"TrustedAccessRoleBinding",title:"TrustedAccessRoleBinding"},sidebar:"docs",previous:{title:"Snapshot",permalink:"/docs/azure/resources/ContainerService/Snapshot"},next:{title:"Configuration",permalink:"/docs/azure/resources/DBforPostgreSQL/Configuration"}},d=[{value:"Examples",id:"examples",children:[{value:"Create or update a trusted access role binding",id:"create-or-update-a-trusted-access-role-binding",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:d};function l(e){var r=e.components,n=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,t.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"TrustedAccessRoleBinding")," from the ",(0,o.kt)("strong",{parentName:"p"},"ContainerService")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-or-update-a-trusted-access-role-binding"},"Create or update a trusted access role binding"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "TrustedAccessRoleBinding",\n    group: "ContainerService",\n    name: "myTrustedAccessRoleBinding",\n    properties: () => ({\n      properties: {\n        sourceResourceId:\n          "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/b/providers/Microsoft.MachineLearningServices/workspaces/c",\n        roles: [\n          "Microsoft.MachineLearningServices/workspaces/reader",\n          "Microsoft.MachineLearningServices/workspaces/writer",\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      resource: "myManagedCluster",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerService/ManagedCluster"},"ManagedCluster"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  type: 'object',\n  description: 'Defines binding between a resource and role',\n  required: [ 'properties' ],\n  allOf: [\n    {\n      title: 'Resource',\n      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n      type: 'object',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the resource'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n        },\n        systemData: {\n          readOnly: true,\n          type: 'object',\n          description: 'Azure Resource Manager metadata containing createdBy and modifiedBy information.',\n          properties: {\n            createdBy: {\n              type: 'string',\n              description: 'The identity that created the resource.'\n            },\n            createdByType: {\n              type: 'string',\n              description: 'The type of identity that created the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              'x-ms-enum': { name: 'createdByType', modelAsString: true }\n            },\n            createdAt: {\n              type: 'string',\n              format: 'date-time',\n              description: 'The timestamp of resource creation (UTC).'\n            },\n            lastModifiedBy: {\n              type: 'string',\n              description: 'The identity that last modified the resource.'\n            },\n            lastModifiedByType: {\n              type: 'string',\n              description: 'The type of identity that last modified the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              'x-ms-enum': { name: 'createdByType', modelAsString: true }\n            },\n            lastModifiedAt: {\n              type: 'string',\n              format: 'date-time',\n              description: 'The timestamp of resource last modification (UTC)'\n            }\n          }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      type: 'object',\n      description: 'Properties for trusted access role binding',\n      required: [ 'sourceResourceId', 'roles' ],\n      properties: {\n        provisioningState: {\n          type: 'string',\n          readOnly: true,\n          description: 'The current provisioning state of trusted access role binding.',\n          enum: [ 'Succeeded', 'Failed', 'Updating', 'Deleting' ],\n          'x-ms-enum': {\n            name: 'TrustedAccessRoleBindingProvisioningState',\n            modelAsString: true\n          }\n        },\n        sourceResourceId: {\n          type: 'string',\n          description: 'The ARM resource ID of source resource that trusted access is configured for.'\n        },\n        roles: {\n          type: 'array',\n          items: { type: 'string' },\n          description: \"A list of roles to bind, each item is a resource type qualified role name. For example: 'Microsoft.MachineLearningServices/workspaces/reader'.\"\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-04-02-preview"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/preview/2022-04-02-preview/managedClusters.json"},"here"),"."))}l.isMDXComponent=!0}}]);