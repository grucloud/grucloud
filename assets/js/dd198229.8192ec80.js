"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3578],{3905:function(e,r,t){t.d(r,{Zo:function(){return c},kt:function(){return d}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function u(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function s(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var l=n.createContext({}),a=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):u(u({},r),e)),t},c=function(e){var r=a(e.components);return n.createElement(l.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),m=a(t),d=o,f=m["".concat(l,".").concat(d)]||m[d]||p[d]||i;return t?n.createElement(f,u(u({ref:r},c),{},{components:t})):n.createElement(f,u({ref:r},c))}));function d(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=t.length,u=new Array(i);u[0]=m;var s={};for(var l in r)hasOwnProperty.call(r,l)&&(s[l]=r[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,u[1]=s;for(var a=2;a<i;a++)u[a]=t[a];return n.createElement.apply(null,u)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},34045:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return a},toc:function(){return c},default:function(){return m}});var n=t(87462),o=t(63366),i=(t(67294),t(3905)),u=["components"],s={id:"RouteFilterRule",title:"RouteFilterRule"},l=void 0,a={unversionedId:"azure/resources/Network/RouteFilterRule",id:"azure/resources/Network/RouteFilterRule",isDocsHomePage:!1,title:"RouteFilterRule",description:"Provides a RouteFilterRule from the Network group",source:"@site/docs/azure/resources/Network/RouteFilterRule.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/RouteFilterRule",permalink:"/docs/azure/resources/Network/RouteFilterRule",tags:[],version:"current",frontMatter:{id:"RouteFilterRule",title:"RouteFilterRule"},sidebar:"docs",previous:{title:"RouteFilter",permalink:"/docs/azure/resources/Network/RouteFilter"},next:{title:"RouteTable",permalink:"/docs/azure/resources/Network/RouteTable"}},c=[{value:"Examples",id:"examples",children:[{value:"RouteFilterRuleCreate",id:"routefilterrulecreate",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],p={toc:c};function m(e){var r=e.components,t=(0,o.Z)(e,u);return(0,i.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"RouteFilterRule")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"routefilterrulecreate"},"RouteFilterRuleCreate"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "RouteFilterRule",\n    group: "Network",\n    name: "myRouteFilterRule",\n    properties: () => ({\n      properties: {\n        access: "Allow",\n        routeFilterRuleType: "Community",\n        communities: ["12076:5030", "12076:5040"],\n      },\n    }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      routeFilter: "myRouteFilter",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/RouteFilter"},"RouteFilter"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'Properties of the route filter rule.',\n      required: [ 'access', 'routeFilterRuleType', 'communities' ],\n      properties: {\n        access: {\n          description: 'The access type of the rule.',\n          type: 'string',\n          enum: [ 'Allow', 'Deny' ],\n          'x-ms-enum': { name: 'Access', modelAsString: true }\n        },\n        routeFilterRuleType: {\n          type: 'string',\n          description: 'The rule type of the rule.',\n          enum: [ 'Community' ],\n          'x-ms-enum': { name: 'RouteFilterRuleType', modelAsString: true }\n        },\n        communities: {\n          type: 'array',\n          items: { type: 'string' },\n          description: \"The collection for bgp community values to filter on. e.g. ['12076:5010','12076:5020'].\"\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the route filter rule resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    location: { type: 'string', description: 'Resource location.' },\n    etag: {\n      type: 'string',\n      readOnly: true,\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ],\n  description: 'Route Filter Rule Resource.'\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/routeFilter.json"},"here"),"."))}m.isMDXComponent=!0}}]);