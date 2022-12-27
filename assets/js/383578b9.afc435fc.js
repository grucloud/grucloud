"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4172],{3905:(e,n,r)=>{r.d(n,{Zo:()=>l,kt:()=>m});var t=r(67294);function o(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function c(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function a(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?c(Object(r),!0).forEach((function(n){o(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function p(e,n){if(null==e)return{};var r,t,o=function(e,n){if(null==e)return{};var r,t,o={},c=Object.keys(e);for(t=0;t<c.length;t++)r=c[t],n.indexOf(r)>=0||(o[r]=e[r]);return o}(e,n);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(t=0;t<c.length;t++)r=c[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=t.createContext({}),u=function(e){var n=t.useContext(s),r=n;return e&&(r="function"==typeof e?e(n):a(a({},n),e)),r},l=function(e){var n=u(e.components);return t.createElement(s.Provider,{value:n},e.children)},i={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var r=e.components,o=e.mdxType,c=e.originalType,s=e.parentName,l=p(e,["components","mdxType","originalType","parentName"]),d=u(r),m=o,f=d["".concat(s,".").concat(m)]||d[m]||i[m]||c;return r?t.createElement(f,a(a({ref:n},l),{},{components:r})):t.createElement(f,a({ref:n},l))}));function m(e,n){var r=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var c=r.length,a=new Array(c);a[0]=d;var p={};for(var s in n)hasOwnProperty.call(n,s)&&(p[s]=n[s]);p.originalType=e,p.mdxType="string"==typeof e?e:o,a[1]=p;for(var u=2;u<c;u++)a[u]=r[u];return t.createElement.apply(null,a)}return t.createElement.apply(null,r)}d.displayName="MDXCreateElement"},310:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>s,contentTitle:()=>a,default:()=>i,frontMatter:()=>c,metadata:()=>p,toc:()=>u});var t=r(87462),o=(r(67294),r(3905));const c={id:"VpcConnector",title:"VpcConnector"},a=void 0,p={unversionedId:"aws/resources/AppRunner/VpcConnector",id:"aws/resources/AppRunner/VpcConnector",title:"VpcConnector",description:"Provides an AppRunner VpcConnector.",source:"@site/docs/aws/resources/AppRunner/VpcConnector.md",sourceDirName:"aws/resources/AppRunner",slug:"/aws/resources/AppRunner/VpcConnector",permalink:"/docs/aws/resources/AppRunner/VpcConnector",draft:!1,tags:[],version:"current",frontMatter:{id:"VpcConnector",title:"VpcConnector"},sidebar:"docs",previous:{title:"Service",permalink:"/docs/aws/resources/AppRunner/Service"},next:{title:"VpcIngressConnection",permalink:"/docs/aws/resources/AppRunner/VpcIngressConnection"}},s={},u=[{value:"Examples",id:"examples",level:2},{value:"Source Code Examples",id:"source-code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"List",id:"list",level:2}],l={toc:u};function i(e){let{components:n,...r}=e;return(0,o.kt)("wrapper",(0,t.Z)({},l,r,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides an AppRunner VpcConnector."),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "VpcConnector",\n    group: "AppRunner",\n    properties: ({}) => ({\n      VpcConnectorName: "connector",\n      VpcConnectorRevision: 1,\n    }),\n    dependencies: ({}) => ({\n      subnets: [\n        "vpc-default::subnet-default-a",\n        "vpc-default::subnet-default-b",\n      ],\n      securityGroups: ["sg::vpc-default::default"],\n    }),\n  },\n];\n')),(0,o.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/AppRunner/apprunner-leaderboard/resources.js"},"apprunner-leaderboard"))),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apprunner/interfaces/createvpcconnectorcommandinput.html"},"CreateVpcConnectorCommandInput"))),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"EC2 SecurityGroup")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"EC2 Subnet"))),(0,o.kt)("h2",{id:"list"},"List"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t AppRunner::VpcConnector\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 AppRunner::VpcConnector from aws                                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: connector                                                                  \u2502\n\u2502 managedByUs: Yes                                                                 \u2502\n\u2502 live:                                                                            \u2502\n\u2502   CreatedAt: 2022-11-01T22:49:21.000Z                                            \u2502\n\u2502   SecurityGroups:                                                                \u2502\n\u2502     - "sg-4e82a670"                                                              \u2502\n\u2502   Status: ACTIVE                                                                 \u2502\n\u2502   Subnets:                                                                       \u2502\n\u2502     - "subnet-b80a4ff5"                                                          \u2502\n\u2502     - "subnet-df1ea980"                                                          \u2502\n\u2502   VpcConnectorArn: arn:aws:apprunner:us-east-1:840541460064:vpcconnector/connec\u2026 \u2502\n\u2502   VpcConnectorName: connector                                                    \u2502\n\u2502   VpcConnectorRevision: 1                                                        \u2502\n\u2502   Tags:                                                                          \u2502\n\u2502     - Key: gc-created-by-provider                                                \u2502\n\u2502       Value: aws                                                                 \u2502\n\u2502     - Key: gc-managed-by                                                         \u2502\n\u2502       Value: grucloud                                                            \u2502\n\u2502     - Key: gc-project-name                                                       \u2502\n\u2502       Value: apprunner-leaderboard                                               \u2502\n\u2502     - Key: gc-stage                                                              \u2502\n\u2502       Value: dev                                                                 \u2502\n\u2502     - Key: Name                                                                  \u2502\n\u2502       Value: connector                                                           \u2502\n\u2502                                                                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                             \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 AppRunner::VpcConnector \u2502 connector                                             \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc list -t AppRunner::VpcConnector" executed in 4s, 105 MB\n\n')))}i.isMDXComponent=!0}}]);