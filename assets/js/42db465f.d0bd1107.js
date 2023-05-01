"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[21031],{3905:(e,r,n)=>{n.d(r,{Zo:()=>u,kt:()=>y});var t=n(67294);function a(e,r,n){return r in e?Object.defineProperty(e,r,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[r]=n,e}function s(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function o(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?s(Object(n),!0).forEach((function(r){a(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}function l(e,r){if(null==e)return{};var n,t,a=function(e,r){if(null==e)return{};var n,t,a={},s=Object.keys(e);for(t=0;t<s.length;t++)n=s[t],r.indexOf(n)>=0||(a[n]=e[n]);return a}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(t=0;t<s.length;t++)n=s[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var i=t.createContext({}),c=function(e){var r=t.useContext(i),n=r;return e&&(n="function"==typeof e?e(r):o(o({},r),e)),n},u=function(e){var r=c(e.components);return t.createElement(i.Provider,{value:r},e.children)},m="mdxType",p={inlineCode:"code",wrapper:function(e){var r=e.children;return t.createElement(t.Fragment,{},r)}},d=t.forwardRef((function(e,r){var n=e.components,a=e.mdxType,s=e.originalType,i=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=c(n),d=a,y=m["".concat(i,".").concat(d)]||m[d]||p[d]||s;return n?t.createElement(y,o(o({ref:r},u),{},{components:n})):t.createElement(y,o({ref:r},u))}));function y(e,r){var n=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var s=n.length,o=new Array(s);o[0]=d;var l={};for(var i in r)hasOwnProperty.call(r,i)&&(l[i]=r[i]);l.originalType=e,l[m]="string"==typeof e?e:a,o[1]=l;for(var c=2;c<s;c++)o[c]=n[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},10447:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>i,contentTitle:()=>o,default:()=>p,frontMatter:()=>s,metadata:()=>l,toc:()=>c});var t=n(87462),a=(n(67294),n(3905));const s={id:"User",title:"User"},o=void 0,l={unversionedId:"aws/resources/MemoryDB/User",id:"aws/resources/MemoryDB/User",title:"User",description:"Manages a MemoryDB User.",source:"@site/docs/aws/resources/MemoryDB/User.md",sourceDirName:"aws/resources/MemoryDB",slug:"/aws/resources/MemoryDB/User",permalink:"/docs/aws/resources/MemoryDB/User",draft:!1,tags:[],version:"current",frontMatter:{id:"User",title:"User"},sidebar:"docs",previous:{title:"SubnetGroup",permalink:"/docs/aws/resources/MemoryDB/SubnetGroup"},next:{title:"Network Firewall",permalink:"/docs/aws/resources/NetworkFirewall/NetworkFirewall"}},i={},c=[{value:"Example",id:"example",level:2},{value:"Code Examples",id:"code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Used By",id:"used-by",level:2},{value:"List",id:"list",level:2}],u={toc:c},m="wrapper";function p(e){let{components:r,...n}=e;return(0,a.kt)(m,(0,t.Z)({},u,n,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages a ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/memorydb/home?#/users"},"MemoryDB User"),"."),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "User",\n    group: "MemoryDB",\n    properties: ({}) => ({\n      AccessString: "on ~* &* +@all",\n      Name: "my-user",\n      AuthenticationMode: {\n        Passwords: JSON.parse(process.env.MY_USER_MEMORYDB_USER_PASSWORDS),\n      },\n    }),\n  },\n];\n')),(0,a.kt)("h2",{id:"code-examples"},"Code Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/MemoryDB/memorydb-simple"},"memorydb simple"))),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-memorydb/interfaces/createusercommandinput.html"},"CreateUserCommandInput"))),(0,a.kt)("h2",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/MemoryDB/ACL"},"MemoryDB ACL"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t MemoryDB::User\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 MemoryDB::User from aws                                                \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: default                                                            \u2502\n\u2502 managedByUs: NO                                                          \u2502\n\u2502 live:                                                                    \u2502\n\u2502   ACLNames:                                                              \u2502\n\u2502     - "open-access"                                                      \u2502\n\u2502   ARN: arn:aws:memorydb:us-east-1:840541460064:user/default              \u2502\n\u2502   AccessString: on ~* &* +@all                                           \u2502\n\u2502   Authentication:                                                        \u2502\n\u2502     Type: no-password                                                    \u2502\n\u2502   MinimumEngineVersion: 6.0                                              \u2502\n\u2502   Name: default                                                          \u2502\n\u2502   Status: active                                                         \u2502\n\u2502   Tags: []                                                               \u2502\n\u2502                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-user                                                            \u2502\n\u2502 managedByUs: Yes                                                         \u2502\n\u2502 live:                                                                    \u2502\n\u2502   ACLNames:                                                              \u2502\n\u2502     - "my-acl"                                                           \u2502\n\u2502   ARN: arn:aws:memorydb:us-east-1:840541460064:user/my-user              \u2502\n\u2502   AccessString: on ~* &* +@all                                           \u2502\n\u2502   Authentication:                                                        \u2502\n\u2502     PasswordCount: 1                                                     \u2502\n\u2502     Type: password                                                       \u2502\n\u2502   MinimumEngineVersion: 6.2                                              \u2502\n\u2502   Name: my-user                                                          \u2502\n\u2502   Status: active                                                         \u2502\n\u2502   Tags:                                                                  \u2502\n\u2502     - Key: gc-created-by-provider                                        \u2502\n\u2502       Value: aws                                                         \u2502\n\u2502     - Key: gc-managed-by                                                 \u2502\n\u2502       Value: grucloud                                                    \u2502\n\u2502     - Key: gc-project-name                                               \u2502\n\u2502       Value: memorydb-simple                                             \u2502\n\u2502     - Key: gc-stage                                                      \u2502\n\u2502       Value: dev                                                         \u2502\n\u2502     - Key: Name                                                          \u2502\n\u2502       Value: my-user                                                     \u2502\n\u2502                                                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 MemoryDB::User \u2502 default                                                \u2502\n\u2502                \u2502 my-user                                                \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t MemoryDB::User" executed in 3s, 100 MB\n\n')))}p.isMDXComponent=!0}}]);