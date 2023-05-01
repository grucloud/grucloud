"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[23572],{3905:(e,r,n)=>{n.d(r,{Zo:()=>i,kt:()=>b});var t=n(67294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function o(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function s(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?o(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function u(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=t.createContext({}),p=function(e){var r=t.useContext(l),n=r;return e&&(n="function"==typeof e?e(r):s(s({},r),e)),n},i=function(e){var r=p(e.components);return t.createElement(l.Provider,{value:r},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,i=u(e,["components","mdxType","originalType","parentName"]),c=p(n),d=a,b=c["".concat(l,".").concat(d)]||c[d]||m[d]||o;return n?t.createElement(b,s(s({ref:r},i),{},{components:n})):t.createElement(b,s({ref:r},i))}));function b(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=d;var u={};for(var l in r)hasOwnProperty.call(r,l)&&(u[l]=r[l]);u.originalType=e,u[c]="string"==typeof e?e:a,s[1]=u;for(var p=2;p<o;p++)s[p]=n[p];return t.createElement.apply(null,s)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},45370:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>o,metadata:()=>u,toc:()=>p});var t=n(87462),a=(n(67294),n(3905));const o={id:"SubnetGroup",title:"SubnetGroup"},s=void 0,u={unversionedId:"aws/resources/MemoryDB/SubnetGroup",id:"aws/resources/MemoryDB/SubnetGroup",title:"SubnetGroup",description:"Manages a MemoryDB Parameter Group.",source:"@site/docs/aws/resources/MemoryDB/SubnetGroup.md",sourceDirName:"aws/resources/MemoryDB",slug:"/aws/resources/MemoryDB/SubnetGroup",permalink:"/docs/aws/resources/MemoryDB/SubnetGroup",draft:!1,tags:[],version:"current",frontMatter:{id:"SubnetGroup",title:"SubnetGroup"},sidebar:"docs",previous:{title:"ParameterGroup",permalink:"/docs/aws/resources/MemoryDB/ParameterGroup"},next:{title:"User",permalink:"/docs/aws/resources/MemoryDB/User"}},l={},p=[{value:"Example",id:"example",level:2},{value:"Code Examples",id:"code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"List",id:"list",level:2}],i={toc:p},c="wrapper";function m(e){let{components:r,...n}=e;return(0,a.kt)(c,(0,t.Z)({},i,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages a ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/memorydb/home?#/subnet-groups"},"MemoryDB Parameter Group"),"."),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "SubnetGroup",\n    group: "MemoryDB",\n    properties: ({}) => ({\n      Name: "subnet-group",\n    }),\n    dependencies: ({ config }) => ({\n      subnets: [\n        `vpc::subnet-private1-${config.region}a`,\n        `vpc::subnet-private2-${config.region}b`,\n      ],\n    }),\n  },\n];\n')),(0,a.kt)("h2",{id:"code-examples"},"Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/MemoryDB/memorydb-simple"},"memorydb simple"))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-memorydb/interfaces/createparametergroupcommandinput.html"},"CreateSubnetGroupCommandInput"))),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"EC2 Subnet"))),(0,a.kt)("h2",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/MemoryDB/Cluster"},"MemoryDB Cluster"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t MemoryDB::SubnetGroup\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 MemoryDB::SubnetGroup from aws                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: subnet-group                                                       \u2502\n\u2502 managedByUs: Yes                                                         \u2502\n\u2502 live:                                                                    \u2502\n\u2502   ARN: arn:aws:memorydb:us-east-1:840541460064:subnetgroup/subnet-group  \u2502\n\u2502   Name: subnet-group                                                     \u2502\n\u2502   Subnets:                                                               \u2502\n\u2502     - AvailabilityZone:                                                  \u2502\n\u2502         Name: us-east-1b                                                 \u2502\n\u2502       Identifier: subnet-081fb38b21bf7a0b9                               \u2502\n\u2502     - AvailabilityZone:                                                  \u2502\n\u2502         Name: us-east-1a                                                 \u2502\n\u2502       Identifier: subnet-07ef46c6dd78c2ebd                               \u2502\n\u2502   VpcId: vpc-043cc512c461b8a0b                                           \u2502\n\u2502   Tags:                                                                  \u2502\n\u2502     - Key: gc-created-by-provider                                        \u2502\n\u2502       Value: aws                                                         \u2502\n\u2502     - Key: gc-managed-by                                                 \u2502\n\u2502       Value: grucloud                                                    \u2502\n\u2502     - Key: gc-project-name                                               \u2502\n\u2502       Value: memorydb-simple                                             \u2502\n\u2502     - Key: gc-stage                                                      \u2502\n\u2502       Value: dev                                                         \u2502\n\u2502     - Key: Name                                                          \u2502\n\u2502       Value: subnet-group                                                \u2502\n\u2502                                                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 MemoryDB::SubnetGroup \u2502 subnet-group                                    \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t MemoryDB::SubnetGroup" executed in 3s, 100 MB\n')))}m.isMDXComponent=!0}}]);