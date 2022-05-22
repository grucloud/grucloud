"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[47163],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return y}});var t=r(67294);function i(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){i(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,i=function(e,n){if(null==e)return{};var r,t,i={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(i[r]=e[r]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var l=t.createContext({}),p=function(e){var n=t.useContext(l),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},u=function(e){var n=p(e.components);return t.createElement(l.Provider,{value:n},e.children)},c={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var r=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=p(r),y=i,d=m["".concat(l,".").concat(y)]||m[y]||c[y]||a;return r?t.createElement(d,o(o({ref:n},u),{},{components:r})):t.createElement(d,o({ref:n},u))}));function y(e,n){var r=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=r.length,o=new Array(a);o[0]=m;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s.mdxType="string"==typeof e?e:i,o[1]=s;for(var p=2;p<a;p++)o[p]=r[p];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}m.displayName="MDXCreateElement"},49844:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return u},default:function(){return m}});var t=r(87462),i=r(63366),a=(r(67294),r(3905)),o=["components"],s={id:"Gallery",title:"Gallery"},l=void 0,p={unversionedId:"azure/resources/Compute/Gallery",id:"azure/resources/Compute/Gallery",isDocsHomePage:!1,title:"Gallery",description:"Provides a Gallery from the Compute group",source:"@site/docs/azure/resources/Compute/Gallery.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/Gallery",permalink:"/docs/azure/resources/Compute/Gallery",tags:[],version:"current",frontMatter:{id:"Gallery",title:"Gallery"},sidebar:"docs",previous:{title:"DiskEncryptionSet",permalink:"/docs/azure/resources/Compute/DiskEncryptionSet"},next:{title:"GalleryApplication",permalink:"/docs/azure/resources/Compute/GalleryApplication"}},u=[{value:"Examples",id:"examples",children:[{value:"Create or update a simple gallery.",id:"create-or-update-a-simple-gallery",children:[],level:3},{value:"Create or update a simple gallery with sharing profile.",id:"create-or-update-a-simple-gallery-with-sharing-profile",children:[],level:3},{value:"Create or update a simple gallery with soft deletion enabled.",id:"create-or-update-a-simple-gallery-with-soft-deletion-enabled",children:[],level:3},{value:"Create a community gallery.",id:"create-a-community-gallery",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],c={toc:u};function m(e){var n=e.components,r=(0,i.Z)(e,o);return(0,a.kt)("wrapper",(0,t.Z)({},c,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"Gallery")," from the ",(0,a.kt)("strong",{parentName:"p"},"Compute")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"create-or-update-a-simple-gallery"},"Create or update a simple gallery."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Gallery",\n    group: "Compute",\n    name: "myGallery",\n    properties: () => ({\n      location: "West US",\n      properties: { description: "This is the gallery description." },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,a.kt)("h3",{id:"create-or-update-a-simple-gallery-with-sharing-profile"},"Create or update a simple gallery with sharing profile."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Gallery",\n    group: "Compute",\n    name: "myGallery",\n    properties: () => ({\n      location: "West US",\n      properties: {\n        description: "This is the gallery description.",\n        sharingProfile: { permissions: "Groups" },\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,a.kt)("h3",{id:"create-or-update-a-simple-gallery-with-soft-deletion-enabled"},"Create or update a simple gallery with soft deletion enabled."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Gallery",\n    group: "Compute",\n    name: "myGallery",\n    properties: () => ({\n      location: "West US",\n      properties: {\n        description: "This is the gallery description.",\n        softDeletePolicy: { isSoftDeleteEnabled: true },\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,a.kt)("h3",{id:"create-a-community-gallery"},"Create a community gallery."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Gallery",\n    group: "Compute",\n    name: "myGallery",\n    properties: () => ({\n      location: "West US",\n      properties: {\n        description: "This is the gallery description.",\n        sharingProfile: {\n          permissions: "Community",\n          communityGalleryInfo: {\n            publisherUri: "uri",\n            publisherContact: "pir@microsoft.com",\n            eula: "eula",\n            publicNamePrefix: "PirPublic",\n          },\n        },\n      },\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      properties: {\n        description: {\n          type: 'string',\n          description: 'The description of this Shared Image Gallery resource. This property is updatable.'\n        },\n        identifier: {\n          properties: {\n            uniqueName: {\n              readOnly: true,\n              type: 'string',\n              description: 'The unique name of the Shared Image Gallery. This name is generated automatically by Azure.'\n            }\n          },\n          description: 'Describes the gallery unique name.'\n        },\n        provisioningState: {\n          readOnly: true,\n          type: 'string',\n          title: 'The current state of the gallery.',\n          description: 'The provisioning state, which only appears in the response.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Failed',\n            'Succeeded',\n            'Deleting',\n            'Migrating'\n          ]\n        },\n        sharingProfile: {\n          description: 'Profile for gallery sharing to subscription or tenant',\n          properties: {\n            permissions: {\n              type: 'string',\n              description: 'This property allows you to specify the permission of sharing gallery. <br><br> Possible values are: <br><br> **Private** <br><br> **Groups**',\n              enum: [ 'Private', 'Groups' ],\n              'x-ms-enum': {\n                name: 'GallerySharingPermissionTypes',\n                modelAsString: true\n              }\n            },\n            groups: {\n              readOnly: true,\n              type: 'array',\n              items: {\n                description: 'Group of the gallery sharing profile',\n                properties: {\n                  type: {\n                    type: 'string',\n                    description: 'This property allows you to specify the type of sharing group. <br><br> Possible values are: <br><br> **Subscriptions** <br><br> **AADTenants** <br><br> **Community**',\n                    enum: [ 'Subscriptions', 'AADTenants', 'Community' ],\n                    'x-ms-enum': {\n                      name: 'SharingProfileGroupTypes',\n                      modelAsString: true\n                    }\n                  },\n                  ids: {\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'A list of subscription/tenant ids the gallery is aimed to be shared to.'\n                  }\n                }\n              },\n              'x-ms-identifiers': [],\n              description: 'A list of sharing profile groups.'\n            },\n            communityGalleryInfo: {\n              items: {\n                type: 'object',\n                description: 'Information of community gallery if current gallery is shared to community',\n                properties: {\n                  publisherUri: {\n                    type: 'string',\n                    description: 'Community gallery publisher uri'\n                  },\n                  publisherContact: {\n                    type: 'string',\n                    description: 'Community gallery publisher contact email'\n                  },\n                  eula: {\n                    type: 'string',\n                    description: 'Community gallery publisher eula'\n                  },\n                  publicNamePrefix: {\n                    type: 'string',\n                    description: 'Community gallery public name prefix'\n                  },\n                  communityGalleryEnabled: {\n                    readOnly: true,\n                    type: 'boolean',\n                    description: 'Contains info about whether community gallery sharing is enabled.'\n                  },\n                  publicNames: {\n                    readOnly: true,\n                    type: 'array',\n                    items: { type: 'string' },\n                    description: 'Community gallery public name list.'\n                  }\n                }\n              },\n              description: 'Information of community gallery if current gallery is shared to community.'\n            }\n          }\n        },\n        softDeletePolicy: {\n          type: 'object',\n          properties: {\n            isSoftDeleteEnabled: {\n              type: 'boolean',\n              description: 'Enables soft-deletion for resources in this gallery, allowing them to be recovered within retention time.'\n            }\n          },\n          description: 'Contains information about the soft deletion policy of the gallery.'\n        },\n        sharingStatus: {\n          readOnly: true,\n          type: 'object',\n          properties: {\n            aggregatedState: {\n              type: 'string',\n              description: 'Aggregated sharing state of current gallery.',\n              readOnly: true,\n              title: 'The sharing state of the gallery.',\n              enum: [ 'Succeeded', 'InProgress', 'Failed', 'Unknown' ],\n              'x-ms-enum': { name: 'SharingState', modelAsString: true }\n            },\n            summary: {\n              type: 'array',\n              items: {\n                type: 'object',\n                description: 'Gallery regional sharing status',\n                properties: {\n                  region: { type: 'string', description: 'Region name' },\n                  state: {\n                    type: 'string',\n                    description: 'Gallery sharing state in current region',\n                    readOnly: true,\n                    title: 'The sharing state of the gallery.',\n                    enum: [ 'Succeeded', 'InProgress', 'Failed', 'Unknown' ],\n                    'x-ms-enum': { name: 'SharingState', modelAsString: true }\n                  },\n                  details: {\n                    type: 'string',\n                    description: 'Details of gallery regional sharing failure.'\n                  }\n                }\n              },\n              'x-ms-identifiers': [ 'region' ],\n              description: 'Summary of all regional sharing status.'\n            }\n          },\n          description: 'Sharing status of current gallery.'\n        }\n      },\n      description: 'Describes the properties of a Shared Image Gallery.'\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Specifies information about the Shared Image Gallery that you want to create or update.'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2021-10-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-10-01/gallery.json"},"here"),"."))}m.isMDXComponent=!0}}]);