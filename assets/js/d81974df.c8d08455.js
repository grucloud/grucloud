"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[23959],{3905:(e,n,t)=>{t.d(n,{Zo:()=>u,kt:()=>y});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function s(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var p=r.createContext({}),c=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):s(s({},n),e)),t},u=function(e){var n=c(e.components);return r.createElement(p.Provider,{value:n},e.children)},l={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,i=e.originalType,p=e.parentName,u=a(e,["components","mdxType","originalType","parentName"]),d=c(t),y=o,b=d["".concat(p,".").concat(y)]||d[y]||l[y]||i;return t?r.createElement(b,s(s({ref:n},u),{},{components:t})):r.createElement(b,s({ref:n},u))}));function y(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var i=t.length,s=new Array(i);s[0]=d;var a={};for(var p in n)hasOwnProperty.call(n,p)&&(a[p]=n[p]);a.originalType=e,a.mdxType="string"==typeof e?e:o,s[1]=a;for(var c=2;c<i;c++)s[c]=t[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},36778:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>s,default:()=>l,frontMatter:()=>i,metadata:()=>a,toc:()=>c});var r=t(87462),o=(t(67294),t(3905));const i={id:"WebAppVnetConnection",title:"WebAppVnetConnection"},s=void 0,a={unversionedId:"azure/resources/Web/WebAppVnetConnection",id:"azure/resources/Web/WebAppVnetConnection",title:"WebAppVnetConnection",description:"Provides a WebAppVnetConnection from the Web group",source:"@site/docs/azure/resources/Web/WebAppVnetConnection.md",sourceDirName:"azure/resources/Web",slug:"/azure/resources/Web/WebAppVnetConnection",permalink:"/docs/azure/resources/Web/WebAppVnetConnection",draft:!1,tags:[],version:"current",frontMatter:{id:"WebAppVnetConnection",title:"WebAppVnetConnection"},sidebar:"docs",previous:{title:"WebAppTriggeredWebJobSlot",permalink:"/docs/azure/resources/Web/WebAppTriggeredWebJobSlot"},next:{title:"WebAppVnetConnectionSlot",permalink:"/docs/azure/resources/Web/WebAppVnetConnectionSlot"}},p={},c=[{value:"Examples",id:"examples",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Swagger Schema",id:"swagger-schema",level:2},{value:"Misc",id:"misc",level:2}],u={toc:c};function l(e){let{components:n,...t}=e;return(0,o.kt)("wrapper",(0,r.Z)({},u,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a ",(0,o.kt)("strong",{parentName:"p"},"WebAppVnetConnection")," from the ",(0,o.kt)("strong",{parentName:"p"},"Web")," group"),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Web/WebApp"},"WebApp"))),(0,o.kt)("h2",{id:"swagger-schema"},"Swagger Schema"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"{\n  description: 'Virtual Network information ARM resource.',\n  type: 'object',\n  allOf: [\n    {\n      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n      type: 'object',\n      properties: {\n        id: { description: 'Resource Id.', type: 'string', readOnly: true },\n        name: {\n          description: 'Resource Name.',\n          type: 'string',\n          readOnly: true\n        },\n        kind: { description: 'Kind of resource.', type: 'string' },\n        type: {\n          description: 'Resource type.',\n          type: 'string',\n          readOnly: true\n        }\n      },\n      'x-ms-azure-resource': true\n    }\n  ],\n  properties: {\n    properties: {\n      description: 'Core resource properties',\n      type: 'object',\n      'x-ms-client-flatten': true,\n      properties: {\n        vnetResourceId: {\n          description: \"The Virtual Network's resource ID.\",\n          type: 'string'\n        },\n        certThumbprint: {\n          description: 'The client certificate thumbprint.',\n          type: 'string',\n          readOnly: true\n        },\n        certBlob: {\n          description: 'A certificate file (.cer) blob containing the public key of the private key used to authenticate a \\n' +\n            'Point-To-Site VPN connection.',\n          type: 'string'\n        },\n        routes: {\n          description: 'The routes that this Virtual Network connection uses.',\n          type: 'array',\n          items: {\n            description: 'Virtual Network route contract used to pass routing information for a Virtual Network.',\n            type: 'object',\n            allOf: [\n              {\n                description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',\n                type: 'object',\n                properties: {\n                  id: {\n                    description: 'Resource Id.',\n                    type: 'string',\n                    readOnly: true\n                  },\n                  name: {\n                    description: 'Resource Name.',\n                    type: 'string',\n                    readOnly: true\n                  },\n                  kind: { description: 'Kind of resource.', type: 'string' },\n                  type: {\n                    description: 'Resource type.',\n                    type: 'string',\n                    readOnly: true\n                  }\n                },\n                'x-ms-azure-resource': true\n              }\n            ],\n            properties: {\n              properties: {\n                description: 'VnetRoute resource specific properties',\n                type: 'object',\n                properties: {\n                  startAddress: {\n                    description: 'The starting address for this route. This may also include a CIDR notation, in which case the end address must not be specified.',\n                    type: 'string'\n                  },\n                  endAddress: {\n                    description: 'The ending address for this route. If the start address is specified in CIDR notation, this must be omitted.',\n                    type: 'string'\n                  },\n                  routeType: {\n                    description: 'The type of route this is:\\n' +\n                      'DEFAULT - By default, every app has routes to the local address ranges specified by RFC1918\\n' +\n                      'INHERITED - Routes inherited from the real Virtual Network routes\\n' +\n                      'STATIC - Static route set on the app only\\n' +\n                      '\\n' +\n                      \"These values will be used for syncing an app's routes with those from a Virtual Network.\",\n                    enum: [ 'DEFAULT', 'INHERITED', 'STATIC' ],\n                    type: 'string',\n                    'x-ms-enum': { name: 'RouteType', modelAsString: true }\n                  }\n                },\n                'x-ms-client-flatten': true\n              }\n            }\n          },\n          readOnly: true\n        },\n        resyncRequired: {\n          description: '<code>true</code> if a resync is required; otherwise, <code>false</code>.',\n          type: 'boolean',\n          readOnly: true\n        },\n        dnsServers: {\n          description: 'DNS servers to be used by this Virtual Network. This should be a comma-separated list of IP addresses.',\n          type: 'string'\n        },\n        isSwift: {\n          description: 'Flag that is used to denote if this is VNET injection',\n          type: 'boolean'\n        }\n      }\n    }\n  }\n}\n")),(0,o.kt)("h2",{id:"misc"},"Misc"),(0,o.kt)("p",null,"The resource version is ",(0,o.kt)("inlineCode",{parentName:"p"},"2021-03-01"),"."),(0,o.kt)("p",null,"The Swagger schema used to generate this documentation can be found ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json"},"here"),"."))}l.isMDXComponent=!0}}]);