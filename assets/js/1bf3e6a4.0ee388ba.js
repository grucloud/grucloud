"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2526],{3905:function(e,r,t){t.d(r,{Zo:function(){return u},kt:function(){return f}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function l(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?l(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},l=Object.keys(e);for(n=0;n<l.length;n++)t=l[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)t=l[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),p=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},u=function(e){var r=p(e.components);return n.createElement(c.Provider,{value:r},e.children)},s={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,l=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=p(t),f=o,d=m["".concat(c,".").concat(f)]||m[f]||s[f]||l;return t?n.createElement(d,a(a({ref:r},u),{},{components:t})):n.createElement(d,a({ref:r},u))}));function f(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var l=t.length,a=new Array(l);a[0]=m;var i={};for(var c in r)hasOwnProperty.call(r,c)&&(i[c]=r[c]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var p=2;p<l;p++)a[p]=t[p];return n.createElement.apply(null,a)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},10742:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return i},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return u},default:function(){return m}});var n=t(87462),o=t(63366),l=(t(67294),t(3905)),a=["components"],i={id:"Firewall",title:"Firewall"},c=void 0,p={unversionedId:"google/resources/Compute/Firewall",id:"google/resources/Compute/Firewall",isDocsHomePage:!1,title:"Firewall",description:"Manages a Firewall",source:"@site/docs/google/resources/Compute/Firewall.md",sourceDirName:"google/resources/Compute",slug:"/google/resources/Compute/Firewall",permalink:"/docs/google/resources/Compute/Firewall",tags:[],version:"current",frontMatter:{id:"Firewall",title:"Firewall"},sidebar:"docs",previous:{title:"Disk",permalink:"/docs/google/resources/Compute/Disk"},next:{title:"Global Forwarding Rule",permalink:"/docs/google/resources/Compute/GlobalForwardingRule"}},u=[{value:"Examples",id:"examples",children:[],level:3},{value:"Properties",id:"properties",children:[],level:3},{value:"Dependencies",id:"dependencies",children:[],level:3}],s={toc:u};function m(e){var r=e.components,t=(0,o.Z)(e,a);return(0,l.kt)("wrapper",(0,n.Z)({},s,t,{components:r,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Manages a ",(0,l.kt)("a",{parentName:"p",href:"https://cloud.google.com/vpc/docs/firewalls"},"Firewall")),(0,l.kt)("p",null,"Allow ingress traffic from anywhere to SSH and HTTP/HTTPS:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'provider.compute.makeFirewall({\n  name: `firewall-22-80-433-${stage}`,\n  properties: () => ({\n    allowed: [\n      {\n        IPProtocol: "tcp",\n        ports: ["22", "80", "433"],\n      },\n    ],\n  }),\n});\n')),(0,l.kt)("p",null,"Allow ping from anywhere:"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},'provider.compute.makeFirewall({\n  name: `firewall-icmp-${stage}`,\n  properties: () => ({\n    allowed: [\n      {\n        IPProtocol: "icmp",\n      },\n    ],\n  }),\n});\n')),(0,l.kt)("h3",{id:"examples"},"Examples"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/vm"},"basic example")),(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/vm-network"},"full example"))),(0,l.kt)("h3",{id:"properties"},"Properties"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://cloud.google.com/compute/docs/reference/rest/v1/firewalls/insert"},"all properties"))),(0,l.kt)("h3",{id:"dependencies"},"Dependencies"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/docs/google/resources/Compute/Network"},"Network"))))}m.isMDXComponent=!0}}]);