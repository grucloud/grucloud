"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[382],{3905:function(e,n,r){r.d(n,{Zo:function(){return u},kt:function(){return d}});var t=r(67294);function s(e,n,r){return n in e?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,e}function a(e,n){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),r.push.apply(r,t)}return r}function o(e){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?a(Object(r),!0).forEach((function(n){s(e,n,r[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(r,n))}))}return e}function i(e,n){if(null==e)return{};var r,t,s=function(e,n){if(null==e)return{};var r,t,s={},a=Object.keys(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||(s[r]=e[r]);return s}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(t=0;t<a.length;t++)r=a[t],n.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(s[r]=e[r])}return s}var l=t.createContext({}),c=function(e){var n=t.useContext(l),r=n;return e&&(r="function"==typeof e?e(n):o(o({},n),e)),r},u=function(e){var n=c(e.components);return t.createElement(l.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var r=e.components,s=e.mdxType,a=e.originalType,l=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),m=c(r),d=s,y=m["".concat(l,".").concat(d)]||m[d]||p[d]||a;return r?t.createElement(y,o(o({ref:n},u),{},{components:r})):t.createElement(y,o({ref:n},u))}));function d(e,n){var r=arguments,s=n&&n.mdxType;if("string"==typeof e||s){var a=r.length,o=new Array(a);o[0]=m;var i={};for(var l in n)hasOwnProperty.call(n,l)&&(i[l]=n[l]);i.originalType=e,i.mdxType="string"==typeof e?e:s,o[1]=i;for(var c=2;c<a;c++)o[c]=r[c];return t.createElement.apply(null,o)}return t.createElement.apply(null,r)}m.displayName="MDXCreateElement"},47990:function(e,n,r){r.r(n),r.d(n,{frontMatter:function(){return i},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return u},default:function(){return m}});var t=r(87462),s=r(63366),a=(r(67294),r(3905)),o=["components"],i={id:"User",title:"User"},l=void 0,c={unversionedId:"aws/resources/IAM/User",id:"aws/resources/IAM/User",isDocsHomePage:!1,title:"User",description:"Provides an Iam User",source:"@site/docs/aws/resources/IAM/User.md",sourceDirName:"aws/resources/IAM",slug:"/aws/resources/IAM/User",permalink:"/docs/aws/resources/IAM/User",tags:[],version:"current",frontMatter:{id:"User",title:"User"},sidebar:"docs",previous:{title:"Role",permalink:"/docs/aws/resources/IAM/Role"},next:{title:"Key",permalink:"/docs/aws/resources/KMS/Key"}},u=[{value:"Add a user to groups",id:"add-a-user-to-groups",children:[],level:3},{value:"Examples",id:"examples",children:[],level:3},{value:"Properties",id:"properties",children:[],level:3},{value:"Dependencies",id:"dependencies",children:[],level:3},{value:"List",id:"list",children:[],level:3},{value:"AWS CLI",id:"aws-cli",children:[],level:3}],p={toc:u};function m(e){var n=e.components,r=(0,s.Z)(e,o);return(0,a.kt)("wrapper",(0,t.Z)({},p,r,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Provides an Iam User"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "User",\n    group: "IAM",\n    name: "Alice",\n    properties: ({}) => ({\n      Path: "/",\n    }),\n    dependencies: () => ({\n      policies: ["myPolicy-to-user"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "myPolicy-to-user",\n    properties: ({}) => ({\n      PolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Action: ["s3:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n        ],\n      },\n      Path: "/",\n      Description: "Allow ec2:Describe",\n    }),\n  },\n];\n')),(0,a.kt)("h3",{id:"add-a-user-to-groups"},"Add a user to groups"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "User",\n    group: "IAM",\n    name: "Alice",\n    properties: ({}) => ({\n      Path: "/",\n    }),\n    dependencies: () => ({\n      iamGroups: ["Admin"],\n      policies: ["myPolicy-to-user"],\n    }),\n  },\n  {\n    type: "Group",\n    group: "IAM",\n    name: "Admin",\n    properties: ({}) => ({\n      Path: "/",\n    }),\n    dependencies: () => ({\n      policies: ["myPolicy-to-group"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "myPolicy-to-user",\n    properties: ({}) => ({\n      PolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Action: ["s3:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n        ],\n      },\n      Path: "/",\n      Description: "Allow ec2:Describe",\n    }),\n  },\n];\n')),(0,a.kt)("h3",{id:"examples"},"Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/examples/aws/IAM/iam"},"simple example"))),(0,a.kt)("h3",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/createusercommandinput.html"},"CreateUserCommandInput"))),(0,a.kt)("h3",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Group"},"Iam Group"))),(0,a.kt)("h3",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t User\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 2/2\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 IAM::User from aws                                             \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-test-user                                               \u2502\n\u2502 managedByUs: Yes                                                 \u2502\n\u2502 live:                                                            \u2502\n\u2502   Path: /                                                        \u2502\n\u2502   UserName: my-test-user                                         \u2502\n\u2502   UserId: AIDA4HNBM2ZQBULNO5DHK                                  \u2502\n\u2502   Arn: arn:aws:iam::840541460064:user/my-test-user               \u2502\n\u2502   CreateDate: 2022-03-09T03:50:15.000Z                           \u2502\n\u2502   Tags:                                                          \u2502\n\u2502     - Key: gc-created-by-provider                                \u2502\n\u2502       Value: aws                                                 \u2502\n\u2502     - Key: gc-managed-by                                         \u2502\n\u2502       Value: grucloud                                            \u2502\n\u2502     - Key: gc-project-name                                       \u2502\n\u2502       Value: iam-user                                            \u2502\n\u2502     - Key: gc-stage                                              \u2502\n\u2502       Value: dev                                                 \u2502\n\u2502     - Key: mytag                                                 \u2502\n\u2502       Value: myvalue                                             \u2502\n\u2502     - Key: Name                                                  \u2502\n\u2502       Value: my-test-user                                        \u2502\n\u2502   AttachedPolicies: []                                           \u2502\n\u2502   AccessKeys: []                                                 \u2502\n\u2502   Groups: []                                                     \u2502\n\u2502                                                                  \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                             \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 IAM::User \u2502 my-test-user                                        \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t User" executed in 5s, 209 MB\n')),(0,a.kt)("h3",{id:"aws-cli"},"AWS CLI"),(0,a.kt)("p",null,"List all iam users"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"aws iam list-users\n")),(0,a.kt)("p",null,"List the tags for a given user"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"aws iam list-user-tags --user-name Alice\n\n")),(0,a.kt)("p",null,"Delete a user:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"aws iam delete-user --user-name Alice\n")))}m.isMDXComponent=!0}}]);