"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3776],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return f}});var r=n(67294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),d=u(n),f=i,m=d["".concat(l,".").concat(f)]||d[f]||p[f]||o;return n?r.createElement(m,c(c({ref:t},s),{},{components:n})):r.createElement(m,c({ref:t},s))}));function f(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,c=new Array(o);c[0]=d;var a={};for(var l in t)hasOwnProperty.call(t,l)&&(a[l]=t[l]);a.originalType=e,a.mdxType="string"==typeof e?e:i,c[1]=a;for(var u=2;u<o;u++)c[u]=n[u];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},54510:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return l},metadata:function(){return u},toc:function(){return s},default:function(){return d}});var r=n(87462),i=n(63366),o=(n(67294),n(3905)),c=["components"],a={id:"Init",title:"Init"},l=void 0,u={unversionedId:"cli/Init",id:"cli/Init",isDocsHomePage:!1,title:"Init",description:"The init commands initialises the providers.",source:"@site/docs/cli/Init.md",sourceDirName:"cli",slug:"/cli/Init",permalink:"/docs/cli/Init",tags:[],version:"current",frontMatter:{id:"Init",title:"Init"},sidebar:"docs",previous:{title:"New Project",permalink:"/docs/cli/New"},next:{title:"Generate Code",permalink:"/docs/cli/GenCode"}},s=[{value:"Providers",id:"providers",children:[{value:"AWS",id:"aws",children:[],level:3},{value:"Azure",id:"azure",children:[],level:3},{value:"Google",id:"google",children:[],level:3}],level:2}],p={toc:s};function d(e){var t=e.components,a=(0,i.Z)(e,c);return(0,o.kt)("wrapper",(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"The ",(0,o.kt)("strong",{parentName:"p"},"init")," commands initialises the providers."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc init\n")),(0,o.kt)("p",null,"The exact procedure depends on the provider, however, most of them perform the following tasks:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"Check if the provider's CLI is installed."),(0,o.kt)("li",{parentName:"ul"},"Authenticate to the cloud provider."),(0,o.kt)("li",{parentName:"ul"},"Set region and zone.")),(0,o.kt)("h2",{id:"providers"},"Providers"),(0,o.kt)("h3",{id:"aws"},"AWS"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"gc-init-aws",src:n(74729).Z})),(0,o.kt)("h3",{id:"azure"},"Azure"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"gc-init-azure",src:n(86326).Z})),(0,o.kt)("h3",{id:"google"},"Google"),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"gc-init-google",src:n(53812).Z})))}d.isMDXComponent=!0},74729:function(e,t,n){t.Z=n.p+"assets/images/gc-init-aws-d27653c28b29429133d554b26e25a18e.svg"},86326:function(e,t,n){t.Z=n.p+"assets/images/gc-init-azure-d234668b56d1fcbe10c61bb37bca7dde.svg"},53812:function(e,t,n){t.Z=n.p+"assets/images/gc-init-google-cb0cd6fba3606874c8e1cce110ccd582.svg"}}]);