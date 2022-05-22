"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[66503],{3905:function(e,n,t){t.d(n,{Zo:function(){return u},kt:function(){return m}});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function c(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=r.createContext({}),s=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):c(c({},n),e)),t},u=function(e){var n=s(e.components);return r.createElement(p.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},l=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),l=s(t),m=o,v=l["".concat(p,".").concat(m)]||l[m]||d[m]||i;return t?r.createElement(v,c(c({ref:n},u),{},{components:t})):r.createElement(v,c({ref:n},u))}));function m(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,c=new Array(i);c[0]=l;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:o,c[1]=a;for(var s=2;s<i;s++)c[s]=t[s];return r.createElement.apply(null,c)}return r.createElement.apply(null,t)}l.displayName="MDXCreateElement"},55651:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return p},metadata:function(){return s},toc:function(){return u},default:function(){return l}});var r=t(87462),o=t(63366),i=(t(67294),t(3905)),c=["components"],a={id:"PrivateEndpointConnection",title:"PrivateEndpointConnection"},p=void 0,s={unversionedId:"azure/resources/DocumentDB/PrivateEndpointConnection",id:"azure/resources/DocumentDB/PrivateEndpointConnection",isDocsHomePage:!1,title:"PrivateEndpointConnection",description:"Provides a PrivateEndpointConnection from the DocumentDB group",source:"@site/docs/azure/resources/DocumentDB/PrivateEndpointConnection.md",sourceDirName:"azure/resources/DocumentDB",slug:"/azure/resources/DocumentDB/PrivateEndpointConnection",permalink:"/docs/azure/resources/DocumentDB/PrivateEndpointConnection",tags:[],version:"current",frontMatter:{id:"PrivateEndpointConnection",title:"PrivateEndpointConnection"},sidebar:"docs",previous:{title:"NotebookWorkspace",permalink:"/docs/azure/resources/DocumentDB/NotebookWorkspace"},next:{title:"Service",permalink:"/docs/azure/resources/DocumentDB/Service"}},u=[{value:"Examples",id:"examples",children:[{value:"Approve or reject a private endpoint connection with a given name.",id:"approve-or-reject-a-private-endpoint-connection-with-a-given-name",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],d={toc:u};function l(e){var n=e.components,t=(0,o.Z)(e,c);return(0,i.kt)("wrapper",(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"PrivateEndpointConnection")," from the ",(0,i.kt)("strong",{parentName:"p"},"DocumentDB")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"approve-or-reject-a-private-endpoint-connection-with-a-given-name"},"Approve or reject a private endpoint connection with a given name."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PrivateEndpointConnection",\n    group: "DocumentDB",\n    name: "myPrivateEndpointConnection",\n    properties: () => ({\n      properties: {\n        privateLinkServiceConnectionState: {\n          status: "Approved",\n          description: "Approved by johndoe@contoso.com",\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      privateEndpoint: "myPrivateEndpoint",\n      account: "myDatabaseAccount",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/PrivateEndpoint"},"PrivateEndpoint")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/DocumentDB/DatabaseAccount"},"DatabaseAccount"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'A private endpoint connection',\n  type: 'object',\n  properties: {\n    properties: {\n      description: 'Resource properties.',\n      'x-ms-client-flatten': true,\n      type: 'object',\n      properties: {\n        privateEndpoint: {\n          description: 'Private endpoint which the connection belongs to.',\n          type: 'object',\n          properties: {\n            id: {\n              type: 'string',\n              description: 'Resource id of the private endpoint.'\n            }\n          }\n        },\n        privateLinkServiceConnectionState: {\n          description: 'Connection State of the Private Endpoint Connection.',\n          type: 'object',\n          properties: {\n            status: {\n              type: 'string',\n              description: 'The private link service connection status.'\n            },\n            description: {\n              type: 'string',\n              description: 'The private link service connection description.'\n            },\n            actionsRequired: {\n              type: 'string',\n              description: 'Any action that is required beyond basic workflow (approve/ reject/ disconnect)',\n              readOnly: true\n            }\n          }\n        },\n        groupId: {\n          type: 'string',\n          description: 'Group id of the private endpoint.'\n        },\n        provisioningState: {\n          type: 'string',\n          description: 'Provisioning state of the private endpoint.'\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      title: 'Proxy Resource',\n      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',\n      type: 'object',\n      allOf: [\n        {\n          title: 'Resource',\n          description: 'Common fields that are returned in the response for all Azure Resource Manager resources',\n          type: 'object',\n          properties: {\n            id: {\n              readOnly: true,\n              type: 'string',\n              description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'\n            },\n            name: {\n              readOnly: true,\n              type: 'string',\n              description: 'The name of the resource'\n            },\n            type: {\n              readOnly: true,\n              type: 'string',\n              description: 'The type of the resource. E.g. \"Microsoft.Compute/virtualMachines\" or \"Microsoft.Storage/storageAccounts\"'\n            }\n          },\n          'x-ms-azure-resource': true\n        }\n      ]\n    }\n  ]\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-02-15-preview"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview/privateEndpointConnection.json"},"here"),"."))}l.isMDXComponent=!0}}]);