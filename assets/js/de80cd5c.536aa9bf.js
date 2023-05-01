"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[16090],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>y});var n=t(67294);function i(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){i(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,i=function(e,r){if(null==e)return{};var t,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(i[t]=e[t]);return i}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var c=n.createContext({}),u=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},p=function(e){var r=u(e.components);return n.createElement(c.Provider,{value:r},e.children)},l="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),l=u(t),m=i,y=l["".concat(c,".").concat(m)]||l[m]||d[m]||o;return t?n.createElement(y,a(a({ref:r},p),{},{components:t})):n.createElement(y,a({ref:r},p))}));function y(e,r){var t=arguments,i=r&&r.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=m;var s={};for(var c in r)hasOwnProperty.call(r,c)&&(s[c]=r[c]);s.originalType=e,s[l]="string"==typeof e?e:i,a[1]=s;for(var u=2;u<o;u++)a[u]=t[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},88631:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>u});var n=t(87462),i=(t(67294),t(3905));const o={id:"SecurityPartnerProvider",title:"SecurityPartnerProvider"},a=void 0,s={unversionedId:"azure/resources/Network/SecurityPartnerProvider",id:"azure/resources/Network/SecurityPartnerProvider",title:"SecurityPartnerProvider",description:"Provides a SecurityPartnerProvider from the Network group",source:"@site/docs/azure/resources/Network/SecurityPartnerProvider.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/SecurityPartnerProvider",permalink:"/docs/azure/resources/Network/SecurityPartnerProvider",draft:!1,tags:[],version:"current",frontMatter:{id:"SecurityPartnerProvider",title:"SecurityPartnerProvider"},sidebar:"docs",previous:{title:"Security Group",permalink:"/docs/azure/resources/Network/SecurityGroup"},next:{title:"ServiceEndpointPolicy",permalink:"/docs/azure/resources/Network/ServiceEndpointPolicy"}},c={},u=[{value:"Examples",id:"examples",level:2},{value:"Create Security Partner Provider",id:"create-security-partner-provider",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:u},l="wrapper";function d(e){let{components:r,...t}=e;return(0,i.kt)(l,(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"SecurityPartnerProvider")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-security-partner-provider"},"Create Security Partner Provider"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "SecurityPartnerProvider",\n    group: "Network",\n    name: "mySecurityPartnerProvider",\n    properties: () => ({\n      tags: { key1: "value1" },\n      location: "West US",\n      properties: {\n        securityProviderName: "ZScaler",\n        virtualHub: {\n          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1",\n        },\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      virtualHub: "myVirtualHub",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/VirtualHub"},"VirtualHub"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-json"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the Security Partner Provider.',\n      properties: {\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the Security Partner Provider resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        },\n        securityProviderName: {\n          description: 'The security provider name.',\n          type: 'string',\n          enum: [ 'ZScaler', 'IBoss', 'Checkpoint' ],\n          'x-ms-enum': { name: 'SecurityProviderName', modelAsString: true }\n        },\n        connectionStatus: {\n          readOnly: true,\n          description: 'The connection status with the Security Partner Provider.',\n          type: 'string',\n          enum: [\n            'Unknown',\n            'PartiallyConnected',\n            'Connected',\n            'NotConnected'\n          ],\n          'x-ms-enum': {\n            name: 'SecurityPartnerProviderConnectionStatus',\n            modelAsString: true\n          }\n        },\n        virtualHub: {\n          description: 'The virtualHub to which the Security Partner Provider belongs.',\n          properties: { id: { type: 'string', description: 'Resource ID.' } },\n          'x-ms-azure-resource': true\n        }\n      }\n    },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: {\n        id: { type: 'string', description: 'Resource ID.' },\n        name: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource name.'\n        },\n        type: {\n          readOnly: true,\n          type: 'string',\n          description: 'Resource type.'\n        },\n        location: { type: 'string', description: 'Resource location.' },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags.'\n        }\n      },\n      description: 'Common resource representation.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Security Partner Provider resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2022-01-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/securityPartnerProvider.json"},"here"),"."))}d.isMDXComponent=!0}}]);