"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[55073],{3905:function(e,r,n){n.d(r,{Zo:function(){return p},kt:function(){return m}});var t=n(67294);function i(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function s(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){i(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function a(e,r){if(null==e)return{};var n,t,i=function(e,r){if(null==e)return{};var n,t,i={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(i[n]=e[n]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=t.createContext({}),u=function(e){var r=t.useContext(c),n=r;return e&&(n="function"==typeof e?e(r):s(s({},r),e)),n},p=function(e){var r=u(e.components);return t.createElement(c.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),d=u(n),m=i,h=d["".concat(c,".").concat(m)]||d[m]||l[m]||o;return n?t.createElement(h,s(s({ref:r},p),{},{components:n})):t.createElement(h,s({ref:r},p))}));function m(e,r){var n=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=n.length,s=new Array(o);s[0]=d;var a={};for(var c in r)hasOwnProperty.call(r,c)&&(a[c]=r[c]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var u=2;u<o;u++)s[u]=n[u];return t.createElement.apply(null,s)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},80823:function(e,r,n){n.r(r),n.d(r,{frontMatter:function(){return a},contentTitle:function(){return c},metadata:function(){return u},toc:function(){return p},default:function(){return d}});var t=n(87462),i=n(63366),o=(n(67294),n(3905)),s=["components"],a={id:"LinkedService",title:"LinkedService"},c=void 0,u={unversionedId:"azure/resources/OperationalInsights/LinkedService",id:"azure/resources/OperationalInsights/LinkedService",isDocsHomePage:!1,title:"LinkedService",description:"Provides a LinkedService from the OperationalInsights group",source:"@site/docs/azure/resources/OperationalInsights/LinkedService.md",sourceDirName:"azure/resources/OperationalInsights",slug:"/azure/resources/OperationalInsights/LinkedService",permalink:"/docs/azure/resources/OperationalInsights/LinkedService",tags:[],version:"current",frontMatter:{id:"LinkedService",title:"LinkedService"},sidebar:"docs",previous:{title:"DataExport",permalink:"/docs/azure/resources/OperationalInsights/DataExport"},next:{title:"Query",permalink:"/docs/azure/resources/OperationalInsights/Query"}},p=[{value:"Examples",id:"examples",children:[{value:"LinkedServicesCreate",id:"linkedservicescreate",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:p};function d(e){var r=e.components,n=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,t.Z)({},l,n,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"LinkedService")," from the ",(0,o.kt)("strong",{parentName:"p"},"OperationalInsights")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"linkedservicescreate"},"LinkedServicesCreate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "LinkedService",\n    group: "OperationalInsights",\n    name: "myLinkedService",\n    properties: () => ({\n      properties: {\n        writeAccessResourceId:\n          "/subscriptions/00000000-0000-0000-0000-00000000000/resourceGroups/mms-eus/providers/Microsoft.OperationalInsights/clusters/testcluster",\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      workspace: "myWorkspace",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/OperationalInsights/Workspace"},"Workspace"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'The properties of the linked service.',\n      properties: {\n        resourceId: {\n          type: 'string',\n          description: 'The resource id of the resource that will be linked to the workspace. This should be used for linking resources which require read access'\n        },\n        writeAccessResourceId: {\n          type: 'string',\n          description: 'The resource id of the resource that will be linked to the workspace. This should be used for linking resources which require write access'\n        },\n        provisioningState: {\n          type: 'string',\n          description: 'The provisioning state of the linked service.',\n          enum: [\n            'Succeeded',\n            'Deleting',\n            'ProvisioningAccount',\n            'Updating'\n          ],\n          'x-ms-enum': { name: 'LinkedServiceEntityStatus', modelAsString: true }\n        }\n      }\n    },\n    tags: {\n      type: 'object',\n      additionalProperties: { type: 'string' },\n      'x-ms-mutability': [ 'read', 'create', 'update' ],\n      description: 'Resource tags.'\n    }\n  },\n  required: [ 'properties' ],\n  allOf: [\n    {\n      title: 'Proxy Resource',\n      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',\n      type: 'object',\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  description: 'The top level Linked service resource container.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2020-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2020-08-01/LinkedServices.json"},"here"),"."))}d.isMDXComponent=!0}}]);