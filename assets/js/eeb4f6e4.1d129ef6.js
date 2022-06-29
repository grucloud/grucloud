"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[38350],{3905:(e,r,t)=>{t.d(r,{Zo:()=>l,kt:()=>y});var n=t(67294);function s(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){s(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,s=function(e,r){if(null==e)return{};var t,n,s={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(s[t]=e[t]);return s}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(s[t]=e[t])}return s}var c=n.createContext({}),p=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},l=function(e){var r=p(e.components);return n.createElement(c.Provider,{value:r},e.children)},u={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,s=e.mdxType,o=e.originalType,c=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),d=p(t),y=s,m=d["".concat(c,".").concat(y)]||d[y]||u[y]||o;return t?n.createElement(m,a(a({ref:r},l),{},{components:t})):n.createElement(m,a({ref:r},l))}));function y(e,r){var t=arguments,s=r&&r.mdxType;if("string"==typeof e||s){var o=t.length,a=new Array(o);a[0]=d;var i={};for(var c in r)hasOwnProperty.call(r,c)&&(i[c]=r[c]);i.originalType=e,i.mdxType="string"==typeof e?e:s,a[1]=i;for(var p=2;p<o;p++)a[p]=t[p];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},46280:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>a,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>p});var n=t(87462),s=(t(67294),t(3905));const o={id:"LocalUser",title:"LocalUser"},a=void 0,i={unversionedId:"azure/resources/Storage/LocalUser",id:"azure/resources/Storage/LocalUser",title:"LocalUser",description:"Provides a LocalUser from the Storage group",source:"@site/docs/azure/resources/Storage/LocalUser.md",sourceDirName:"azure/resources/Storage",slug:"/azure/resources/Storage/LocalUser",permalink:"/docs/azure/resources/Storage/LocalUser",draft:!1,tags:[],version:"current",frontMatter:{id:"LocalUser",title:"LocalUser"},sidebar:"docs",previous:{title:"FileShare",permalink:"/docs/azure/resources/Storage/FileShare"},next:{title:"ObjectReplicationPolicy",permalink:"/docs/azure/resources/Storage/ObjectReplicationPolicy"}},c={},p=[{value:"Examples",id:"examples",level:2},{value:"CreateLocalUser",id:"createlocaluser",level:3},{value:"UpdateLocalUser",id:"updatelocaluser",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],l={toc:p};function u(e){let{components:r,...t}=e;return(0,s.kt)("wrapper",(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Provides a ",(0,s.kt)("strong",{parentName:"p"},"LocalUser")," from the ",(0,s.kt)("strong",{parentName:"p"},"Storage")," group"),(0,s.kt)("h2",{id:"examples"},"Examples"),(0,s.kt)("h3",{id:"createlocaluser"},"CreateLocalUser"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "LocalUser",\n    group: "Storage",\n    name: "myLocalUser",\n    properties: () => ({\n      properties: {\n        permissionScopes: [\n          { permissions: "rwd", service: "file", resourceName: "share1" },\n          { permissions: "rw", service: "file", resourceName: "share2" },\n        ],\n        homeDirectory: "homedirectory",\n        hasSshPassword: true,\n        sshAuthorizedKeys: [\n          { description: "key name", key: "ssh-rsa keykeykeykeykey=" },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,s.kt)("h3",{id:"updatelocaluser"},"UpdateLocalUser"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "LocalUser",\n    group: "Storage",\n    name: "myLocalUser",\n    properties: () => ({\n      properties: {\n        homeDirectory: "homedirectory2",\n        hasSharedKey: false,\n        hasSshPassword: false,\n        hasSshKey: false,\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      account: "myStorageAccount",\n    }),\n  },\n];\n\n')),(0,s.kt)("h2",{id:"dependencies"},"Dependencies"),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("a",{parentName:"li",href:"/docs/azure/resources/Storage/StorageAccount"},"StorageAccount"))),(0,s.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js"},"{\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Storage account local user properties.',\n      type: 'object',\n      properties: {\n        permissionScopes: {\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              permissions: {\n                type: 'string',\n                description: 'The permissions for the local user. Possible values include: Read (r), Write (w), Delete (d), List (l), and Create (c).'\n              },\n              service: {\n                type: 'string',\n                description: 'The service used by the local user, e.g. blob, file.'\n              },\n              resourceName: {\n                type: 'string',\n                description: 'The name of resource, normally the container name or the file share name, used by the local user.'\n              }\n            },\n            required: [ 'permissions', 'service', 'resourceName' ]\n          },\n          description: 'The permission scopes of the local user.'\n        },\n        homeDirectory: {\n          type: 'string',\n          description: 'Optional, local user home directory.'\n        },\n        sshAuthorizedKeys: {\n          type: 'array',\n          items: {\n            type: 'object',\n            properties: {\n              description: {\n                type: 'string',\n                description: 'Optional. It is used to store the function/usage of the key'\n              },\n              key: {\n                type: 'string',\n                description: \"Ssh public key base64 encoded. The format should be: '<keyType> <keyData>', e.g. ssh-rsa AAAABBBB\"\n              }\n            }\n          },\n          description: 'Optional, local user ssh authorized keys for SFTP.'\n        },\n        sid: {\n          readOnly: true,\n          type: 'string',\n          description: 'A unique Security Identifier that is generated by the server.'\n        },\n        hasSharedKey: {\n          type: 'boolean',\n          description: 'Indicates whether shared key exists. Set it to false to remove existing shared key.'\n        },\n        hasSshKey: {\n          type: 'boolean',\n          description: 'Indicates whether ssh key exists. Set it to false to remove existing SSH key.'\n        },\n        hasSshPassword: {\n          type: 'boolean',\n          description: 'Indicates whether ssh password exists. Set it to false to remove existing SSH password.'\n        }\n      }\n    },\n    systemData: {\n      description: 'Metadata pertaining to creation and last modification of the resource.',\n      type: 'object',\n      readOnly: true,\n      properties: {\n        createdBy: {\n          type: 'string',\n          description: 'The identity that created the resource.'\n        },\n        createdByType: {\n          type: 'string',\n          description: 'The type of identity that created the resource.',\n          enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n          'x-ms-enum': { name: 'createdByType', modelAsString: true }\n        },\n        createdAt: {\n          type: 'string',\n          format: 'date-time',\n          description: 'The timestamp of resource creation (UTC).'\n        },\n        lastModifiedBy: {\n          type: 'string',\n          description: 'The identity that last modified the resource.'\n        },\n        lastModifiedByType: {\n          type: 'string',\n          description: 'The type of identity that last modified the resource.',\n          enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n          'x-ms-enum': { name: 'createdByType', modelAsString: true }\n        },\n        lastModifiedAt: {\n          type: 'string',\n          format: 'date-time',\n          description: 'The timestamp of resource last modification (UTC)'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      title: 'Resource',\n      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n      type: 'object',\n      properties: {\n        id: {\n          readOnly: true,\n          type: 'string',\n          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n        },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'The name of the resource'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'The local user associated with the storage accounts.'\n}\n")),(0,s.kt)("h2",{id:"misc"},"Misc"),(0,s.kt)("p",null,"The resource version is ",(0,s.kt)("inlineCode",{parentName:"p"},"2021-09-01"),"."),(0,s.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,s.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-09-01/storage.json"},"here"),"."))}u.isMDXComponent=!0}}]);