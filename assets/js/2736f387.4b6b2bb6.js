"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[14279],{3905:(e,r,t)=>{t.d(r,{Zo:()=>p,kt:()=>g});var n=t(67294);function o(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function a(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?a(Object(t),!0).forEach((function(r){o(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,o=function(e,r){if(null==e)return{};var t,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||(o[t]=e[t]);return o}(e,r);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)t=a[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var c=n.createContext({}),s=function(e){var r=n.useContext(c),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},p=function(e){var r=s(e.components);return n.createElement(c.Provider,{value:r},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=s(t),d=o,g=u["".concat(c,".").concat(d)]||u[d]||m[d]||a;return t?n.createElement(g,i(i({ref:r},p),{},{components:t})):n.createElement(g,i({ref:r},p))}));function g(e,r){var t=arguments,o=r&&r.mdxType;if("string"==typeof e||o){var a=t.length,i=new Array(a);i[0]=d;var l={};for(var c in r)hasOwnProperty.call(r,c)&&(l[c]=r[c]);l.originalType=e,l[u]="string"==typeof e?e:o,i[1]=l;for(var s=2;s<a;s++)i[s]=t[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},17881:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>a,metadata:()=>l,toc:()=>s});var n=t(87462),o=(t(67294),t(3905));const a={id:"Member",title:"Member"},i=void 0,l={unversionedId:"google/resources/iam/Member",id:"google/resources/iam/Member",title:"Member",description:"Provides a IAM Member for a project.",source:"@site/docs/google/resources/iam/Member.md",sourceDirName:"google/resources/iam",slug:"/google/resources/iam/Member",permalink:"/docs/google/resources/iam/Member",draft:!1,tags:[],version:"current",frontMatter:{id:"Member",title:"Member"},sidebar:"docs",previous:{title:"Binding",permalink:"/docs/google/resources/iam/Binding"},next:{title:"Policy",permalink:"/docs/google/resources/iam/Policy"}},c={},s=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Used By",id:"used-by",level:3}],p={toc:s},u="wrapper";function m(e){let{components:r,...t}=e;return(0,o.kt)(u,(0,n.Z)({},p,t,{components:r,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides a IAM Member for a project."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'const serviceAccount = provider.iam.makeServiceAccount({\n  name: "sa",\n  propertie: () => ({\n    accountId: "sa-dev",\n    displayName: "SA dev",\n  }),\n});\n\nconst iamMember = provider.makeProjectIamMember({\n  name: "iam-member",\n  dependencies: () => ({ serviceAccount: "sa" }),\n  properties: () => ({\n    roles: ["roles/storage.objectViewer", "roles/logging.logWriter"],\n  }),\n});\n')),(0,o.kt)("h3",{id:"examples"},"Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/iam"},"basic example"))),(0,o.kt)("h3",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://cloud.google.com/compute/docs/reference/rest/v1/addresses/insert#request-body"},"all properties"))),(0,o.kt)("h3",{id:"used-by"},"Used By"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/google/resources/iam/ServiceAccount"},"ServiceAccount"))))}m.isMDXComponent=!0}}]);