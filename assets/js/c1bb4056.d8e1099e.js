"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[39396],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>m});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function u(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?u(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function a(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},u=Object.keys(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)t=u[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var s=n.createContext({}),c=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},p=function(e){var r=c(e.components);return n.createElement(s.Provider,{value:r},e.children)},l={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,u=e.originalType,s=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),d=c(t),m=o,y=d["".concat(s,".").concat(m)]||d[m]||l[m]||u;return t?n.createElement(y,i(i({ref:r},p),{},{components:t})):n.createElement(y,i({ref:r},p))}));function m(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var u=t.length,i=new Array(u);i[0]=d;var a={};for(var s in r)hasOwnProperty.call(r,s)&&(a[s]=r[s]);a.originalType=e,a.mdxType="string"==typeof e?e:o,i[1]=a;for(var c=2;c<u;c++)i[c]=t[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},28559:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>s,contentTitle:()=>i,default:()=>l,frontMatter:()=>u,metadata:()=>a,toc:()=>c});var n=t(87462),o=(t(67294),t(3905));const u={id:"SecurityGroup",title:"Security Group"},i=void 0,a={unversionedId:"azure/resources/Network/SecurityGroup",id:"azure/resources/Network/SecurityGroup",title:"Security Group",description:"Provides a Security Group:",source:"@site/docs/azure/resources/Network/SecurityGroup.md",sourceDirName:"azure/resources/Network",slug:"/azure/resources/Network/SecurityGroup",permalink:"/docs/azure/resources/Network/SecurityGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"SecurityGroup",title:"Security Group"},sidebar:"docs",previous:{title:"RoutingIntent",permalink:"/docs/azure/resources/Network/RoutingIntent"},next:{title:"SecurityPartnerProvider",permalink:"/docs/azure/resources/Network/SecurityPartnerProvider"}},s={},c=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3}],p={toc:c};function l(e){let{components:r,...t}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a Security Group:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const sg = provider.makeSecurityGroup({\n  name: `security-group`,\n  dependencies: { resourceGroup },\n  properties: () => ({\n    properties: {\n      securityRules: [\n        {\n          name: "SSH",\n          properties: {\n            access: "Allow",\n            direction: "Inbound",\n            protocol: "Tcp",\n            destinationPortRange: "22",\n            destinationAddressPrefix: "*",\n            sourcePortRange: "*",\n            sourceAddressPrefix: "*",\n            priority: 1000,\n          },\n        },\n        {\n          name: "ICMP",\n          properties: {\n            access: "Allow",\n            direction: "Inbound",\n            protocol: "Icmp",\n            destinationAddressPrefix: "*",\n            destinationPortRange: "*",\n            sourceAddressPrefix: "*",\n            sourcePortRange: "*",\n            priority: 1001,\n          },\n        },\n      ],\n    },\n  }),\n});\n')),(0,o.kt)("h3",{id:"examples"},"Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/azure/Compute/vm/resources.js"},"basic example"))),(0,o.kt)("h3",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.microsoft.com/en-us/rest/api/virtualnetwork/networksecuritygroups/createorupdate#request-body"},"all properties"))),(0,o.kt)("h3",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Resources/ResourceGroup"},"ResourceGroup"))),(0,o.kt)("h3",{id:"used-by"},"Used By"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/azure/resources/Network/NetworkInterface"},"NetworkInterface"))))}l.isMDXComponent=!0}}]);