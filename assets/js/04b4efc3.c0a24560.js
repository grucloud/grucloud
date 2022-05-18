"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7593],{3905:function(e,n,r){r.d(n,{Zo:function(){return p},kt:function(){return g}});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function i(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?i(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function s(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},i=Object.keys(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)r=i[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=t.createContext({}),l=function(e){var n=t.useContext(c),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},p=function(e){var n=l(e.components);return t.createElement(c.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=l(r),g=o,f=d["".concat(c,".").concat(g)]||d[g]||u[g]||i;return r?t.createElement(f,a(a({ref:n},p),{},{components:r})):t.createElement(f,a({ref:n},p))}));function g(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=d;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var l=2;l<i;l++)a[l]=r[l];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},46922:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return l},toc:function(){return p},default:function(){return d}});var t=r(87462),o=r(63366),i=(r(67294),r(3905)),a=["components"],s={id:"FlowLog",title:"FlowLog"},c=void 0,l={unversionedId:"azure/resources/Network/FlowLog",id:"azure/resources/Network/FlowLog",isDocsHomePage:!1,title:"FlowLog",description:"Provides a FlowLog from the Network group",source:"@site/docs/azure/resources/Network/FlowLog.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/FlowLog",permalink:"/docs/azure/resources/Network/FlowLog",tags:[],version:"current",frontMatter:{id:"FlowLog",title:"FlowLog"},sidebar:"docs",previous:{title:"FirewallPolicyRuleGroup",permalink:"/docs/azure/resources/Network/FirewallPolicyRuleGroup"},next:{title:"HubRouteTable",permalink:"/docs/azure/resources/Network/HubRouteTable"}},p=[{value:"Examples",id:"examples",children:[{value:"Create or update flow log",id:"create-or-update-flow-log",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],u={toc:p};function d(e){var n=e.components,r=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,t.Z)({},u,r,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"FlowLog")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-or-update-flow-log"},"Create or update flow log"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "FlowLog",\n    group: "Network",\n    name: "myFlowLog",\n    properties: () => ({\n      location: "centraluseuap",\n      properties: {\n        targetResourceId:\n          "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/networkSecurityGroups/desmondcentral-nsg",\n        storageId:\n          "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Storage/storageAccounts/nwtest1mgvbfmqsigdxe",\n        enabled: true,\n        format: { type: "JSON", version: 1 },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      workspace: "myWorkspace",\n      networkWatcher: "myNetworkWatcher",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/OperationalInsights/Workspace"},"Workspace")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/NetworkWatcher"},"NetworkWatcher"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the flow log.',\n      required: [ 'targetResourceId', 'storageId' ],\n      properties: {\n        targetResourceId: {\n          description: 'ID of network security group to which flow log will be applied.',\n          type: 'string'\n        },\n        targetResourceGuid: {\n          readOnly: true,\n          description: 'Guid of network security group to which flow log will be applied.',\n          type: 'string'\n        },\n        storageId: {\n          description: 'ID of the storage account which is used to store the flow log.',\n          type: 'string'\n        },\n        enabled: {\n          description: 'Flag to enable/disable flow logging.',\n          type: 'boolean'\n        },\n        retentionPolicy: {\n          description: 'Parameters that define the retention policy for flow log.',\n          properties: {\n            days: {\n              description: 'Number of days to retain flow log records.',\n              type: 'integer',\n              format: 'int32',\n              default: 0\n            },\n            enabled: {\n              description: 'Flag to enable/disable retention.',\n              type: 'boolean',\n              default: false\n            }\n          }\n        },\n        format: {\n          description: 'Parameters that define the flow log format.',\n          properties: {\n            type: {\n              type: 'string',\n              description: 'The file type of flow log.',\n              enum: [ 'JSON' ],\n              'x-ms-enum': { name: 'FlowLogFormatType', modelAsString: true }\n            },\n            version: {\n              description: 'The version (revision) of the flow log.',\n              type: 'integer',\n              format: 'int32',\n              default: 0\n            }\n          }\n        },\n        flowAnalyticsConfiguration: {\n          description: 'Parameters that define the configuration of traffic analytics.',\n          properties: {\n            networkWatcherFlowAnalyticsConfiguration: {\n              description: 'Parameters that define the configuration of traffic analytics.',\n              properties: {\n                enabled: {\n                  description: 'Flag to enable/disable traffic analytics.',\n                  type: 'boolean'\n                },\n                workspaceId: {\n                  description: 'The resource guid of the attached workspace.',\n                  type: 'string'\n                },\n                workspaceRegion: {\n                  description: 'The location of the attached workspace.',\n                  type: 'string'\n                },\n                workspaceResourceId: {\n                  description: 'Resource Id of the attached workspace.',\n                  type: 'string'\n                },\n                trafficAnalyticsInterval: {\n                  description: 'The interval in minutes which would decide how frequently TA service should do flow analytics.',\n                  type: 'integer',\n                  format: 'int32'\n                }\n              }\n            }\n          }\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the flow log.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    etag: {\n      readOnly: true,\n      type: 'string',\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'A flow log resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/networkWatcher.json"},"here"),"."))}d.isMDXComponent=!0}}]);