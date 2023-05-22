"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[19981],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>y});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function s(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?s(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},s=Object.keys(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)t=s[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=r.createContext({}),p=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},u=function(e){var n=p(e.components);return r.createElement(c.Provider,{value:n},e.children)},d="mdxType",l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,s=e.originalType,c=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=p(t),m=o,y=d["".concat(c,".").concat(m)]||d[m]||l[m]||s;return t?r.createElement(y,i(i({ref:n},u),{},{components:t})):r.createElement(y,i({ref:n},u))}));function y(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var s=t.length,i=new Array(s);i[0]=m;var a={};for(var c in n)hasOwnProperty.call(n,c)&&(a[c]=n[c]);a.originalType=e,a[d]="string"==typeof e?e:o,i[1]=a;for(var p=2;p<s;p++)i[p]=t[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},85954:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>l,frontMatter:()=>s,metadata:()=>a,toc:()=>p});var r=t(87462),o=(t(67294),t(3905));const s={id:"Snapshot",title:"Snapshot"},i=void 0,a={unversionedId:"azure/resources/ContainerService/Snapshot",id:"azure/resources/ContainerService/Snapshot",title:"Snapshot",description:"Provides a Snapshot from the ContainerService group",source:"@site/docs/azure/resources/ContainerService/Snapshot.md",sourceDirName:"azure/resources/ContainerService",slug:"/azure/resources/ContainerService/Snapshot",permalink:"/docs/azure/resources/ContainerService/Snapshot",draft:!1,tags:[],version:"current",frontMatter:{id:"Snapshot",title:"Snapshot"},sidebar:"docs",previous:{title:"PrivateEndpointConnection",permalink:"/docs/azure/resources/ContainerService/PrivateEndpointConnection"},next:{title:"TrustedAccessRoleBinding",permalink:"/docs/azure/resources/ContainerService/TrustedAccessRoleBinding"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"Create/Update Snapshot",id:"createupdate-snapshot",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:p},d="wrapper";function l(e){let{components:n,...t}=e;return(0,o.kt)(d,(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"Snapshot")," from the ",(0,o.kt)("strong",{parentName:"p"},"ContainerService")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"createupdate-snapshot"},"Create/Update Snapshot"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Snapshot",\n    group: "ContainerService",\n    name: "mySnapshot",\n    properties: () => ({\n      location: "westus",\n      tags: { key1: "val1", key2: "val2" },\n      properties: {\n        creationData: {\n          sourceResourceId:\n            "/subscriptions/subid1/resourcegroups/rg1/providers/Microsoft.ContainerService/managedClusters/cluster1/agentPools/pool0",\n        },\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-json"},"{\n  type: 'object',\n  properties: {\n    properties: {\n      description: 'Properties of a snapshot.',\n      'x-ms-client-flatten': true,\n      type: 'object',\n      properties: {\n        creationData: {\n          description: 'CreationData to be used to specify the source agent pool resource ID to create this snapshot.',\n          type: 'object',\n          properties: {\n            sourceResourceId: {\n              type: 'string',\n              format: 'arm-id',\n              description: 'This is the ARM ID of the source object to be used to create the target object.'\n            }\n          }\n        },\n        snapshotType: {\n          type: 'string',\n          default: 'NodePool',\n          enum: [ 'NodePool' ],\n          'x-ms-enum': {\n            name: 'SnapshotType',\n            modelAsString: true,\n            values: [\n              {\n                value: 'NodePool',\n                description: 'The snapshot is a snapshot of a node pool.'\n              }\n            ]\n          },\n          description: 'The type of a snapshot. The default is NodePool.'\n        },\n        kubernetesVersion: {\n          readOnly: true,\n          type: 'string',\n          description: 'The version of Kubernetes.'\n        },\n        nodeImageVersion: {\n          readOnly: true,\n          type: 'string',\n          description: 'The version of node image.'\n        },\n        osType: {\n          readOnly: true,\n          type: 'string',\n          default: 'Linux',\n          enum: [ 'Linux', 'Windows' ],\n          'x-ms-enum': {\n            name: 'OSType',\n            modelAsString: true,\n            values: [\n              { value: 'Linux', description: 'Use Linux.' },\n              { value: 'Windows', description: 'Use Windows.' }\n            ]\n          },\n          description: 'The operating system type. The default is Linux.'\n        },\n        osSku: {\n          readOnly: true,\n          type: 'string',\n          enum: [ 'Ubuntu', 'CBLMariner' ],\n          'x-ms-enum': { name: 'OSSKU', modelAsString: true },\n          description: 'Specifies an OS SKU. This value must not be specified if OSType is Windows.'\n        },\n        vmSize: {\n          readOnly: true,\n          type: 'string',\n          description: 'The size of the VM.'\n        },\n        enableFIPS: {\n          readOnly: true,\n          type: 'boolean',\n          description: 'Whether to use a FIPS-enabled OS.'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      title: 'Tracked Resource',\n      description: \"The resource model definition for an Azure Resource Manager tracked top level resource which has 'tags' and a 'location'\",\n      type: 'object',\n      properties: {\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          'x-ms-mutability': [ 'read', 'create', 'update' ],\n          description: 'Resource tags.'\n        },\n        location: {\n          type: 'string',\n          'x-ms-mutability': [ 'read', 'create' ],\n          description: 'The geo-location where the resource lives'\n        }\n      },\n      required: [ 'location' ],\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            },\n            systemData: {\n              readOnly: true,\n              type: 'object',\n              description: 'Azure Resource Manager metadata containing createdBy and modifiedBy information.',\n              properties: {\n                createdBy: {\n                  type: 'string',\n                  description: 'The identity that created the resource.'\n                },\n                createdByType: {\n                  type: 'string',\n                  description: 'The type of identity that created the resource.',\n                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n                  'x-ms-enum': { name: 'createdByType', modelAsString: true }\n                },\n                createdAt: {\n                  type: 'string',\n                  format: 'date-time',\n                  description: 'The timestamp of resource creation (UTC).'\n                },\n                lastModifiedBy: {\n                  type: 'string',\n                  description: 'The identity that last modified the resource.'\n                },\n                lastModifiedByType: {\n                  type: 'string',\n                  description: 'The type of identity that last modified the resource.',\n                  enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n                  'x-ms-enum': { name: 'createdByType', modelAsString: true }\n                },\n                lastModifiedAt: {\n                  type: 'string',\n                  format: 'date-time',\n                  description: 'The timestamp of resource last modification (UTC)'\n                }\n              }\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  description: 'A node pool snapshot resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-06-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerservice/resource-manager/Microsoft.ContainerService/stable/2022-06-01/managedClusters.json"},"here"),"."))}l.isMDXComponent=!0}}]);