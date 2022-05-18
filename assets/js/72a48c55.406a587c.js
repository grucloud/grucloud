"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4353],{3905:function(e,n,t){t.d(n,{Zo:function(){return d},kt:function(){return m}});var r=t(67294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var c=r.createContext({}),p=function(e){var n=r.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},d=function(e){var n=p(e.components);return r.createElement(c.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),l=p(t),m=i,y=l["".concat(c,".").concat(m)]||l[m]||u[m]||o;return t?r.createElement(y,a(a({ref:n},d),{},{components:t})):r.createElement(y,a({ref:n},d))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=l;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s.mdxType="string"==typeof e?e:i,a[1]=s;for(var p=2;p<o;p++)a[p]=t[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},41344:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return d},default:function(){return l}});var r=t(87462),i=t(63366),o=(t(67294),t(3905)),a=["components"],s={id:"PrivateEndpointConnection",title:"PrivateEndpointConnection"},c=void 0,p={unversionedId:"azure/resources/ContainerRegistry/PrivateEndpointConnection",id:"azure/resources/ContainerRegistry/PrivateEndpointConnection",isDocsHomePage:!1,title:"PrivateEndpointConnection",description:"Provides a PrivateEndpointConnection from the ContainerRegistry group",source:"@site/docs/azure/resources/ContainerRegistry/PrivateEndpointConnection.md",sourceDirName:"azure/resources/ContainerRegistry",slug:"/azure/resources/ContainerRegistry/PrivateEndpointConnection",permalink:"/docs/azure/resources/ContainerRegistry/PrivateEndpointConnection",tags:[],version:"current",frontMatter:{id:"PrivateEndpointConnection",title:"PrivateEndpointConnection"},sidebar:"docs",previous:{title:"PipelineRun",permalink:"/docs/azure/resources/ContainerRegistry/PipelineRun"},next:{title:"Registry",permalink:"/docs/azure/resources/ContainerRegistry/Registry"}},d=[{value:"Examples",id:"examples",children:[{value:"PrivateEndpointConnectionCreateOrUpdate",id:"privateendpointconnectioncreateorupdate",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:d};function l(e){var n=e.components,t=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"PrivateEndpointConnection")," from the ",(0,o.kt)("strong",{parentName:"p"},"ContainerRegistry")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"privateendpointconnectioncreateorupdate"},"PrivateEndpointConnectionCreateOrUpdate"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PrivateEndpointConnection",\n    group: "ContainerRegistry",\n    name: "myPrivateEndpointConnection",\n    properties: () => ({\n      properties: {\n        privateLinkServiceConnectionState: {\n          status: "Approved",\n          description: "Auto-Approved",\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      privateEndpoint: "myPrivateEndpoint",\n      registry: "myRegistry",\n    }),\n  },\n];\n\n')),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/PrivateEndpoint"},"PrivateEndpoint")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/ContainerRegistry/Registry"},"Registry"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'An object that represents a private endpoint connection for a container registry.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags.',\n      properties: {\n        id: {\n          description: 'The resource ID.',\n          type: 'string',\n          readOnly: true\n        },\n        name: {\n          description: 'The name of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        type: {\n          description: 'The type of the resource.',\n          type: 'string',\n          readOnly: true\n        },\n        systemData: {\n          description: 'Metadata pertaining to creation and last modification of the resource.',\n          type: 'object',\n          readOnly: true,\n          properties: {\n            createdBy: {\n              description: 'The identity that created the resource.',\n              type: 'string'\n            },\n            createdByType: {\n              description: 'The type of identity that created the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'createdByType', modelAsString: true }\n            },\n            createdAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource creation (UTC).',\n              type: 'string'\n            },\n            lastModifiedBy: {\n              description: 'The identity that last modified the resource.',\n              type: 'string'\n            },\n            lastModifiedByType: {\n              description: 'The type of identity that last modified the resource.',\n              enum: [ 'User', 'Application', 'ManagedIdentity', 'Key' ],\n              type: 'string',\n              'x-ms-enum': { name: 'lastModifiedByType', modelAsString: true }\n            },\n            lastModifiedAt: {\n              format: 'date-time',\n              description: 'The timestamp of resource modification (UTC).',\n              type: 'string'\n            }\n          }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'The properties of a private endpoint connection.',\n      'x-ms-client-flatten': true,\n      type: 'object',\n      properties: {\n        privateEndpoint: {\n          description: 'The resource of private endpoint.',\n          type: 'object',\n          properties: {\n            id: {\n              description: 'This is private endpoint resource created with Microsoft.Network resource provider.',\n              type: 'string'\n            }\n          }\n        },\n        privateLinkServiceConnectionState: {\n          description: 'A collection of information about the state of the connection between service consumer and provider.',\n          type: 'object',\n          properties: {\n            status: {\n              description: 'The private link service connection status.',\n              enum: [ 'Approved', 'Pending', 'Rejected', 'Disconnected' ],\n              type: 'string',\n              'x-ms-enum': { name: 'ConnectionStatus', modelAsString: true }\n            },\n            description: {\n              description: 'The description for connection status. For example if connection is rejected it can indicate reason for rejection.',\n              type: 'string'\n            },\n            actionsRequired: {\n              description: 'A message indicating if changes on the service provider require any updates on the consumer.',\n              enum: [ 'None', 'Recreate' ],\n              type: 'string',\n              'x-ms-enum': { name: 'ActionsRequired', modelAsString: true }\n            }\n          }\n        },\n        provisioningState: {\n          description: 'The provisioning state of private endpoint connection resource.',\n          enum: [\n            'Creating',\n            'Updating',\n            'Deleting',\n            'Succeeded',\n            'Failed',\n            'Canceled'\n          ],\n          type: 'string',\n          readOnly: true,\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2022-02-01-preview"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/containerregistry/resource-manager/Microsoft.ContainerRegistry/preview/2022-02-01-preview/containerregistry.json"},"here"),"."))}l.isMDXComponent=!0}}]);