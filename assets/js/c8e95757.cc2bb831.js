"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[34426],{3905:(e,r,t)=>{t.d(r,{Zo:()=>u,kt:()=>d});var a=t(67294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function m(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var p=a.createContext({}),l=function(e){var r=a.useContext(p),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},u=function(e){var r=l(e.components);return a.createElement(p.Provider,{value:r},e.children)},i={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},c=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,o=e.originalType,p=e.parentName,u=m(e,["components","mdxType","originalType","parentName"]),c=l(t),d=n,y=c["".concat(p,".").concat(d)]||c[d]||i[d]||o;return t?a.createElement(y,s(s({ref:r},u),{},{components:t})):a.createElement(y,s({ref:r},u))}));function d(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var o=t.length,s=new Array(o);s[0]=c;var m={};for(var p in r)hasOwnProperty.call(r,p)&&(m[p]=r[p]);m.originalType=e,m.mdxType="string"==typeof e?e:n,s[1]=m;for(var l=2;l<o;l++)s[l]=t[l];return a.createElement.apply(null,s)}return a.createElement.apply(null,t)}c.displayName="MDXCreateElement"},92471:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>p,contentTitle:()=>s,default:()=>i,frontMatter:()=>o,metadata:()=>m,toc:()=>l});var a=t(87462),n=(t(67294),t(3905));const o={id:"ParameterGroup",title:"ParameterGroup"},s=void 0,m={unversionedId:"aws/resources/MemoryDB/ParameterGroup",id:"aws/resources/MemoryDB/ParameterGroup",title:"ParameterGroup",description:"Manages a MemoryDB Parameter Group.",source:"@site/docs/aws/resources/MemoryDB/ParameterGroup.md",sourceDirName:"aws/resources/MemoryDB",slug:"/aws/resources/MemoryDB/ParameterGroup",permalink:"/docs/aws/resources/MemoryDB/ParameterGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"ParameterGroup",title:"ParameterGroup"},sidebar:"docs",previous:{title:"Cluster",permalink:"/docs/aws/resources/MemoryDB/Cluster"},next:{title:"SubnetGroup",permalink:"/docs/aws/resources/MemoryDB/SubnetGroup"}},p={},l=[{value:"Example",id:"example",level:2},{value:"Code Examples",id:"code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Used By",id:"used-by",level:2},{value:"List",id:"list",level:2}],u={toc:l};function i(e){let{components:r,...t}=e;return(0,n.kt)("wrapper",(0,a.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Manages a ",(0,n.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/memorydb/home?#/parameter-groups"},"MemoryDB Parameter Group"),"."),(0,n.kt)("h2",{id:"example"},"Example"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ParameterGroup",\n    group: "MemoryDB",\n    properties: ({}) => ({\n      Description: " ",\n      Family: "memorydb_redis6",\n      Name: "param-group",\n    }),\n  },\n];\n')),(0,n.kt)("h2",{id:"code-examples"},"Code Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/MemoryDB/memorydb-simple"},"memorydb simple"))),(0,n.kt)("h2",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-memorydb/interfaces/createparametergroupcommandinput.html"},"CreateParameterGroupCommandInput"))),(0,n.kt)("h2",{id:"used-by"},"Used By"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/MemoryDB/Cluster"},"MemoryDB Cluster"))),(0,n.kt)("h2",{id:"list"},"List"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t MemoryDB::ParameterGroup\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 MemoryDB::ParameterGroup from aws                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: default.memorydb-redis6                                            \u2502\n\u2502 managedByUs: NO                                                          \u2502\n\u2502 live:                                                                    \u2502\n\u2502   ARN: arn:aws:memorydb:us-east-1:840541460064:parametergroup/default.m\u2026 \u2502\n\u2502   Description: Default parameter group for memorydb_redis6               \u2502\n\u2502   Family: memorydb_redis6                                                \u2502\n\u2502   Name: default.memorydb-redis6                                          \u2502\n\u2502   Tags: []                                                               \u2502\n\u2502                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: param-group                                                        \u2502\n\u2502 managedByUs: Yes                                                         \u2502\n\u2502 live:                                                                    \u2502\n\u2502   ARN: arn:aws:memorydb:us-east-1:840541460064:parametergroup/param-gro\u2026 \u2502\n\u2502   Description:                                                           \u2502\n\u2502   Family: memorydb_redis6                                                \u2502\n\u2502   Name: param-group                                                      \u2502\n\u2502   Tags:                                                                  \u2502\n\u2502     - Key: gc-created-by-provider                                        \u2502\n\u2502       Value: aws                                                         \u2502\n\u2502     - Key: gc-managed-by                                                 \u2502\n\u2502       Value: grucloud                                                    \u2502\n\u2502     - Key: gc-project-name                                               \u2502\n\u2502       Value: memorydb-simple                                             \u2502\n\u2502     - Key: gc-stage                                                      \u2502\n\u2502       Value: dev                                                         \u2502\n\u2502     - Key: Name                                                          \u2502\n\u2502       Value: param-group                                                 \u2502\n\u2502                                                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 MemoryDB::ParameterGroup \u2502 default.memorydb-redis6                      \u2502\n\u2502                          \u2502 param-group                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t MemoryDB::ParameterGroup" executed in 4s, 100 MB\n')))}i.isMDXComponent=!0}}]);