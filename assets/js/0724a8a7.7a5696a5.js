"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[32989],{3905:function(e,t,r){r.d(t,{Zo:function(){return l},kt:function(){return m}});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},u=Object.keys(e);for(n=0;n<u.length;n++)r=u[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(e);for(n=0;n<u.length;n++)r=u[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var p=n.createContext({}),a=function(e){var t=n.useContext(p),r=t;return e&&(r="function"==typeof e?e(t):c(c({},t),e)),r},l=function(e){var t=a(e.components);return n.createElement(p.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,u=e.originalType,p=e.parentName,l=i(e,["components","mdxType","originalType","parentName"]),f=a(r),m=o,d=f["".concat(p,".").concat(m)]||f[m]||s[m]||u;return r?n.createElement(d,c(c({ref:t},l),{},{components:r})):n.createElement(d,c({ref:t},l))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var u=r.length,c=new Array(u);c[0]=f;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:o,c[1]=i;for(var a=2;a<u;a++)c[a]=r[a];return n.createElement.apply(null,c)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},42087:function(e,t,r){r.r(t),r.d(t,{frontMatter:function(){return i},contentTitle:function(){return p},metadata:function(){return a},toc:function(){return l},default:function(){return f}});var n=r(87462),o=r(63366),u=(r(67294),r(3905)),c=["components"],i={id:"Output",title:"Output Resources"},p=void 0,a={unversionedId:"cli/Output",id:"cli/Output",isDocsHomePage:!1,title:"Output Resources",description:"The output commands queries the current live resources information",source:"@site/docs/cli/Output.md",sourceDirName:"cli",slug:"/cli/Output",permalink:"/docs/cli/Output",tags:[],version:"current",frontMatter:{id:"Output",title:"Output Resources"}},l=[{value:"Command options",id:"command-options",children:[],level:2}],s={toc:l};function f(e){var t=e.components,r=(0,o.Z)(e,c);return(0,u.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,u.kt)("p",null,"The ",(0,u.kt)("strong",{parentName:"p"},"output")," commands queries the current live resources information"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre"},"gc output --type Ip --name myip --field address\n")),(0,u.kt)("h2",{id:"command-options"},"Command options"),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre"},"gc output --help\n")),(0,u.kt)("pre",null,(0,u.kt)("code",{parentName:"pre"},"Usage: gc output|o [options]\n\nOutput the value of a resource\n\nOptions:\n  -n, --name <value>      resource name\n  -t, --type <value>      resource type\n  -f, --field <value>     the resource field to get\n  -p, --provider <value>  Filter by provider, multiple values allowed\n  -h, --help              display help for command\n")))}f.isMDXComponent=!0}}]);