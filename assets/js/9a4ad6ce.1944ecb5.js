"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[29381],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>d});var r=a(67294);function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){l(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,r,l=function(e,t){if(null==e)return{};var a,r,l={},n=Object.keys(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)a=n[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var c=r.createContext({}),s=function(e){var t=r.useContext(c),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=s(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,l=e.mdxType,n=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),m=s(a),d=l,f=m["".concat(c,".").concat(d)]||m[d]||u[d]||n;return a?r.createElement(f,o(o({ref:t},p),{},{components:a})):r.createElement(f,o({ref:t},p))}));function d(e,t){var a=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var n=a.length,o=new Array(n);o[0]=m;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:l,o[1]=i;for(var s=2;s<n;s++)o[s]=a[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},40862:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>u,frontMatter:()=>n,metadata:()=>i,toc:()=>s});var r=a(87462),l=(a(67294),a(3905));const n={id:"GlobalReplicationGroup",title:"Global Replication Group"},o=void 0,i={unversionedId:"aws/resources/ElastiCache/GlobalReplicationGroup",id:"aws/resources/ElastiCache/GlobalReplicationGroup",title:"Global Replication Group",description:"Manages an ElastiCache Global Replication Group.",source:"@site/docs/aws/resources/ElastiCache/GlobalReplicationGroup.md",sourceDirName:"aws/resources/ElastiCache",slug:"/aws/resources/ElastiCache/GlobalReplicationGroup",permalink:"/docs/aws/resources/ElastiCache/GlobalReplicationGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"GlobalReplicationGroup",title:"Global Replication Group"},sidebar:"docs",previous:{title:"CacheSubnetGroup",permalink:"/docs/aws/resources/ElastiCache/CacheSubnetGroup"},next:{title:"Replication Group",permalink:"/docs/aws/resources/ElastiCache/ReplicationGroup"}},c={},s=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],p={toc:s};function u(e){let{components:t,...a}=e;return(0,l.kt)("wrapper",(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Manages an ",(0,l.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/elasticache/home#"},"ElastiCache Global Replication Group"),"."),(0,l.kt)("h2",{id:"sample-code"},"Sample code"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-js"},"exports.createResources = () => [];\n")),(0,l.kt)("h2",{id:"properties"},"Properties"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createglobalreplicationgroupcommandinput.html"},"CreateGlobalReplicationGroupCommandInput"))),(0,l.kt)("h2",{id:"used-by"},"Used By"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElastiCache/ReplicationGroup"},"ElastiCache Replication Group"))),(0,l.kt)("h2",{id:"full-examples"},"Full Examples"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},(0,l.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-simple"},"elasticache simple"))),(0,l.kt)("h2",{id:"list"},"List"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t ElastiCache::GlobalReplicationGroup\n")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-txt"},"")))}u.isMDXComponent=!0}}]);