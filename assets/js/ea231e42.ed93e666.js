"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[25847],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>d});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),c=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(l.Provider,{value:n},e.children)},u="mdxType",y={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(t),m=a,d=u["".concat(l,".").concat(m)]||u[m]||y[m]||o;return t?r.createElement(d,i(i({ref:n},p),{},{components:t})):r.createElement(d,i({ref:n},p))}));function d(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=m;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[u]="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},10750:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>y,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=t(87462),a=(t(67294),t(3905));const o={id:"Policy",title:"Policy"},i=void 0,s={unversionedId:"aws/resources/Organisations/Policy",id:"aws/resources/Organisations/Policy",title:"Policy",description:"Provides an Organisation Policy",source:"@site/docs/aws/resources/Organisations/Policy.md",sourceDirName:"aws/resources/Organisations",slug:"/aws/resources/Organisations/Policy",permalink:"/docs/aws/resources/Organisations/Policy",draft:!1,tags:[],version:"current",frontMatter:{id:"Policy",title:"Policy"},sidebar:"docs",previous:{title:"Organisational Unit",permalink:"/docs/aws/resources/Organisations/OrganisationalUnit"},next:{title:"Policy Attachment",permalink:"/docs/aws/resources/Organisations/PolicyAttachment"}},l={},c=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:3}],p={toc:c},u="wrapper";function y(e){let{components:n,...t}=e;return(0,a.kt)(u,(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides an ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/organizations/v2/home?#"},"Organisation Policy")),(0,a.kt)("p",null,"Create a service control policy:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Policy",\n    group: "Organisations",\n    properties: ({}) => ({\n      Content: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Sid: "Statement2",\n            Effect: "Allow",\n            Action: ["*"],\n            Resource: ["*"],\n          },\n        ],\n      },\n      Description: "",\n      Name: "my-policy",\n      Type: "SERVICE_CONTROL_POLICY",\n    }),\n  },\n];\n')),(0,a.kt)("p",null,"Create a tag policy:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Policy",\n    group: "Organisations",\n    properties: ({}) => ({\n      Content: {\n        tags: {\n          env: {\n            tag_value: {\n              "@@assign": ["prod", "dev"],\n            },\n          },\n        },\n      },\n      Description: "My tag policy",\n      Name: "my-tag-policy",\n      Type: "TAG_POLICY",\n    }),\n  },\n];\n')),(0,a.kt)("h3",{id:"examples"},"Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/Organisation/organisations-policy"},"simple example"))),(0,a.kt)("h3",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-organizations/interfaces/createpolicycommandinput.html"},"CreatePolicyCommandInput"))),(0,a.kt)("h3",{id:"dependencies"},"Dependencies"),(0,a.kt)("h3",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/PolicyAttachment"},"Organisation Policy Attachment"))),(0,a.kt)("h3",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Organisations::Policy\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 Organisations::Policy from aws                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: FullAWSAccess                                                      \u2502\n\u2502 managedByUs: NO                                                          \u2502\n\u2502 live:                                                                    \u2502\n\u2502   PolicyId: p-FullAWSAccess                                              \u2502\n\u2502   Content:                                                               \u2502\n\u2502     Version: 2012-10-17                                                  \u2502\n\u2502     Statement:                                                           \u2502\n\u2502       - Effect: Allow                                                    \u2502\n\u2502         Action: *                                                        \u2502\n\u2502         Resource: *                                                      \u2502\n\u2502   Arn: arn:aws:organizations::aws:policy/service_control_policy/p-FullA\u2026 \u2502\n\u2502   AwsManaged: true                                                       \u2502\n\u2502   Description: Allows access to every operation                          \u2502\n\u2502   Name: FullAWSAccess                                                    \u2502\n\u2502   Type: SERVICE_CONTROL_POLICY                                           \u2502\n\u2502                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-policy                                                          \u2502\n\u2502 managedByUs: Yes                                                         \u2502\n\u2502 live:                                                                    \u2502\n\u2502   PolicyId: p-8wt9duu3                                                   \u2502\n\u2502   Content:                                                               \u2502\n\u2502     Version: 2012-10-17                                                  \u2502\n\u2502     Statement:                                                           \u2502\n\u2502       - Sid: Statement2                                                  \u2502\n\u2502         Effect: Allow                                                    \u2502\n\u2502         Action:                                                          \u2502\n\u2502           - "*"                                                          \u2502\n\u2502         Resource:                                                        \u2502\n\u2502           - "*"                                                          \u2502\n\u2502   Arn: arn:aws:organizations::840541460064:policy/o-xs8pjirjbw/service_\u2026 \u2502\n\u2502   AwsManaged: false                                                      \u2502\n\u2502   Description:                                                           \u2502\n\u2502   Name: my-policy                                                        \u2502\n\u2502   Type: SERVICE_CONTROL_POLICY                                           \u2502\n\u2502   Tags:                                                                  \u2502\n\u2502     - Key: gc-created-by-provider                                        \u2502\n\u2502       Value: aws                                                         \u2502\n\u2502     - Key: gc-managed-by                                                 \u2502\n\u2502       Value: grucloud                                                    \u2502\n\u2502     - Key: gc-project-name                                               \u2502\n\u2502       Value: organisations-policy                                        \u2502\n\u2502     - Key: gc-stage                                                      \u2502\n\u2502       Value: dev                                                         \u2502\n\u2502     - Key: Name                                                          \u2502\n\u2502       Value: my-policy                                                   \u2502\n\u2502                                                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Organisations::Policy \u2502 FullAWSAccess                                   \u2502\n\u2502                       \u2502 my-policy                                       \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n2 resources, 1 type, 1 provider\nCommand "gc l -t Organisations::Policy" executed in 3s, 104 MB\n')))}y.isMDXComponent=!0}}]);