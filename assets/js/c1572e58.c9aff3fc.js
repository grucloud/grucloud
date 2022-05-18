"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3066],{3905:function(e,t,r){r.d(t,{Zo:function(){return s},kt:function(){return d}});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function a(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},u=Object.keys(e);for(n=0;n<u.length;n++)r=u[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)r=u[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),i=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},s=function(e){var t=i(e.components);return n.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,u=e.originalType,c=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),m=i(r),d=o,f=m["".concat(c,".").concat(d)]||m[d]||p[d]||u;return r?n.createElement(f,l(l({ref:t},s),{},{components:r})):n.createElement(f,l({ref:t},s))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var u=r.length,l=new Array(u);l[0]=m;var a={};for(var c in t)hasOwnProperty.call(t,c)&&(a[c]=t[c]);a.originalType=e,a.mdxType="string"==typeof e?e:o,l[1]=a;for(var i=2;i<u;i++)l[i]=r[i];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},90129:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return a},contentTitle:function(){return c},metadata:function(){return i},toc:function(){return s},default:function(){return m}});var n=r(87462),o=r(63366),u=(r(67294),r(3905)),l=["components"],a={id:"SubNetwork",title:"SubNetwork"},c=void 0,i={unversionedId:"google/resources/Compute/SubNetwork",id:"google/resources/Compute/SubNetwork",isDocsHomePage:!1,title:"SubNetwork",description:"Manages a SubNetwork",source:"@site/docs/google/resources/Compute/SubNetwork.md",sourceDirName:"google/resources/Compute",slug:"/google/resources/Compute/SubNetwork",permalink:"/docs/google/resources/Compute/SubNetwork",tags:[],version:"current",frontMatter:{id:"SubNetwork",title:"SubNetwork"},sidebar:"docs",previous:{title:"SSL Certificate",permalink:"/docs/google/resources/Compute/SslCertificate"},next:{title:"Url Map",permalink:"/docs/google/resources/Compute/UrlMap"}},s=[{value:"Examples",id:"examples",children:[],level:3},{value:"Properties",id:"properties",children:[],level:3},{value:"Dependencies",id:"dependencies",children:[],level:3},{value:"Used By",id:"used-by",children:[],level:3}],p={toc:s};function m(e){var t=e.components,r=(0,o.Z)(e,l);return(0,u.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,u.kt)("p",null,"Manages a ",(0,u.kt)("a",{parentName:"p",href:"https://cloud.google.com/compute/docs/reference/rest/v1/subnetworks"},"SubNetwork")),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre",className:"language-js"},'provider.ec2.makeSubnetwork({\n  name: "subnetwork-dev",\n  dependencies: { network: "vnet" },\n  properties: () => ({\n    ipCidrRange: "10.164.0.0/20",\n  }),\n});\n')),(0,u.kt)("h3",{id:"examples"},"Examples"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/vm-network"},"basic example"))),(0,u.kt)("h3",{id:"properties"},"Properties"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"https://cloud.google.com/compute/docs/reference/rest/v1/subnetworks/insert"},"all properties"))),(0,u.kt)("h3",{id:"dependencies"},"Dependencies"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"/docs/google/resources/Compute/Network"},"Network"))),(0,u.kt)("h3",{id:"used-by"},"Used By"),(0,u.kt)("ul",null,(0,u.kt)("li",{parentName:"ul"},(0,u.kt)("a",{parentName:"li",href:"/docs/google/resources/Compute/VmInstance"},"VmInstance"))))}m.isMDXComponent=!0}}]);