"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[50678],{3905:function(e,n,t){t.d(n,{Zo:function(){return l},kt:function(){return y}});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function c(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?c(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},c=Object.keys(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)t=c[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=r.createContext({}),u=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},l=function(e){var n=u(e.components);return r.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,c=e.originalType,s=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),d=u(t),y=o,m=d["".concat(s,".").concat(y)]||d[y]||p[y]||c;return t?r.createElement(m,i(i({ref:n},l),{},{components:t})):r.createElement(m,i({ref:n},l))}));function y(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var c=t.length,i=new Array(c);i[0]=d;var a={};for(var s in n)hasOwnProperty.call(n,s)&&(a[s]=n[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var u=2;u<c;u++)i[u]=t[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},4212:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return s},metadata:function(){return u},toc:function(){return l},default:function(){return d}});var r=t(87462),o=t(63366),c=(t(67294),t(3905)),i=["components"],a={id:"ObjectReplicationPolicy",title:"ObjectReplicationPolicy"},s=void 0,u={unversionedId:"azure/resources/Storage/ObjectReplicationPolicy",id:"azure/resources/Storage/ObjectReplicationPolicy",isDocsHomePage:!1,title:"ObjectReplicationPolicy",description:"Provides a ObjectReplicationPolicy from the Storage group",source:"@site/docs/azure/resources/Storage/ObjectReplicationPolicy.md",sourceDirName:"azure/resources/Storage",slug:"/azure/resources/Storage/ObjectReplicationPolicy",permalink:"/docs/azure/resources/Storage/ObjectReplicationPolicy",tags:[],version:"current",frontMatter:{id:"ObjectReplicationPolicy",title:"ObjectReplicationPolicy"},sidebar:"docs",previous:{title:"LocalUser",permalink:"/docs/azure/resources/Storage/LocalUser"},next:{title:"PrivateEndpointConnection",permalink:"/docs/azure/resources/Storage/PrivateEndpointConnection"}},l=[{value:"Examples",id:"examples",children:[{value:"StorageAccountCreateObjectReplicationPolicyOnDestination",id:"storageaccountcreateobjectreplicationpolicyondestination",children:[],level:3},{value:"StorageAccountCreateObjectReplicationPolicyOnSource",id:"storageaccountcreateobjectreplicationpolicyonsource",children:[],level:3},{value:"StorageAccountUpdateObjectReplicationPolicyOnDestination",id:"storageaccountupdateobjectreplicationpolicyondestination",children:[],level:3},{value:"StorageAccountUpdateObjectReplicationPolicyOnSource",id:"storageaccountupdateobjectreplicationpolicyonsource",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:l};function d(e){var n=e.components,t=(0,o.Z)(e,i);return(0,c.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"Provides a ",(0,c.kt)("strong",{parentName:"p"},"ObjectReplicationPolicy")," from the ",(0,c.kt)("strong",{parentName:"p"},"Storage")," group"),(0,c.kt)("h2",{id:"examples"},"Examples"),(0,c.kt)("h3",{id:"storageaccountcreateobjectreplicationpolicyondestination"},"StorageAccountCreateObjectReplicationPolicyOnDestination"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ObjectReplicationPolicy",\n    group: "Storage",\n    name: "myObjectReplicationPolicy",\n    properties: () => ({\n      properties: {\n        sourceAccount: "src1122",\n        destinationAccount: "dst112",\n        rules: [\n          {\n            sourceContainer: "scont139",\n            destinationContainer: "dcont139",\n            filters: { prefixMatch: ["blobA", "blobB"] },\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,c.kt)("h3",{id:"storageaccountcreateobjectreplicationpolicyonsource"},"StorageAccountCreateObjectReplicationPolicyOnSource"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ObjectReplicationPolicy",\n    group: "Storage",\n    name: "myObjectReplicationPolicy",\n    properties: () => ({\n      properties: {\n        sourceAccount: "src1122",\n        destinationAccount: "dst112",\n        rules: [\n          {\n            ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",\n            sourceContainer: "scont139",\n            destinationContainer: "dcont139",\n            filters: {\n              prefixMatch: ["blobA", "blobB"],\n              minCreationTime: "2020-02-19T16:05:00Z",\n            },\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,c.kt)("h3",{id:"storageaccountupdateobjectreplicationpolicyondestination"},"StorageAccountUpdateObjectReplicationPolicyOnDestination"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ObjectReplicationPolicy",\n    group: "Storage",\n    name: "myObjectReplicationPolicy",\n    properties: () => ({\n      properties: {\n        sourceAccount: "src1122",\n        destinationAccount: "dst112",\n        rules: [\n          {\n            ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",\n            sourceContainer: "scont139",\n            destinationContainer: "dcont139",\n            filters: { prefixMatch: ["blobA", "blobB"] },\n          },\n          { sourceContainer: "scont179", destinationContainer: "dcont179" },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,c.kt)("h3",{id:"storageaccountupdateobjectreplicationpolicyonsource"},"StorageAccountUpdateObjectReplicationPolicyOnSource"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ObjectReplicationPolicy",\n    group: "Storage",\n    name: "myObjectReplicationPolicy",\n    properties: () => ({\n      properties: {\n        sourceAccount: "src1122",\n        destinationAccount: "dst112",\n        rules: [\n          {\n            ruleId: "d5d18a48-8801-4554-aeaa-74faf65f5ef9",\n            sourceContainer: "scont139",\n            destinationContainer: "dcont139",\n            filters: { prefixMatch: ["blobA", "blobB"] },\n          },\n          {\n            ruleId: "cfbb4bc2-8b60-429f-b05a-d1e0942b33b2",\n            sourceContainer: "scont179",\n            destinationContainer: "dcont179",\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,c.kt)("h2",{id:"dependencies"},"Dependencies"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/azure/resources/Storage/StorageAccount"},"StorageAccount"))),(0,c.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Returns the Storage Account Object Replication Policy.',\n      properties: {\n        policyId: {\n          readOnly: true,\n          type: 'string',\n          description: 'A unique id for object replication policy.'\n        },\n        enabledTime: {\n          readOnly: true,\n          type: 'string',\n          format: 'date-time',\n          description: 'Indicates when the policy is enabled on the source account.'\n        },\n        sourceAccount: {\n          type: 'string',\n          description: 'Required. Source account name. It should be full resource id if allowCrossTenantReplication set to false.'\n        },\n        destinationAccount: {\n          type: 'string',\n          description: 'Required. Destination account name. It should be full resource id if allowCrossTenantReplication set to false.'\n        },\n        rules: {\n          type: 'array',\n          items: {\n            properties: {\n              ruleId: {\n                type: 'string',\n                description: 'Rule Id is auto-generated for each new rule on destination account. It is required for put policy on source account.'\n              },\n              sourceContainer: {\n                type: 'string',\n                description: 'Required. Source container name.'\n              },\n              destinationContainer: {\n                type: 'string',\n                description: 'Required. Destination container name.'\n              },\n              filters: {\n                description: 'Optional. An object that defines the filter set.',\n                properties: {\n                  prefixMatch: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'Optional. Filters the results to replicate only blobs whose names begin with the specified prefix.'\n                  },\n                  minCreationTime: {\n                    type: 'string',\n                    description: \"Blobs created after the time will be replicated to the destination. It must be in datetime format 'yyyy-MM-ddTHH:mm:ssZ'. Example: 2020-02-19T16:05:00Z\"\n                  }\n                }\n              }\n            },\n            required: [ 'sourceContainer', 'destinationContainer' ],\n            description: 'The replication policy rule between two containers.'\n          },\n          description: 'The storage account object replication rules.'\n        }\n      },\n      required: [ 'sourceAccount', 'destinationAccount' ]\n    }\n  },\n  allOf: [\n    {\n      title: 'Resource',\n      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n      type: 'object',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the resource'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'The replication policy between two storage accounts. Multiple rules can be defined in one policy.'\n}\n")),(0,c.kt)("h2",{id:"misc"},"Misc"),(0,c.kt)("p",null,"The resource version is ",(0,c.kt)("inlineCode",{parentName:"p"},"2021-09-01"),"."),(0,c.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,c.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-09-01/storage.json"},"here"),"."))}d.isMDXComponent=!0}}]);