"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[73372],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return m}});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,c=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=p(n),m=i,y=d["".concat(c,".").concat(m)]||d[m]||l[m]||o;return n?r.createElement(y,s(s({ref:t},u),{},{components:n})):r.createElement(y,s({ref:t},u))}));function m(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,s=new Array(o);s[0]=d;var a={};for(var c in t)hasOwnProperty.call(t,c)&&(a[c]=t[c]);a.originalType=e,a.mdxType="string"==typeof e?e:i,s[1]=a;for(var p=2;p<o;p++)s[p]=n[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},11631:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var r=n(87462),i=n(63366),o=(n(67294),n(3905)),s=["components"],a={id:"SiteInstanceDeployment",title:"SiteInstanceDeployment"},c=void 0,p={unversionedId:"azure/resources/Web/SiteInstanceDeployment",id:"azure/resources/Web/SiteInstanceDeployment",isDocsHomePage:!1,title:"SiteInstanceDeployment",description:"Provides a SiteInstanceDeployment from the Web group",source:"@site/docs/azure/resources/Web/SiteInstanceDeployment.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/SiteInstanceDeployment",permalink:"/docs/azure/resources/Web/SiteInstanceDeployment",tags:[],version:"current",frontMatter:{id:"SiteInstanceDeployment",title:"SiteInstanceDeployment"},sidebar:"docs",previous:{title:"SiteHostNameBindingSlot",permalink:"/docs/azure/resources/Web/SiteHostNameBindingSlot"},next:{title:"SiteInstanceDeploymentSlot",permalink:"/docs/azure/resources/Web/SiteInstanceDeploymentSlot"}},u=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:u};function d(e){var t=e.components,n=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"SiteInstanceDeployment")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Compute/CloudServiceRoleInstance"},"CloudServiceRoleInstance"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Represents user credentials used for publishing activity',\n  type: 'object',\n  allOf: [\n    {\n      required: [ 'location' ],\n      properties: {\n        id: { description: 'Resource Id', type: 'string' },\n        name: { description: 'Resource Name', type: 'string' },\n        kind: { description: 'Kind of resource', type: 'string' },\n        location: { description: 'Resource Location', type: 'string' },\n        type: { description: 'Resource type', type: 'string' },\n        tags: {\n          description: 'Resource tags',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      properties: {\n        id: { description: 'Id', type: 'string' },\n        status: { format: 'int32', description: 'Status', type: 'integer' },\n        message: { description: 'Message', type: 'string' },\n        author: { description: 'Author', type: 'string' },\n        deployer: { description: 'Deployer', type: 'string' },\n        author_email: { description: 'AuthorEmail', type: 'string' },\n        start_time: {\n          format: 'date-time',\n          description: 'StartTime',\n          type: 'string'\n        },\n        end_time: { format: 'date-time', description: 'EndTime', type: 'string' },\n        active: { description: 'Active', type: 'boolean' },\n        details: { description: 'Detail', type: 'string' }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2015-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json"},"here"),"."))}d.isMDXComponent=!0}}]);