"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[66314],{3905:(e,r,a)=>{a.d(r,{Zo:()=>u,kt:()=>h});var t=a(67294);function n(e,r,a){return r in e?Object.defineProperty(e,r,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[r]=a,e}function c(e,r){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),a.push.apply(a,t)}return a}function l(e){for(var r=1;r<arguments.length;r++){var a=null!=arguments[r]?arguments[r]:{};r%2?c(Object(a),!0).forEach((function(r){n(e,r,a[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):c(Object(a)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(a,r))}))}return e}function s(e,r){if(null==e)return{};var a,t,n=function(e,r){if(null==e)return{};var a,t,n={},c=Object.keys(e);for(t=0;t<c.length;t++)a=c[t],r.indexOf(a)>=0||(n[a]=e[a]);return n}(e,r);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(t=0;t<c.length;t++)a=c[t],r.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var o=t.createContext({}),i=function(e){var r=t.useContext(o),a=r;return e&&(a="function"==typeof e?e(r):l(l({},r),e)),a},u=function(e){var r=i(e.components);return t.createElement(o.Provider,{value:r},e.children)},p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},m=t.forwardRef((function(e,r){var a=e.components,n=e.mdxType,c=e.originalType,o=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),m=i(a),h=n,d=m["".concat(o,".").concat(h)]||m[h]||p[h]||c;return a?t.createElement(d,l(l({ref:r},u),{},{components:a})):t.createElement(d,l({ref:r},u))}));function h(e,r){var a=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var c=a.length,l=new Array(c);l[0]=m;var s={};for(var o in r)hasOwnProperty.call(r,o)&&(s[o]=r[o]);s.originalType=e,s.mdxType="string"==typeof e?e:n,l[1]=s;for(var i=2;i<c;i++)l[i]=a[i];return t.createElement.apply(null,l)}return t.createElement.apply(null,a)}m.displayName="MDXCreateElement"},81105:(e,r,a)=>{a.r(r),a.d(r,{assets:()=>o,contentTitle:()=>l,default:()=>p,frontMatter:()=>c,metadata:()=>s,toc:()=>i});var t=a(87462),n=(a(67294),a(3905));const c={id:"CacheParameterGroup",title:"CacheParameterGroup"},l=void 0,s={unversionedId:"aws/resources/ElastiCache/CacheParameterGroup",id:"aws/resources/ElastiCache/CacheParameterGroup",title:"CacheParameterGroup",description:"Manages an ElastiCache Parameter Group.",source:"@site/docs/aws/resources/ElastiCache/CacheParameterGroup.md",sourceDirName:"aws/resources/ElastiCache",slug:"/aws/resources/ElastiCache/CacheParameterGroup",permalink:"/docs/aws/resources/ElastiCache/CacheParameterGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"CacheParameterGroup",title:"CacheParameterGroup"},sidebar:"docs",previous:{title:"Cache Cluster",permalink:"/docs/aws/resources/ElastiCache/CacheCluster"},next:{title:"CacheSubnetGroup",permalink:"/docs/aws/resources/ElastiCache/CacheSubnetGroup"}},o={},i=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],u={toc:i};function p(e){let{components:r,...a}=e;return(0,n.kt)("wrapper",(0,t.Z)({},u,a,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Manages an ",(0,n.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/elasticache/home#/parameter-groups"},"ElastiCache Parameter Group"),"."),(0,n.kt)("h2",{id:"sample-code"},"Sample code"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "CacheParameterGroup",\n    group: "ElastiCache",\n    properties: ({}) => ({\n      CacheParameterGroupName: "my-parameter-group",\n      CacheParameterGroupFamily: "redis6.x",\n      Description: "My Parameter Group",\n      Tags: [\n        {\n          Key: "mykey",\n          Value: "myvalue",\n        },\n      ],\n    }),\n  },\n];\n')),(0,n.kt)("h2",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createcacheparametergroupcommandinput.html"},"CreateCacheParameterGroupCommandInput"))),(0,n.kt)("h2",{id:"used-by"},"Used By"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElastiCache/CacheCluster"},"ElastiCache Cluster"))),(0,n.kt)("h2",{id:"full-examples"},"Full Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-memcached"},"elasticache memcached")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-redis"},"elasticache redis"))),(0,n.kt)("h2",{id:"list"},"List"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ElastiCache::CacheParameterGroup\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-txt"},"")))}p.isMDXComponent=!0}}]);