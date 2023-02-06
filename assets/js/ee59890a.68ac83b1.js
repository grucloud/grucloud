"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[42597],{3905:(e,r,n)=>{n.d(r,{Zo:()=>p,kt:()=>y});var t=n(67294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function i(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function s(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=t.createContext({}),u=function(e){var r=t.useContext(c),n=r;return e&&(n="function"==typeof e?e(r):i(i({},r),e)),n},p=function(e){var r=u(e.components);return t.createElement(c.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=u(n),y=a,m=d["".concat(c,".").concat(y)]||d[y]||l[y]||o;return n?t.createElement(m,i(i({ref:r},p),{},{components:n})):t.createElement(m,i({ref:r},p))}));function y(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=d;var s={};for(var c in r)hasOwnProperty.call(r,c)&&(s[c]=r[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var u=2;u<o;u++)i[u]=n[u];return t.createElement.apply(null,i)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},70186:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>l,frontMatter:()=>o,metadata:()=>s,toc:()=>u});var t=n(87462),a=(n(67294),n(3905));const o={id:"QueryPack",title:"QueryPack"},i=void 0,s={unversionedId:"azure/resources/OperationalInsights/QueryPack",id:"azure/resources/OperationalInsights/QueryPack",title:"QueryPack",description:"Provides a QueryPack from the OperationalInsights group",source:"@site/docs/azure/resources/OperationalInsights/QueryPack.md",sourceDirName:"azure/resources/OperationalInsights",slug:"/azure/resources/OperationalInsights/QueryPack",permalink:"/docs/azure/resources/OperationalInsights/QueryPack",draft:!1,tags:[],version:"current",frontMatter:{id:"QueryPack",title:"QueryPack"},sidebar:"docs",previous:{title:"Query",permalink:"/docs/azure/resources/OperationalInsights/Query"},next:{title:"SavedSearch",permalink:"/docs/azure/resources/OperationalInsights/SavedSearch"}},c={},u=[{value:"Examples",id:"examples",level:2},{value:"QueryPackCreate",id:"querypackcreate",level:3},{value:"QueryPackUpdate",id:"querypackupdate",level:3},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],p={toc:u};function l(e){let{components:r,...n}=e;return(0,a.kt)("wrapper",(0,t.Z)({},p,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides a ",(0,a.kt)("strong",{parentName:"p"},"QueryPack")," from the ",(0,a.kt)("strong",{parentName:"p"},"OperationalInsights")," group"),(0,a.kt)("h2",{id:"examples"},"Examples"),(0,a.kt)("h3",{id:"querypackcreate"},"QueryPackCreate"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "QueryPack",\n    group: "OperationalInsights",\n    name: "myQueryPack",\n    properties: () => ({ location: "South Central US", properties: {} }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,a.kt)("h3",{id:"querypackupdate"},"QueryPackUpdate"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "QueryPack",\n    group: "OperationalInsights",\n    name: "myQueryPack",\n    properties: () => ({\n      location: "South Central US",\n      tags: { Tag1: "Value1" },\n      properties: {},\n    }),\n    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),\n  },\n];\n\n')),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,a.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-json"},"{\n  type: 'object',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties that define a Log Analytics QueryPack resource.',\n      type: 'object',\n      properties: {\n        queryPackId: {\n          type: 'string',\n          description: 'The unique ID of your application. This field cannot be changed.',\n          readOnly: true\n        },\n        timeCreated: {\n          type: 'string',\n          readOnly: true,\n          description: 'Creation Date for the Log Analytics QueryPack, in ISO 8601 format.',\n          format: 'date-time'\n        },\n        timeModified: {\n          type: 'string',\n          readOnly: true,\n          description: 'Last modified date of the Log Analytics QueryPack, in ISO 8601 format.',\n          format: 'date-time'\n        },\n        provisioningState: {\n          type: 'string',\n          description: 'Current state of this QueryPack: whether or not is has been provisioned within the resource group it is defined. Users cannot change this value but are able to read from it. Values will include Succeeded, Deploying, Canceled, and Failed.',\n          readOnly: true\n        }\n      }\n    }\n  },\n  allOf: [\n    {\n      type: 'object',\n      properties: {\n        id: {\n          type: 'string',\n          readOnly: true,\n          description: 'Azure resource Id'\n        },\n        name: {\n          type: 'string',\n          description: 'Azure resource name',\n          readOnly: true\n        },\n        type: {\n          type: 'string',\n          readOnly: true,\n          description: 'Azure resource type'\n        },\n        location: {\n          type: 'string',\n          description: 'Resource location',\n          'x-ms-mutability': [ 'create', 'read' ]\n        },\n        tags: {\n          type: 'object',\n          additionalProperties: { type: 'string' },\n          description: 'Resource tags'\n        }\n      },\n      required: [ 'location' ],\n      'x-ms-azure-resource': true,\n      description: 'An azure resource object'\n    }\n  ],\n  required: [ 'properties' ],\n  description: 'An Log Analytics QueryPack definition.'\n}\n")),(0,a.kt)("h2",{id:"misc"},"Misc"),(0,a.kt)("p",null,"The resource version is ",(0,a.kt)("inlineCode",{parentName:"p"},"2019-09-01"),"."),(0,a.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,a.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2019-09-01/QueryPacks.json"},"here"),"."))}l.isMDXComponent=!0}}]);