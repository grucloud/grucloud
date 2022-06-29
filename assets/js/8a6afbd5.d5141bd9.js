"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[18620],{3905:(e,r,n)=>{n.d(r,{Zo:()=>u,kt:()=>m});var t=n(67294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function s(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function i(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?s(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function o(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},s=Object.keys(e);for(t=0;t<s.length;t++)n=s[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(t=0;t<s.length;t++)n=s[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=t.createContext({}),p=function(e){var r=t.useContext(c),n=r;return e&&(n="function"==typeof e?e(r):i(i({},r),e)),n},u=function(e){var r=p(e.components);return t.createElement(c.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,s=e.originalType,c=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),d=p(n),m=a,h=d["".concat(c,".").concat(m)]||d[m]||l[m]||s;return n?t.createElement(h,i(i({ref:r},u),{},{components:n})):t.createElement(h,i({ref:r},u))}));function m(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var s=n.length,i=new Array(s);i[0]=d;var o={};for(var c in r)hasOwnProperty.call(r,c)&&(o[c]=r[c]);o.originalType=e,o.mdxType="string"==typeof e?e:a,i[1]=o;for(var p=2;p<s;p++)i[p]=n[p];return t.createElement.apply(null,i)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},91317:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>l,frontMatter:()=>s,metadata:()=>o,toc:()=>p});var t=n(87462),a=(n(67294),n(3905));const s={id:"FileShare",title:"FileShare"},i=void 0,o={unversionedId:"azure/resources/Storage/FileShare",id:"azure/resources/Storage/FileShare",title:"FileShare",description:"Provides a FileShare from the Storage group",source:"@site/docs/azure/resources/Storage/FileShare.md",sourceDirName:"azure/resources/Storage",slug:"/azure/resources/Storage/FileShare",permalink:"/docs/azure/resources/Storage/FileShare",draft:!1,tags:[],version:"current",frontMatter:{id:"FileShare",title:"FileShare"},sidebar:"docs",previous:{title:"FileService",permalink:"/docs/azure/resources/Storage/FileService"},next:{title:"LocalUser",permalink:"/docs/azure/resources/Storage/LocalUser"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"PutShares",id:"putshares",level:3},{value:"Create NFS Shares",id:"create-nfs-shares",level:3},{value:"PutShares with Access Tier",id:"putshares-with-access-tier",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:p};function l(e){let{components:r,...n}=e;return(0,a.kt)("wrapper",(0,t.Z)({},u,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"FileShare")," from the ",(0,a.kt)("strong",{parentName:"p"},"Storage")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"putshares"},"PutShares"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FileShare",\n    group: "Storage",\n    name: "myFileShare",\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,a.kt)("h3",{id:"create-nfs-shares"},"Create NFS Shares"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FileShare",\n    group: "Storage",\n    name: "myFileShare",\n    properties: () => ({ properties: { enabledProtocols: "NFS" } }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,a.kt)("h3",{id:"putshares-with-access-tier"},"PutShares with Access Tier"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FileShare",\n    group: "Storage",\n    name: "myFileShare",\n    properties: () => ({ properties: { accessTier: "Hot" } }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Storage/StorageAccount"},"StorageAccount"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      'x-ms-client-name': 'FileShareProperties',\n      description: 'Properties of the file share.',\n      properties: {\n        lastModifiedTime: {\n          type: 'string',\n          format: 'date-time',\n          readOnly: true,\n          description: 'Returns the date and time the share was last modified.'\n        },\n        metadata: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'A name-value pair to associate with the share as metadata.'\n        },\n        shareQuota: {\n          type: 'integer',\n          minimum: 1,\n          maximum: 102400,\n          description: 'The maximum size of the share, in gigabytes. Must be greater than 0, and less than or equal to 5TB (5120). For Large File Shares, the maximum size is 102400.'\n        },\n        enabledProtocols: {\n          type: 'string',\n          enum: [ 'SMB', 'NFS' ],\n          'x-ms-enum': { name: 'EnabledProtocols', modelAsString: true },\n          description: 'The authentication protocol that is used for the file share. Can only be specified when creating a share.',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        rootSquash: {\n          type: 'string',\n          enum: [ 'NoRootSquash', 'RootSquash', 'AllSquash' ],\n          'x-ms-enum': { name: 'RootSquashType', modelAsString: true },\n          description: 'The property is for NFS share only. The default is NoRootSquash.'\n        },\n        version: {\n          type: 'string',\n          readOnly: true,\n          description: 'The version of the share.'\n        },\n        deleted: {\n          type: 'boolean',\n          readOnly: true,\n          description: 'Indicates whether the share was deleted.'\n        },\n        deletedTime: {\n          type: 'string',\n          format: 'date-time',\n          readOnly: true,\n          description: 'The deleted time if the share was deleted.'\n        },\n        remainingRetentionDays: {\n          type: 'integer',\n          readOnly: true,\n          description: 'Remaining retention days for share that was soft deleted.'\n        },\n        accessTier: {\n          type: 'string',\n          enum: [ 'TransactionOptimized', 'Hot', 'Cool', 'Premium' ],\n          'x-ms-enum': { name: 'ShareAccessTier', modelAsString: true },\n          description: 'Access tier for specific share. GpV2 account can choose between TransactionOptimized (default), Hot, and Cool. FileStorage account can choose Premium.'\n        },\n        accessTierChangeTime: {\n          type: 'string',\n          format: 'date-time',\n          readOnly: true,\n          description: 'Indicates the last modification time for share access tier.'\n        },\n        accessTierStatus: {\n          type: 'string',\n          readOnly: true,\n          description: 'Indicates if there is a pending transition for access tier.'\n        },\n        shareUsageBytes: {\n          type: 'integer',\n          format: 'int64',\n          readOnly: true,\n          description: 'The approximate size of the data stored on the share. Note that this value may not include all recently created or recently resized files.'\n        },\n        leaseStatus: {\n          type: 'string',\n          readOnly: true,\n          enum: [ 'Locked', 'Unlocked' ],\n          'x-ms-enum': { name: 'LeaseStatus', modelAsString: true },\n          description: 'The lease status of the share.'\n        },\n        leaseState: {\n          type: 'string',\n          readOnly: true,\n          enum: [ 'Available', 'Leased', 'Expired', 'Breaking', 'Broken' ],\n          'x-ms-enum': { name: 'LeaseState', modelAsString: true },\n          description: 'Lease state of the share.'\n        },\n        leaseDuration: {\n          type: 'string',\n          readOnly: true,\n          enum: [ 'Infinite', 'Fixed' ],\n          'x-ms-enum': { name: 'LeaseDuration', modelAsString: true },\n          description: 'Specifies whether the lease on a share is of infinite or fixed duration, only when the share is leased.'\n        },\n        signedIdentifiers: {\n          type: 'array',\n          items: {\n            properties: {\n              id: {\n                type: 'string',\n                description: 'An unique identifier of the stored access policy.'\n              },\n              accessPolicy: {\n                description: 'Access policy',\n                properties: {\n                  startTime: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'Start time of the access policy'\n                  },\n                  expiryTime: {\n                    type: 'string',\n                    format: 'date-time',\n                    description: 'Expiry time of the access policy'\n                  },\n                  permission: {\n                    type: 'string',\n                    description: 'List of abbreviated permissions.'\n                  }\n                }\n              }\n            }\n          },\n          description: 'List of stored access policies specified on the share.'\n        },\n        snapshotTime: {\n          type: 'string',\n          format: 'date-time',\n          readOnly: true,\n          description: 'Creation time of share snapshot returned in the response of list shares with expand param \"snapshots\".'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      'x-ms-client-name': 'AzureEntityResource',\n      title: 'Entity Resource',\n      description: 'The resource model definition for an Azure Resource Manager resource with an etag.',\n      type: 'object',\n      properties: {\n        etag: {\n          type: 'string',\n          readOnly: true,\n          description: 'Resource Etag.'\n        }\n      },\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ],\n  description: 'Properties of the file share, including Id, resource name, resource type, Etag.'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2021-09-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-09-01/file.json"},"here"),"."))}l.isMDXComponent=!0}}]);