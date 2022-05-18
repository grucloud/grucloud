"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8798],{3905:function(e,r,t){t.d(r,{Zo:function(){return c},kt:function(){return h}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function u(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var a=n.createContext({}),p=function(e){var r=n.useContext(a),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},c=function(e){var r=p(e.components);return n.createElement(a.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,i=e.originalType,a=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),d=p(t),h=o,m=d["".concat(a,".").concat(h)]||d[h]||l[h]||i;return t?n.createElement(m,s(s({ref:r},c),{},{components:t})):n.createElement(m,s({ref:r},c))}));function h(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var i=t.length,s=new Array(i);s[0]=d;var u={};for(var a in r)hasOwnProperty.call(r,a)&&(u[a]=r[a]);u.originalType=e,u.mdxType="string"==typeof e?e:o,s[1]=u;for(var p=2;p<i;p++)s[p]=t[p];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},52186:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return u},contentTitle:function(){return a},metadata:function(){return p},toc:function(){return c},default:function(){return d}});var n=t(87462),o=t(63366),i=(t(67294),t(3905)),s=["components"],u={id:"ExpressRoutePortAuthorization",title:"ExpressRoutePortAuthorization"},a=void 0,p={unversionedId:"azure/resources/Network/ExpressRoutePortAuthorization",id:"azure/resources/Network/ExpressRoutePortAuthorization",isDocsHomePage:!1,title:"ExpressRoutePortAuthorization",description:"Provides a ExpressRoutePortAuthorization from the Network group",source:"@site/docs/azure/resources/Network/ExpressRoutePortAuthorization.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/ExpressRoutePortAuthorization",permalink:"/docs/azure/resources/Network/ExpressRoutePortAuthorization",tags:[],version:"current",frontMatter:{id:"ExpressRoutePortAuthorization",title:"ExpressRoutePortAuthorization"},sidebar:"docs",previous:{title:"ExpressRouteGateway",permalink:"/docs/azure/resources/Network/ExpressRouteGateway"},next:{title:"FirewallPolicy",permalink:"/docs/azure/resources/Network/FirewallPolicy"}},c=[{value:"Examples",id:"examples",children:[{value:"Create ExpressRoutePort Authorization",id:"create-expressrouteport-authorization",children:[],level:3}],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:c};function d(e){var r=e.components,t=(0,o.Z)(e,s);return(0,i.kt)("wrapper",(0,n.Z)({},l,t,{components:r,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Provides a ",(0,i.kt)("strong",{parentName:"p"},"ExpressRoutePortAuthorization")," from the ",(0,i.kt)("strong",{parentName:"p"},"Network")," group"),(0,i.kt)("h2",{id:"examples"},"Examples"),(0,i.kt)("h3",{id:"create-expressrouteport-authorization"},"Create ExpressRoutePort Authorization"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ExpressRoutePortAuthorization",\n    group: "Network",\n    name: "myExpressRoutePortAuthorization",\n    properties: () => ({ properties: {} }),\n    dependencies: ({}) => ({\n      resourceGroup: "myResourceGroup",\n      expressRoutePort: "myExpressRoutePortAuthorization",\n    }),\n  },\n];\n\n')),(0,i.kt)("h2",{id:"dependencies"},"Dependencies"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/ExpressRoutePortAuthorization"},"ExpressRoutePortAuthorization"))),(0,i.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},"{\n  type: 'object',\n  title: 'ExpressRoute Port Authorization',\n  description: 'ExpressRoutePort Authorization resource definition.',\n  properties: {\n    properties: {\n      'x-ms-client-flatten': true,\n      description: 'ExpressRoutePort properties.',\n      type: 'object',\n      title: 'ExpressRoute Port Authorization Properties',\n      properties: {\n        authorizationKey: {\n          readOnly: true,\n          type: 'string',\n          description: 'The authorization key.'\n        },\n        authorizationUseStatus: {\n          readOnly: true,\n          type: 'string',\n          description: 'The authorization use status.',\n          enum: [ 'Available', 'InUse' ],\n          'x-ms-enum': {\n            name: 'ExpressRoutePortAuthorizationUseStatus',\n            modelAsString: true\n          }\n        },\n        circuitResourceUri: {\n          readOnly: true,\n          type: 'string',\n          description: 'The reference to the ExpressRoute circuit resource using the authorization.'\n        },\n        provisioningState: {\n          readOnly: true,\n          description: 'The provisioning state of the authorization resource.',\n          type: 'string',\n          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],\n          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }\n        }\n      }\n    },\n    name: {\n      type: 'string',\n      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'\n    },\n    etag: {\n      readOnly: true,\n      type: 'string',\n      description: 'A unique read-only string that changes whenever the resource is updated.'\n    },\n    type: {\n      readOnly: true,\n      type: 'string',\n      description: 'Type of the resource.'\n    }\n  },\n  allOf: [\n    {\n      properties: { id: { type: 'string', description: 'Resource ID.' } },\n      description: 'Reference to another subresource.',\n      'x-ms-azure-resource': true\n    }\n  ]\n}\n")),(0,i.kt)("h2",{id:"misc"},"Misc"),(0,i.kt)("p",null,"The resource version is ",(0,i.kt)("inlineCode",{parentName:"p"},"2021-08-01"),"."),(0,i.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/expressRoutePort.json"},"here"),"."))}d.isMDXComponent=!0}}]);