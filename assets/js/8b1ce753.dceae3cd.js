"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[745],{3905:function(e,r,t){t.d(r,{Zo:function(){return s},kt:function(){return d}});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function c(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?c(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):c(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},c=Object.keys(e);for(n=0;n<c.length;n++)t=c[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(n=0;n<c.length;n++)t=c[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var a=n.createContext({}),u=function(e){var r=n.useContext(a),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},s=function(e){var r=u(e.components);return n.createElement(a.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,c=e.originalType,a=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),m=u(t),d=o,f=m["".concat(a,".").concat(d)]||m[d]||p[d]||c;return t?n.createElement(f,i(i({ref:r},s),{},{components:t})):n.createElement(f,i({ref:r},s))}));function d(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var c=t.length,i=new Array(c);i[0]=m;var l={};for(var a in r)hasOwnProperty.call(r,a)&&(l[a]=r[a]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var u=2;u<c;u++)i[u]=t[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},71433:function(e,r,t){t.r(r),t.d(r,{frontMatter:function(){return l},contentTitle:function(){return a},metadata:function(){return u},toc:function(){return s},default:function(){return m}});var n=t(87462),o=t(63366),c=(t(67294),t(3905)),i=["components"],l={id:"Policy",title:"Policy"},a=void 0,u={unversionedId:"google/resources/IAM/Policy",id:"google/resources/IAM/Policy",isDocsHomePage:!1,title:"Policy",description:"Provides a IAM Policy for a project.",source:"@site/docs/google/resources/IAM/Policy.md",sourceDirName:"google/resources/IAM",slug:"/google/resources/IAM/Policy",permalink:"/docs/google/resources/IAM/Policy",tags:[],version:"current",frontMatter:{id:"Policy",title:"Policy"},sidebar:"docs",previous:{title:"Member",permalink:"/docs/google/resources/IAM/Member"},next:{title:"Service Account",permalink:"/docs/google/resources/IAM/ServiceAccount"}},s=[{value:"Examples",id:"examples",children:[],level:3},{value:"Properties",id:"properties",children:[],level:3},{value:"Used By",id:"used-by",children:[],level:3}],p={toc:s};function m(e){var r=e.components,t=(0,o.Z)(e,i);return(0,c.kt)("wrapper",(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,c.kt)("p",null,"Provides a IAM Policy for a project."),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-js"},'const iamPolicy = provider.iam.makePolicy({\n  name: "iam-policy",\n  properties: () => ({\n    policy: {\n      bindings: [\n        {\n          role: "roles/editor",\n          members: ["user:jane@example.com"],\n        },\n      ],\n    },\n  }),\n});\n')),(0,c.kt)("h3",{id:"examples"},"Examples"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/iam"},"basic example"))),(0,c.kt)("h3",{id:"properties"},"Properties"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"https://cloud.google.com/compute/docs/reference/rest/v1/addresses/insert#request-body"},"all properties"))),(0,c.kt)("h3",{id:"used-by"},"Used By"),(0,c.kt)("ul",null,(0,c.kt)("li",{parentName:"ul"},(0,c.kt)("a",{parentName:"li",href:"/docs/google/resources/IAM/ServiceAccount"},"ServiceAccount"))))}m.isMDXComponent=!0}}]);