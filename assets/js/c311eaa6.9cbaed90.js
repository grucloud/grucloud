"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[65311],{3905:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>d});var r=t(67294);function o(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){o(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function c(e,n){if(null==e)return{};var t,r,o=function(e,n){if(null==e)return{};var t,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(o[t]=e[t]);return o}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(o[t]=e[t])}return o}var i=r.createContext({}),s=function(e){var n=r.useContext(i),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},p=function(e){var n=s(e.components);return r.createElement(i.Provider,{value:n},e.children)},u="mdxType",y={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},m=r.forwardRef((function(e,n){var t=e.components,o=e.mdxType,a=e.originalType,i=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=s(t),m=o,d=u["".concat(i,".").concat(m)]||u[m]||y[m]||a;return t?r.createElement(d,l(l({ref:n},p),{},{components:t})):r.createElement(d,l({ref:n},p))}));function d(e,n){var t=arguments,o=n&&n.mdxType;if("string"==typeof e||o){var a=t.length,l=new Array(a);l[0]=m;var c={};for(var i in n)hasOwnProperty.call(n,i)&&(c[i]=n[i]);c.originalType=e,c[u]="string"==typeof e?e:o,l[1]=c;for(var s=2;s<a;s++)l[s]=t[s];return r.createElement.apply(null,l)}return r.createElement.apply(null,t)}m.displayName="MDXCreateElement"},47704:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>l,default:()=>y,frontMatter:()=>a,metadata:()=>c,toc:()=>s});var r=t(87462),o=(t(67294),t(3905));const a={id:"Policy",title:"Policy"},l=void 0,c={unversionedId:"aws/resources/IAM/Policy",id:"aws/resources/IAM/Policy",title:"Policy",description:"Provides an Iam Policy.",source:"@site/docs/aws/resources/IAM/Policy.md",sourceDirName:"aws/resources/IAM",slug:"/aws/resources/IAM/Policy",permalink:"/docs/aws/resources/IAM/Policy",draft:!1,tags:[],version:"current",frontMatter:{id:"Policy",title:"Policy"},sidebar:"docs",previous:{title:"OpenIDConnectProvider",permalink:"/docs/aws/resources/IAM/OpenIDConnectProvider"},next:{title:"Role",permalink:"/docs/aws/resources/IAM/Role"}},i={},s=[{value:"Attach a policy to a role",id:"attach-a-policy-to-a-role",level:3},{value:"Attach a read only policy to a role",id:"attach-a-read-only-policy-to-a-role",level:3},{value:"Attach a policy to a user",id:"attach-a-policy-to-a-user",level:3},{value:"Attach a policy to a group",id:"attach-a-policy-to-a-group",level:3},{value:"Examples",id:"examples",level:3},{value:"Properties",id:"properties",level:3},{value:"Used By",id:"used-by",level:3},{value:"List",id:"list",level:3}],p={toc:s},u="wrapper";function y(e){let{components:n,...t}=e;return(0,o.kt)(u,(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides an Iam Policy."),(0,o.kt)("p",null,"The examples below create or reference a policy, and add it to a role, a user or a group."),(0,o.kt)("h3",{id:"attach-a-policy-to-a-role"},"Attach a policy to a role"),(0,o.kt)("p",null,"Let's create a policy and a user, the policy is attached to the user via the ",(0,o.kt)("em",{parentName:"p"},"dependencies")," field:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "policy-allow-ec2",\n    properties: ({}) => ({\n      PolicyName: "policy-allow-ec2",\n      PolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Action: ["s3:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n          {\n            Action: ["sqs:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n        ],\n      },\n      Path: "/",\n      Description: "Allow ec2:Describe",\n    }),\n  },\n];\n')),(0,o.kt)("h3",{id:"attach-a-read-only-policy-to-a-role"},"Attach a read only policy to a role"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "service-role/AmazonEC2ContainerServiceforEC2Role",\n    readOnly: true,\n    properties: ({}) => ({\n      Arn: "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role",\n    }),\n  },\n];\n')),(0,o.kt)("h3",{id:"attach-a-policy-to-a-user"},"Attach a policy to a user"),(0,o.kt)("p",null,"Let's create a policy and attach it to the user:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "User",\n    group: "IAM",\n    name: "Alice",\n    properties: ({}) => ({\n      Path: "/",\n    }),\n    dependencies: () => ({\n      policies: ["myPolicy-to-user"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "myPolicy-to-user",\n    properties: ({}) => ({\n      PolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Action: ["s3:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n        ],\n      },\n      Path: "/",\n      Description: "Allow ec2:Describe",\n    }),\n  },\n];\n')),(0,o.kt)("h3",{id:"attach-a-policy-to-a-group"},"Attach a policy to a group"),(0,o.kt)("p",null,"Let's create a policy and attach it to the group:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Group",\n    group: "IAM",\n    name: "Admin",\n    properties: ({}) => ({\n      Path: "/",\n    }),\n    dependencies: () => ({\n      policies: ["myPolicy-to-group"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "myPolicy-to-group",\n    properties: ({}) => ({\n      PolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Action: ["s3:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n        ],\n      },\n      Path: "/",\n      Description: "Allow ec2:Describe",\n    }),\n  },\n];\n')),(0,o.kt)("h3",{id:"examples"},"Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/IAM/iam-policy/"},"Policies attached to a role")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/IAM/iam"},"Policies attached to roles, users and groups"))),(0,o.kt)("h3",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/createpolicycommandinput.html"},"CreatePolicyCommandInput"))),(0,o.kt)("h3",{id:"used-by"},"Used By"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"Iam Role")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/User"},"Iam User")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Group"},"Iam Group"))),(0,o.kt)("h3",{id:"list"},"List"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Policy\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-txts"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 IAM::Policy from aws                                           \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: policy-allow-ec2                                           \u2502\n\u2502 managedByUs: Yes                                                 \u2502\n\u2502 live:                                                            \u2502\n\u2502   PolicyName: policy-allow-ec2                                   \u2502\n\u2502   PolicyId: ANPA4HNBM2ZQAGCMR7RQ7                                \u2502\n\u2502   Arn: arn:aws:iam::840541460064:policy/policy-allow-ec2         \u2502\n\u2502   Path: /                                                        \u2502\n\u2502   DefaultVersionId: v1                                           \u2502\n\u2502   AttachmentCount: 1                                             \u2502\n\u2502   PermissionsBoundaryUsageCount: 0                               \u2502\n\u2502   IsAttachable: true                                             \u2502\n\u2502   Description: Allow ec2:Describe                                \u2502\n\u2502   CreateDate: 2022-03-09T03:27:14.000Z                           \u2502\n\u2502   UpdateDate: 2022-03-09T03:27:14.000Z                           \u2502\n\u2502   Tags:                                                          \u2502\n\u2502     - Key: gc-created-by-provider                                \u2502\n\u2502       Value: aws                                                 \u2502\n\u2502     - Key: gc-managed-by                                         \u2502\n\u2502       Value: grucloud                                            \u2502\n\u2502     - Key: gc-project-name                                       \u2502\n\u2502       Value: @grucloud/example-aws-iam-policy                    \u2502\n\u2502     - Key: gc-stage                                              \u2502\n\u2502       Value: dev                                                 \u2502\n\u2502     - Key: Name                                                  \u2502\n\u2502       Value: policy-allow-ec2                                    \u2502\n\u2502   Versions:                                                      \u2502\n\u2502     -                                                            \u2502\n\u2502       VersionId: v1                                              \u2502\n\u2502       IsDefaultVersion: true                                     \u2502\n\u2502       CreateDate: 2022-03-09T03:27:14.000Z                       \u2502\n\u2502   EntitiesForPolicy:                                             \u2502\n\u2502     PolicyGroups: []                                             \u2502\n\u2502     PolicyUsers: []                                              \u2502\n\u2502     PolicyRoles:                                                 \u2502\n\u2502       - RoleName: role-4-policies                                \u2502\n\u2502         RoleId: AROA4HNBM2ZQKH7QZEALS                            \u2502\n\u2502   PolicyDocument:                                                \u2502\n\u2502     Version: 2012-10-17                                          \u2502\n\u2502     Statement:                                                   \u2502\n\u2502       - Action:                                                  \u2502\n\u2502           - "s3:*"                                               \u2502\n\u2502         Effect: Allow                                            \u2502\n\u2502         Resource: *                                              \u2502\n\u2502       - Action:                                                  \u2502\n\u2502           - "sqs:*"                                              \u2502\n\u2502         Effect: Allow                                            \u2502\n\u2502         Resource: *                                              \u2502\n\u2502                                                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                             \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 IAM::Policy \u2502 policy-allow-ec2                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Policy" executed in 5s, 143 MB\n')))}y.isMDXComponent=!0}}]);