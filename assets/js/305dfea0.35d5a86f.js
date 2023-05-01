"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[38257],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>f});var o=t(67294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function a(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,o,n=function(e,r){if(null==e)return{};var t,o,n={},s=Object.keys(e);for(o=0;o<s.length;o++)t=s[o],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(o=0;o<s.length;o++)t=s[o],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var c=o.createContext({}),i=function(e){var r=o.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):a(a({},r),e)),t},p=function(e){var r=i(e.components);return o.createElement(c.Provider,{value:r},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return o.createElement(o.Fragment,{},r)}},m=o.forwardRef((function(e,r){var t=e.components,n=e.mdxType,s=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=i(t),m=n,f=u["".concat(c,".").concat(m)]||u[m]||d[m]||s;return t?o.createElement(f,a(a({ref:r},p),{},{components:t})):o.createElement(f,a({ref:r},p))}));function f(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var s=t.length,a=new Array(s);a[0]=m;var l={};for(var c in r)hasOwnProperty.call(r,c)&&(l[c]=r[c]);l.originalType=e,l[u]="string"==typeof e?e:n,a[1]=l;for(var i=2;i<s;i++)a[i]=t[i];return o.createElement.apply(null,a)}return o.createElement.apply(null,t)}m.displayName="MDXCreateElement"},92138:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>a,default:()=>d,frontMatter:()=>s,metadata:()=>l,toc:()=>i});var o=t(87462),n=(t(67294),t(3905));const s={id:"Address",title:"Address"},a=void 0,l={unversionedId:"google/resources/compute/Address",id:"google/resources/compute/Address",title:"Address",description:"Provides a public Ip address:",source:"@site/docs/google/resources/compute/Address.md",sourceDirName:"google/resources/compute",slug:"/google/resources/compute/Address",permalink:"/docs/google/resources/compute/Address",draft:!1,tags:[],version:"current",frontMatter:{id:"Address",title:"Address"},sidebar:"docs",previous:{title:"Resources List",permalink:"/docs/google/ResourcesList"},next:{title:"Backend Bucket",permalink:"/docs/google/resources/compute/BackendBucket"}},c={},i=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Used By",id:"used-by",level:3}],p={toc:i},u="wrapper";function d(e){let{components:r,...t}=e;return(0,n.kt)(u,(0,o.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Provides a public Ip address:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'const ip = provider.compute.makeAddress({ name: "ip-webserver" });\n')),(0,n.kt)("h3",{id:"examples"},"Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/vm/"},"basic example"))),(0,n.kt)("h3",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://cloud.google.com/compute/docs/reference/rest/v1/addresses/insert#request-body"},"all properties"))),(0,n.kt)("h3",{id:"used-by"},"Used By"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/google/resources/compute/VmInstance"},"Vm Instance"))))}d.isMDXComponent=!0}}]);