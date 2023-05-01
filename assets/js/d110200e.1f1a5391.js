"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[17867],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>d});var a=t(67294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);n&&(a=a.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,a)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,a,r=function(e,n){if(null==e)return{};var t,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)t=o[a],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var c=a.createContext({}),l=function(e){var n=a.useContext(c),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=l(e.components);return a.createElement(c.Provider,{value:n},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var n=e.children;return a.createElement(a.Fragment,{},n)}},y=a.forwardRef((function(e,n){var t=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=l(t),y=r,d=u["".concat(c,".").concat(y)]||u[y]||m[y]||o;return t?a.createElement(d,i(i({ref:n},p),{},{components:t})):a.createElement(d,i({ref:n},p))}));function d(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=t.length,i=new Array(o);i[0]=y;var s={};for(var c in n)hasOwnProperty.call(n,c)&&(s[c]=n[c]);s.originalType=e,s[u]="string"==typeof e?e:r,i[1]=s;for(var l=2;l<o;l++)i[l]=t[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,t)}y.displayName="MDXCreateElement"},42092:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var a=t(87462),r=(t(67294),t(3905));const o={id:"PolicyAttachment",title:"Policy Attachment"},i=void 0,s={unversionedId:"aws/resources/Organisations/PolicyAttachment",id:"aws/resources/Organisations/PolicyAttachment",title:"Policy Attachment",description:"Provides an Organisation Policy Attachment",source:"@site/docs/aws/resources/Organisations/PolicyAttachment.md",sourceDirName:"aws/resources/Organisations",slug:"/aws/resources/Organisations/PolicyAttachment",permalink:"/docs/aws/resources/Organisations/PolicyAttachment",draft:!1,tags:[],version:"current",frontMatter:{id:"PolicyAttachment",title:"Policy Attachment"},sidebar:"docs",previous:{title:"Policy",permalink:"/docs/aws/resources/Organisations/Policy"},next:{title:"Root",permalink:"/docs/aws/resources/Organisations/Root"}},c={},l=[{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Dependencies",id:"dependencies",level:3},{value:"List",id:"list",level:3}],p={toc:l},u="wrapper";function m(e){let{components:n,...t}=e;return(0,r.kt)(u,(0,a.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Provides an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/organizations/v2/home?#"},"Organisation Policy Attachment")),(0,r.kt)("p",null,"Attach a policy to an organisational unit:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PolicyAttachment",\n    group: "Organisations",\n    dependencies: ({}) => ({\n      policy: "my-policy",\n      organisationalUnit: "my-ou",\n    }),\n  },\n];\n')),(0,r.kt)("p",null,"Attach a policy to an account:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "PolicyAttachment",\n    group: "Organisations",\n    dependencies: ({}) => ({\n      policy: "my-policy",\n      account: "test account",\n    }),\n  },\n];\n')),(0,r.kt)("h3",{id:"examples"},"Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/Organisation/organisations-policy"},"simple example"))),(0,r.kt)("h3",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-organizations/interfaces/attachpolicycommandinput.html"},"AttachPolicyCommandInput"))),(0,r.kt)("h3",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/Policy"},"Organisations Policy")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/Account"},"Organisations Account")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/Root"},"Organisations Root")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Organisations/OrganisationalUnit"},"Organisations Organisational Unit"))),(0,r.kt)("h3",{id:"list"},"List"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Organisations::PolicyAttachment\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 4/4\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 9 Organisations::PolicyAttachment from aws                               \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 managedByUs: NO                                                          \u2502\n\u2502 live:                                                                    \u2502\n\u2502   Arn: arn:aws:organizations::840541460065:account/o-xs8pjirjbw/1614084\u2026 \u2502\n\u2502   Name: grucloud app                                                     \u2502\n\u2502   TargetId: 161408406883                                                 \u2502\n\u2502   Type: ACCOUNT                                                          \u2502\n\u2502   PolicyId: p-FullAWSAccess                                              \u2502\n\u2502                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: policy-attach::FullAWSAccess::my-ou                                \u2502\n\u2502 managedByUs: NO                                                          \u2502\n\u2502 live:                                                                    \u2502\n\u2502   Arn: arn:aws:organizations::840541460065:ou/o-xs8pjirjbw/ou-941x-ad28\u2026 \u2502\n\u2502   Name: my-ou                                                            \u2502\n\u2502   TargetId: ou-941x-ad28nn1v                                             \u2502\n\u2502   Type: ORGANIZATIONAL_UNIT                                              \u2502\n\u2502   PolicyId: p-FullAWSAccess                                              \u2502\n\u2502                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: policy-attach::FullAWSAccess::myapp-uat                            \u2502\n\u2502 managedByUs: NO                                                          \u2502\n\u2502 live:                                                                    \u2502\n\u2502   Arn: arn:aws:organizations::840541460065:ou/o-xs8pjirjbw/ou-941x-kf4a\u2026 \u2502\n\u2502   Name: myapp-uat                                                        \u2502\n\u2502   TargetId: ou-941x-kf4a0pm7                                             \u2502\n\u2502   Type: ORGANIZATIONAL_UNIT                                              \u2502\n\u2502   PolicyId: p-FullAWSAccess                                              \u2502\n\u2502                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: policy-attach::FullAWSAccess::Root                                 \u2502\n\u2502 managedByUs: NO                                                          \u2502\n\u2502 live:                                                                    \u2502\n\u2502   Arn: arn:aws:organizations::840541460065:root/o-xs8pjirjbw/r-941x      \u2502\n\u2502   Name: Root                                                             \u2502\n\u2502   TargetId: r-941x                                                       \u2502\n\u2502   Type: ROOT                                                             \u2502\n\u2502   PolicyId: p-FullAWSAccess                                              \u2502\n\u2502                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: policy-attach::my-policy::my-ou                                    \u2502\n\u2502 managedByUs: Yes                                                         \u2502\n\u2502 live:                                                                    \u2502\n\u2502   Arn: arn:aws:organizations::840541460065:ou/o-xs8pjirjbw/ou-941x-ad28\u2026 \u2502\n\u2502   Name: my-ou                                                            \u2502\n\u2502   TargetId: ou-941x-ad28nn1v                                             \u2502\n\u2502   Type: ORGANIZATIONAL_UNIT                                              \u2502\n\u2502   PolicyId: p-8wt9duu3                                                   \u2502\n\u2502                                                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                     \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Organisations::PolicyAttachment \u2502 policy-attach::FullAWSAccess::161408\u2026 \u2502\n\u2502                                 \u2502 policy-attach::FullAWSAccess::my-ou   \u2502\n\u2502                                 \u2502 policy-attach::FullAWSAccess::Root    \u2502\n\u2502                                 \u2502 policy-attach::my-policy::my-ou       \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n9 resources, 1 type, 1 provider\nCommand "gc l -t Organisations::PolicyAttachment" executed in 8s, 101 MB\n')))}m.isMDXComponent=!0}}]);