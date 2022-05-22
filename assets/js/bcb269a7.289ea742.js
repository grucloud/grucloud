"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[64072],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return f}});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var a=r.createContext({}),p=function(e){var t=r.useContext(a),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(a.Provider,{value:t},e.children)},l={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),d=p(n),f=i,m=d["".concat(a,".").concat(f)]||d[f]||l[f]||o;return n?r.createElement(m,s(s({ref:t},u),{},{components:n})):r.createElement(m,s({ref:t},u))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,s=new Array(o);s[0]=d;var c={};for(var a in t)hasOwnProperty.call(t,a)&&(c[a]=t[a]);c.originalType=e,c.mdxType="string"==typeof e?e:i,s[1]=c;for(var p=2;p<o;p++)s[p]=n[p];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},59227:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return a},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var r=n(87462),i=n(63366),o=(n(67294),n(3905)),s=["components"],c={id:"SiteVNETConnectionSlot",title:"SiteVNETConnectionSlot"},a=void 0,p={unversionedId:"azure/resources/Web/SiteVNETConnectionSlot",id:"azure/resources/Web/SiteVNETConnectionSlot",isDocsHomePage:!1,title:"SiteVNETConnectionSlot",description:"Provides a SiteVNETConnectionSlot from the Web group",source:"@site/docs/azure/resources/Web/SiteVNETConnectionSlot.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/SiteVNETConnectionSlot",permalink:"/docs/azure/resources/Web/SiteVNETConnectionSlot",tags:[],version:"current",frontMatter:{id:"SiteVNETConnectionSlot",title:"SiteVNETConnectionSlot"},sidebar:"docs",previous:{title:"SiteVNETConnection",permalink:"/docs/azure/resources/Web/SiteVNETConnection"},next:{title:"StaticSite",permalink:"/docs/azure/resources/Web/StaticSite"}},u=[{value:"Examples",id:"examples",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"Swagger Schema",id:"swagger-schema",children:[],level:2},{value:"Misc",id:"misc",children:[],level:2}],l={toc:u};function d(e){var t=e.components,n=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,r.Z)({},l,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"SiteVNETConnectionSlot")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/Site"},"Site")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/SiteSlot"},"SiteSlot"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'VNETInfo contract. This contract is public and is a stripped down version of VNETInfoInternal',\n  type: 'object',\n  allOf: [\n    {\n      required: [ 'location' ],\n      properties: {\n        id: { description: 'Resource Id', type: 'string' },\n        name: { description: 'Resource Name', type: 'string' },\n        kind: { description: 'Kind of resource', type: 'string' },\n        location: { description: 'Resource Location', type: 'string' },\n        type: { description: 'Resource type', type: 'string' },\n        tags: {\n          description: 'Resource tags',\n          type: 'object',\n          additionalProperties: { type: 'string' }\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      properties: {\n        vnetResourceId: { description: 'The vnet resource id', type: 'string' },\n        certThumbprint: {\n          description: 'The client certificate thumbprint',\n          type: 'string'\n        },\n        certBlob: {\n          description: 'A certificate file (.cer) blob containing the public key of the private key used to authenticate a \\r\\n' +\n            '            Point-To-Site VPN connection.',\n          type: 'string'\n        },\n        routes: {\n          description: 'The routes that this virtual network connection uses.',\n          type: 'array',\n          items: {\n            description: 'VnetRoute contract used to pass routing information for a vnet.',\n            type: 'object',\n            allOf: [\n              {\n                required: [ 'location' ],\n                properties: {\n                  id: { description: 'Resource Id', type: 'string' },\n                  name: { description: 'Resource Name', type: 'string' },\n                  kind: { description: 'Kind of resource', type: 'string' },\n                  location: { description: 'Resource Location', type: 'string' },\n                  type: { description: 'Resource type', type: 'string' },\n                  tags: {\n                    description: 'Resource tags',\n                    type: 'object',\n                    additionalProperties: { type: 'string' }\n                  }\n                },\n                'x-ms-azure-resource': true\n              }\n            ],\n            properties: {\n              properties: {\n                properties: {\n                  name: {\n                    description: 'The name of this route. This is only returned by the server and does not need to be set by the client.',\n                    type: 'string'\n                  },\n                  startAddress: {\n                    description: 'The starting address for this route. This may also include a CIDR notation, in which case the end address must not be specified.',\n                    type: 'string'\n                  },\n                  endAddress: {\n                    description: 'The ending address for this route. If the start address is specified in CIDR notation, this must be omitted.',\n                    type: 'string'\n                  },\n                  routeType: {\n                    description: 'The type of route this is:\\r\\n' +\n                      '            DEFAULT - By default, every web app has routes to the local address ranges specified by RFC1918\\r\\n' +\n                      '            INHERITED - Routes inherited from the real Virtual Network routes\\r\\n' +\n                      '            STATIC - Static route set on the web app only\\r\\n' +\n                      '            \\r\\n' +\n                      \"            These values will be used for syncing a Web App's routes with those from a Virtual Network. This operation will clear all DEFAULT and INHERITED routes and replace them\\r\\n\" +\n                      '            with new INHERITED routes.',\n                    type: 'string'\n                  }\n                },\n                'x-ms-client-flatten': true\n              }\n            }\n          }\n        },\n        resyncRequired: {\n          description: 'Flag to determine if a resync is required',\n          type: 'boolean'\n        },\n        dnsServers: {\n          description: 'Dns servers to be used by this VNET. This should be a comma-separated list of IP addresses.',\n          type: 'string'\n        }\n      },\n      'x-ms-client-flatten': true\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2015-08-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json"},"here"),"."))}d.isMDXComponent=!0}}]);