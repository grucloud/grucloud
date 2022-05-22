"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[47336],{3905:function(e,t,r){r.d(t,{Zo:function(){return u},kt:function(){return m}});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var i=n.createContext({}),p=function(e){var t=n.useContext(i),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},u=function(e){var t=p(e.components);return n.createElement(i.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=p(r),m=o,f=d["".concat(i,".").concat(m)]||d[m]||s[m]||a;return r?n.createElement(f,c(c({ref:t},u),{},{components:r})):n.createElement(f,c({ref:t},u))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,c=new Array(a);c[0]=d;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l.mdxType="string"==typeof e?e:o,c[1]=l;for(var p=2;p<a;p++)c[p]=r[p];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},80314:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return l},contentTitle:function(){return i},metadata:function(){return p},toc:function(){return u},default:function(){return d}});var n=r(87462),o=r(63366),a=(r(67294),r(3905)),c=["components"],l={id:"TLDR",title:"TL;DR"},i=void 0,p={unversionedId:"TLDR",id:"TLDR",isDocsHomePage:!1,title:"TL;DR",description:"Let's create a fake infrastructure with the mock provider.",source:"@site/docs/TLDR.md",sourceDirName:".",slug:"/TLDR",permalink:"/docs/TLDR",tags:[],version:"current",frontMatter:{id:"TLDR",title:"TL;DR"}},u=[],s={toc:u};function d(e){var t=e.components,r=(0,o.Z)(e,c);return(0,a.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Let's create a fake infrastructure with the mock provider."),(0,a.kt)("p",null,"First of all, install the command line utility ",(0,a.kt)("strong",{parentName:"p"},"gc")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm i -g @grucloud/core\n")),(0,a.kt)("p",null,"Clone the source code and install the dependencies"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"git clone git@github.com:grucloud/grucloud.git\ncd grucloud\nnpm install\nnpm run bootstrap\n")),(0,a.kt)("p",null,"Start the mock cloud service provider located at ",(0,a.kt)("inlineCode",{parentName:"p"},"package/tools/mockServer")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"cd package/tools/mockServer\nnpm run start\n")),(0,a.kt)("p",null,"Open another console, go the mock example directory and install the dependencies:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"cd examples/mock\n")),(0,a.kt)("p",null,"Now it is time to edit the infrastructure file that describes the architecture:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"<your favorite editor> iac.js\n")),(0,a.kt)("p",null,"Find out which resources are going to be allocated:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc plan\n")),(0,a.kt)("p",null,"Happy with the expected plan ? Deploy it now:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc apply\n")),(0,a.kt)("p",null,"Time to destroy the resouces allocated:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc destroy\n")),(0,a.kt)("p",null,"Well done. Infrastrucure as code in a few commands."))}d.isMDXComponent=!0}}]);