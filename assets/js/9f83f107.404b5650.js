"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[13386],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return m}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var a=r.createContext({}),p=function(e){var n=r.useContext(a),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},u=function(e){var n=p(e.components);return r.createElement(a.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),l=p(t),m=i,y=l["".concat(a,".").concat(m)]||l[m]||d[m]||o;return t?r.createElement(y,s(s({ref:n},u),{},{components:t})):r.createElement(y,s({ref:n},u))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,s=new Array(o);s[0]=l;var c={};for(var a in n)hasOwnProperty.call(n,a)&&(c[a]=n[a]);c.originalType=e,c.mdxType="string"==typeof e?e:i,s[1]=c;for(var p=2;p<o;p++)s[p]=t[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},9333:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return c},contentTitle:function(){return a},metadata:function(){return p},toc:function(){return u},default:function(){return l}});var r=t(87462),i=t(63366),o=(t(67294),t(3905)),s=["components"],c={id:"DiskAccess",title:"DiskAccess"},a=void 0,p={unversionedId:"azure/resources/Compute/DiskAccess",id:"azure/resources/Compute/DiskAccess",isDocsHomePage:!1,title:"DiskAccess",description:"Provides a DiskAccess from the Compute group",source:"@site/docs/azure/resources/Compute/DiskAccess.md",sourceDirName:"azure/resources/Compute",slug:"/azure/resources/Compute/DiskAccess",permalink:"/docs/azure/resources/Compute/DiskAccess",tags:[],version:"current",frontMatter:{id:"DiskAccess",title:"DiskAccess"},sidebar:"docs",previous:{title:"Disk",permalink:"/docs/azure/resources/Compute/Disk"},next:{title:"DiskAccessAPrivateEndpointConnection",permalink:"/docs/azure/resources/Compute/DiskAccessAPrivateEndpointConnection"}},u=[{value:"Examples",id:"examples",children:[{value:"Create a disk access resource.",id:"create-a-disk-access-resource",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],d={toc:u};function l(e){var n=e.components,t=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"DiskAccess")," from the ",(0,o.kt)("strong",{parentName:"p"},"Compute")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-a-disk-access-resource"},"Create a disk access resource."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "DiskAccess",\n    group: "Compute",\n    name: "myDiskAccess",\n    properties: () => ({ location: "West US" }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      properties: {\n        privateEndpointConnections: {\n          type: 'array',\n          readOnly: true,\n          items: {\n            properties: {\n              properties: {\n                'x-ms-client-flatten': true,\n                description: 'Resource properties.',\n                properties: {\n                  privateEndpoint: {\n                    description: 'The resource of private end point.',\n                    readOnly: true,\n                    properties: {\n                      id: {\n                        readOnly: true,\n                        type: 'string',\n                        description: 'The ARM identifier for Private Endpoint'\n                      }\n                    }\n                  },\n                  privateLinkServiceConnectionState: {\n                    description: 'A collection of information about the state of the connection between DiskAccess and Virtual Network.',\n                    properties: {\n                      status: {\n                        description: 'Indicates whether the connection has been Approved/Rejected/Removed by the owner of the service.',\n                        type: 'string',\n                        enum: [ 'Pending', 'Approved', 'Rejected' ],\n                        'x-ms-enum': {\n                          name: 'PrivateEndpointServiceConnectionStatus',\n                          modelAsString: true\n                        }\n                      },\n                      description: {\n                        type: 'string',\n                        description: 'The reason for approval/rejection of the connection.'\n                      },\n                      actionsRequired: {\n                        type: 'string',\n                        description: 'A message indicating if changes on the service provider require any updates on the consumer.'\n                      }\n                    }\n                  },\n                  provisioningState: {\n                    description: 'The provisioning state of the private endpoint connection resource.',\n                    type: 'string',\n                    readOnly: true,\n                    enum: [ 'Succeeded', 'Creating', 'Deleting', 'Failed' ],\n                    'x-ms-enum': {\n                      name: 'PrivateEndpointConnectionProvisioningState',\n                      modelAsString: true\n                    }\n                  }\n                },\n                required: [ 'privateLinkServiceConnectionState' ]\n              },\n              id: {\n                readOnly: true,\n                type: 'string',\n                description: 'private endpoint connection Id'\n              },\n              name: {\n                readOnly: true,\n                type: 'string',\n                description: 'private endpoint connection name'\n              },\n              type: {\n                readOnly: true,\n                type: 'string',\n                description: 'private endpoint connection type'\n              }\n            },\n            description: 'The Private Endpoint Connection resource.',\n            'x-ms-azure-resource': true\n          },\n          description: 'A readonly collection of private endpoint connections created on the disk. Currently only one endpoint connection is supported.'\n        },\n        provisioningState: {\n          readOnly: true,\n          type: 'string',\n          description: 'The disk access resource provisioning state.'\n        },\n        timeCreated: {\n          readOnly: true,\n          type: 'string',\n          format: 'date-time',\n          description: 'The time when the disk access was created.'\n        }\n      }\n    },\n    extendedLocation: {\n      description: 'The extended location where the disk access will be created. Extended location cannot be changed.',\n      properties: {\n        name: {\n          type: 'string',\n          description: 'The name of the extended location.'\n        },\n        type: {\n          description: 'The type of the extended location.',\n          type: 'string',\n          enum: [ 'EdgeZone' ],\n          'x-ms-enum': { name: 'ExtendedLocationTypes', modelAsString: true }\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      description: 'The Resource model definition.',\n      properties: {\n        id: { readOnly: true, type: 'string', description: 'Resource Id' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type'\n        },\n        location: { type: 'string', description: 'Resource location' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'disk access resource.'\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-12-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/compute/resource-manager/Microsoft.Compute/stable/2021-12-01/disk.json"},"here"),"."))}l.isMDXComponent=!0}}]);