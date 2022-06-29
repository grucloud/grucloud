"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3940],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>d});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),i=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=i(e.components);return n.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),m=i(r),d=o,g=m["".concat(s,".").concat(d)]||m[d]||u[d]||a;return r?n.createElement(g,l(l({ref:t},p),{},{components:r})):n.createElement(g,l({ref:t},p))}));function d(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,l=new Array(a);l[0]=m;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:o,l[1]=c;for(var i=2;i<a;i++)l[i]=r[i];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},69995:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>i});var n=r(87462),o=(r(67294),r(3905));const a={id:"Object",title:"Object"},l=void 0,c={unversionedId:"google/resources/storage/Object",id:"google/resources/storage/Object",title:"Object",description:"Provides an Object storage.",source:"@site/docs/google/resources/storage/Object.md",sourceDirName:"google/resources/storage",slug:"/google/resources/storage/Object",permalink:"/docs/google/resources/storage/Object",draft:!1,tags:[],version:"current",frontMatter:{id:"Object",title:"Object"},sidebar:"docs",previous:{title:"Bucket",permalink:"/docs/google/resources/storage/Bucket"},next:{title:"Google Requirements",permalink:"/docs/google/GoogleRequirements"}},s={},i=[{value:"Examples",id:"examples",level:2},{value:"Simple Object",id:"simple-object",level:3},{value:"Properties",id:"properties",level:3},{value:"Example Code",id:"example-code",level:3},{value:"Depends On",id:"depends-on",level:2}],p={toc:i};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides an Object storage."),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"simple-object"},"Simple Object"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'provider.storage.makeBucket({\n  name: "myuniquebucketname",\n  properties: () => ({ storageClass: "STANDARD" }),\n});\n\nprovider.storage.makeObject({\n  name: "myname",\n  dependencies: { bucket: "myuniquebucketname" },\n  properties: () => ({\n    path: "/",\n    contentType: "text/plain",\n    source: path.join(process.cwd(), "testFile.txt"),\n  }),\n});\n')),(0,o.kt)("h3",{id:"properties"},"Properties"),(0,o.kt)("p",null,"See ",(0,o.kt)("a",{parentName:"p",href:"https://cloud.google.com/storage/docs/json_api/v1/objects/insert#request-body"},"Object create properties")),(0,o.kt)("h3",{id:"example-code"},"Example Code"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/google/storage/simple"},"basic example"))),(0,o.kt)("h2",{id:"depends-on"},"Depends On"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/google/resources/storage/Bucket"},"GcpBucket"))))}u.isMDXComponent=!0}}]);