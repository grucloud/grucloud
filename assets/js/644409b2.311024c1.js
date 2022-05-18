"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4967],{3905:function(e,n,a){a.d(n,{Zo:function(){return u},kt:function(){return m}});var t=a(67294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function o(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function i(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?o(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function l(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var c=t.createContext({}),s=function(e){var n=t.useContext(c),a=n;return e&&(a="function"==typeof e?e(n):i(i({},n),e)),a},u=function(e){var n=s(e.components);return t.createElement(c.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},d=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,o=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=s(a),m=r,f=d["".concat(c,".").concat(m)]||d[m]||p[m]||o;return a?t.createElement(f,i(i({ref:n},u),{},{components:a})):t.createElement(f,i({ref:n},u))}));function m(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=d;var l={};for(var c in n)hasOwnProperty.call(n,c)&&(l[c]=n[c]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var s=2;s<o;s++)i[s]=a[s];return t.createElement.apply(null,i)}return t.createElement.apply(null,a)}d.displayName="MDXCreateElement"},70368:function(e,n,a){a.r(n),a.d(n,{frontMatter:function(){return l},contentTitle:function(){return c},metadata:function(){return s},toc:function(){return u},default:function(){return d}});var t=a(87462),r=a(63366),o=(a(67294),a(3905)),i=["components"],l={id:"Function",title:"Function"},c=void 0,s={unversionedId:"aws/resources/Lambda/Function",id:"aws/resources/Lambda/Function",isDocsHomePage:!1,title:"Function",description:"Provides an Lambda Function",source:"@site/docs/aws/resources/Lambda/Function.md",sourceDirName:"aws/resources/Lambda",slug:"/aws/resources/Lambda/Function",permalink:"/docs/aws/resources/Lambda/Function",tags:[],version:"current",frontMatter:{id:"Function",title:"Function"},sidebar:"docs",previous:{title:"Event Source Mapping",permalink:"/docs/aws/resources/Lambda/EventSourceMapping"},next:{title:"Layer",permalink:"/docs/aws/resources/Lambda/Layer"}},u=[{value:"Examples",id:"examples",children:[{value:"Create a Lambda Function",id:"create-a-lambda-function",children:[],level:3}],level:2},{value:"Source Code Examples",id:"source-code-examples",children:[],level:2},{value:"Properties",id:"properties",children:[],level:2},{value:"Dependencies",id:"dependencies",children:[],level:2},{value:"UsedBy",id:"usedby",children:[],level:2},{value:"List",id:"list",children:[],level:2}],p={toc:u};function d(e){var n=e.components,a=(0,r.Z)(e,i);return(0,o.kt)("wrapper",(0,t.Z)({},p,a,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Provides an ",(0,o.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/lambda/home"},"Lambda Function")),(0,o.kt)("h2",{id:"examples"},"Examples"),(0,o.kt)("h3",{id:"create-a-lambda-function"},"Create a Lambda Function"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Role",\n    group: "IAM",\n    name: "lambda-role",\n    properties: ({}) => ({\n      Path: "/",\n      AssumeRolePolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Sid: "",\n            Effect: "Allow",\n            Principal: {\n              Service: "lambda.amazonaws.com",\n            },\n            Action: "sts:AssumeRole",\n          },\n        ],\n      },\n    }),\n    dependencies: () => ({\n      policies: ["lambda-policy"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "lambda-policy",\n    properties: ({}) => ({\n      PolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Action: ["logs:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n          {\n            Action: ["sqs:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n        ],\n      },\n      Path: "/",\n      Description: "Allow logs",\n    }),\n  },\n  {\n    type: "Function",\n    group: "Lambda",\n    name: "lambda-hello-world",\n    properties: ({}) => ({\n      Configuration: {\n        Handler: "helloworld.handler",\n        Runtime: "nodejs14.x",\n      },\n    }),\n    dependencies: () => ({\n      role: "lambda-role",\n    }),\n  },\n];\n')),(0,o.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/example/aws/Lambda/nodejs/helloworld"},"hello world lambda"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/example/aws/api-gateway/lambda"},"lambda called by an Api gateway"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("p",{parentName:"li"},(0,o.kt)("a",{parentName:"p",href:"https://github.com/grucloud/grucloud/blob/main/example/aws/serverless-patterns/xray-lambdalayers-cdk-python"},"lambda triggered by a write to an S3 Bucket")))),(0,o.kt)("h2",{id:"properties"},"Properties"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createfunctioncommandinput.html"},"CreateFunctionCommandInput"))),(0,o.kt)("h2",{id:"dependencies"},"Dependencies"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/Lambda/Layer"},"Layer")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"Iam Role")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"../SecretsManager/Secrets.md"},"SecretsManager Secret")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"../RDS/Cluster.md"},"RDS Cluster")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"../DynampDB/Table.md"},"DynamoDB Table")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/GraphqlApi"},"AppSync Graphql")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"../EFS/MountPoint.md"},"EFS MountPoint"))),(0,o.kt)("h2",{id:"usedby"},"UsedBy"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/ApiGatewayV2/Integration"},"ApiGateway Integration")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Bucket"},"S3 Bucket"))),(0,o.kt)("h2",{id:"list"},"List"),(0,o.kt)("p",null,"The list of functions can be displayed and filtered with the type ",(0,o.kt)("strong",{parentName:"p"},"Function"),":"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t Function\n")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-txt"},'\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 2 Lambda::Function from aws                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: LambdaLayerXRayStackStack-BucketNotificationsHandl-1XcDZ1\u2026 \u2502\n\u2502 managedByUs: Yes                                                 \u2502\n\u2502 live:                                                            \u2502\n\u2502   Configuration:                                                 \u2502\n\u2502     Architectures:                                               \u2502\n\u2502       - "x86_64"                                                 \u2502\n\u2502     CodeSha256: hzxBwXE8vF5htCF3abiYzTqjRnM2KRxbveRsojrrXhs=     \u2502\n\u2502     CodeSize: 1337                                               \u2502\n\u2502     Description: AWS CloudFormation handler for "Custom::S3Buck\u2026 \u2502\n\u2502     EphemeralStorage:                                            \u2502\n\u2502       Size: 512                                                  \u2502\n\u2502     FunctionArn: arn:aws:lambda:us-east-1:840541460064:function\u2026 \u2502\n\u2502     FunctionName: LambdaLayerXRayStackStack-BucketNotifications\u2026 \u2502\n\u2502     Handler: index.handler                                       \u2502\n\u2502     LastModified: 2022-04-17T18:32:29.881+0000                   \u2502\n\u2502     LastUpdateStatus: Successful                                 \u2502\n\u2502     MemorySize: 128                                              \u2502\n\u2502     PackageType: Zip                                             \u2502\n\u2502     RevisionId: fee4d397-44a6-4dfe-b070-9b0c8204d012             \u2502\n\u2502     Role: arn:aws:iam::840541460064:role/LambdaLayerXRayStackSt\u2026 \u2502\n\u2502     Runtime: python3.7                                           \u2502\n\u2502     State: Active                                                \u2502\n\u2502     Timeout: 300                                                 \u2502\n\u2502     TracingConfig:                                               \u2502\n\u2502       Mode: PassThrough                                          \u2502\n\u2502     Version: $LATEST                                             \u2502\n\u2502   Code:                                                          \u2502\n\u2502     Location: https://prod-04-2014-tasks.s3.us-east-1.amazonaws\u2026 \u2502\n\u2502     RepositoryType: S3                                           \u2502\n\u2502   Tags:                                                          \u2502\n\u2502     aws:cloudformation:stack-name: LambdaLayerXRayStackStack     \u2502\n\u2502     gc-project-name: xray-lambdalayers-cdk-python                \u2502\n\u2502     aws:cloudformation:stack-id: arn:aws:cloudformation:us-east\u2026 \u2502\n\u2502     aws:cloudformation:logical-id: BucketNotificationsHandler05\u2026 \u2502\n\u2502     gc-managed-by: grucloud                                      \u2502\n\u2502     gc-stage: dev                                                \u2502\n\u2502     gc-created-by-provider: aws                                  \u2502\n\u2502     Name: LambdaLayerXRayStackStack-BucketNotificationsHandl-1X\u2026 \u2502\n\u2502                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n')))}d.isMDXComponent=!0}}]);