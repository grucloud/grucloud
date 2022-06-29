"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[94967],{3905:(e,a,n)=>{n.d(a,{Zo:()=>u,kt:()=>m});var t=n(67294);function r(e,a,n){return a in e?Object.defineProperty(e,a,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[a]=n,e}function o(e,a){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);a&&(t=t.filter((function(a){return Object.getOwnPropertyDescriptor(e,a).enumerable}))),n.push.apply(n,t)}return n}function l(e){for(var a=1;a<arguments.length;a++){var n=null!=arguments[a]?arguments[a]:{};a%2?o(Object(n),!0).forEach((function(a){r(e,a,n[a])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(a){Object.defineProperty(e,a,Object.getOwnPropertyDescriptor(n,a))}))}return e}function i(e,a){if(null==e)return{};var n,t,r=function(e,a){if(null==e)return{};var n,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)n=o[t],a.indexOf(n)>=0||(r[n]=e[n]);return r}(e,a);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)n=o[t],a.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var s=t.createContext({}),c=function(e){var a=t.useContext(s),n=a;return e&&(n="function"==typeof e?e(a):l(l({},a),e)),n},u=function(e){var a=c(e.components);return t.createElement(s.Provider,{value:a},e.children)},p={inlineCode:"code",wrapper:function(e){var a=e.children;return t.createElement(t.Fragment,{},a)}},d=t.forwardRef((function(e,a){var n=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=c(n),m=r,f=d["".concat(s,".").concat(m)]||d[m]||p[m]||o;return n?t.createElement(f,l(l({ref:a},u),{},{components:n})):t.createElement(f,l({ref:a},u))}));function m(e,a){var n=arguments,r=a&&a.mdxType;if("string"==typeof e||r){var o=n.length,l=new Array(o);l[0]=d;var i={};for(var s in a)hasOwnProperty.call(a,s)&&(i[s]=a[s]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var c=2;c<o;c++)l[c]=n[c];return t.createElement.apply(null,l)}return t.createElement.apply(null,n)}d.displayName="MDXCreateElement"},70368:(e,a,n)=>{n.r(a),n.d(a,{assets:()=>s,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var t=n(87462),r=(n(67294),n(3905));const o={id:"Function",title:"Function"},l=void 0,i={unversionedId:"aws/resources/Lambda/Function",id:"aws/resources/Lambda/Function",title:"Function",description:"Provides an Lambda Function",source:"@site/docs/aws/resources/Lambda/Function.md",sourceDirName:"aws/resources/Lambda",slug:"/aws/resources/Lambda/Function",permalink:"/docs/aws/resources/Lambda/Function",draft:!1,tags:[],version:"current",frontMatter:{id:"Function",title:"Function"},sidebar:"docs",previous:{title:"Event Source Mapping",permalink:"/docs/aws/resources/Lambda/EventSourceMapping"},next:{title:"Layer",permalink:"/docs/aws/resources/Lambda/Layer"}},s={},c=[{value:"Examples",id:"examples",level:2},{value:"Create a Lambda Function",id:"create-a-lambda-function",level:3},{value:"Source Code Examples",id:"source-code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"UsedBy",id:"usedby",level:2},{value:"List",id:"list",level:2}],u={toc:c};function p(e){let{components:a,...n}=e;return(0,r.kt)("wrapper",(0,t.Z)({},u,n,{components:a,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Provides an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/lambda/home"},"Lambda Function")),(0,r.kt)("h2",{id:"examples"},"Examples"),(0,r.kt)("h3",{id:"create-a-lambda-function"},"Create a Lambda Function"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Role",\n    group: "IAM",\n    name: "lambda-role",\n    properties: ({}) => ({\n      Path: "/",\n      AssumeRolePolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Sid: "",\n            Effect: "Allow",\n            Principal: {\n              Service: "lambda.amazonaws.com",\n            },\n            Action: "sts:AssumeRole",\n          },\n        ],\n      },\n    }),\n    dependencies: () => ({\n      policies: ["lambda-policy"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "lambda-policy",\n    properties: ({}) => ({\n      PolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Action: ["logs:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n          {\n            Action: ["sqs:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n        ],\n      },\n      Path: "/",\n      Description: "Allow logs",\n    }),\n  },\n  {\n    type: "Function",\n    group: "Lambda",\n    name: "lambda-hello-world",\n    properties: ({}) => ({\n      Configuration: {\n        Handler: "helloworld.handler",\n        Runtime: "nodejs14.x",\n      },\n    }),\n    dependencies: () => ({\n      role: "lambda-role",\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/example/aws/Lambda/nodejs/helloworld"},"hello world lambda"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/example/aws/api-gateway/lambda"},"lambda called by an Api gateway"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/example/aws/serverless-patterns/xray-lambdalayers-cdk-python"},"lambda triggered by a write to an S3 Bucket")))),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createfunctioncommandinput.html"},"CreateFunctionCommandInput"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Lambda/Layer"},"Layer")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"Iam Role")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/SecretsManager/Secret"},"SecretsManager Secret")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/RDS/DBCluster"},"RDS Cluster")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/DynamoDB/Table"},"DynamoDB Table")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/GraphqlApi"},"AppSync Graphql")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/EFS/MountTarget"},"EFS MountTarget"))),(0,r.kt)("h2",{id:"usedby"},"UsedBy"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/Integration"},"ApiGateway Integration")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Bucket"},"S3 Bucket"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"The list of functions can be displayed and filtered with the type ",(0,r.kt)("strong",{parentName:"p"},"Function"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t Function\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 Lambda::Function from aws                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: LambdaLayerXRayStackStack-BucketNotificationsHandl-1XcDZ1\u2026 \u2502\n\u2502 managedByUs: Yes                                                 \u2502\n\u2502 live:                                                            \u2502\n\u2502   Configuration:                                                 \u2502\n\u2502     Architectures:                                               \u2502\n\u2502       - "x86_64"                                                 \u2502\n\u2502     CodeSha256: hzxBwXE8vF5htCF3abiYzTqjRnM2KRxbveRsojrrXhs=     \u2502\n\u2502     CodeSize: 1337                                               \u2502\n\u2502     Description: AWS CloudFormation handler for "Custom::S3Buck\u2026 \u2502\n\u2502     EphemeralStorage:                                            \u2502\n\u2502       Size: 512                                                  \u2502\n\u2502     FunctionArn: arn:aws:lambda:us-east-1:840541460064:function\u2026 \u2502\n\u2502     FunctionName: LambdaLayerXRayStackStack-BucketNotifications\u2026 \u2502\n\u2502     Handler: index.handler                                       \u2502\n\u2502     LastModified: 2022-04-17T18:32:29.881+0000                   \u2502\n\u2502     LastUpdateStatus: Successful                                 \u2502\n\u2502     MemorySize: 128                                              \u2502\n\u2502     PackageType: Zip                                             \u2502\n\u2502     RevisionId: fee4d397-44a6-4dfe-b070-9b0c8204d012             \u2502\n\u2502     Role: arn:aws:iam::840541460064:role/LambdaLayerXRayStackSt\u2026 \u2502\n\u2502     Runtime: python3.7                                           \u2502\n\u2502     State: Active                                                \u2502\n\u2502     Timeout: 300                                                 \u2502\n\u2502     TracingConfig:                                               \u2502\n\u2502       Mode: PassThrough                                          \u2502\n\u2502     Version: $LATEST                                             \u2502\n\u2502   Code:                                                          \u2502\n\u2502     Location: https://prod-04-2014-tasks.s3.us-east-1.amazonaws\u2026 \u2502\n\u2502     RepositoryType: S3                                           \u2502\n\u2502   Tags:                                                          \u2502\n\u2502     aws:cloudformation:stack-name: LambdaLayerXRayStackStack     \u2502\n\u2502     gc-project-name: xray-lambdalayers-cdk-python                \u2502\n\u2502     aws:cloudformation:stack-id: arn:aws:cloudformation:us-east\u2026 \u2502\n\u2502     aws:cloudformation:logical-id: BucketNotificationsHandler05\u2026 \u2502\n\u2502     gc-managed-by: grucloud                                      \u2502\n\u2502     gc-stage: dev                                                \u2502\n\u2502     gc-created-by-provider: aws                                  \u2502\n\u2502     Name: LambdaLayerXRayStackStack-BucketNotificationsHandl-1X\u2026 \u2502\n\u2502                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n')))}p.isMDXComponent=!0}}]);