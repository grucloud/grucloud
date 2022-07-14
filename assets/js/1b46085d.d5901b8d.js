"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[22359],{3905:(e,n,a)=>{a.d(n,{Zo:()=>p,kt:()=>d});var t=a(67294);function r(e,n,a){return n in e?Object.defineProperty(e,n,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[n]=a,e}function o(e,n){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);n&&(t=t.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),a.push.apply(a,t)}return a}function i(e){for(var n=1;n<arguments.length;n++){var a=null!=arguments[n]?arguments[n]:{};n%2?o(Object(a),!0).forEach((function(n){r(e,n,a[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(a,n))}))}return e}function l(e,n){if(null==e)return{};var a,t,r=function(e,n){if(null==e)return{};var a,t,r={},o=Object.keys(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||(r[a]=e[a]);return r}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(t=0;t<o.length;t++)a=o[t],n.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=t.createContext({}),c=function(e){var n=t.useContext(s),a=n;return e&&(a="function"==typeof e?e(n):i(i({},n),e)),a},p=function(e){var n=c(e.components);return t.createElement(s.Provider,{value:n},e.children)},u={inlineCode:"code",wrapper:function(e){var n=e.children;return t.createElement(t.Fragment,{},n)}},m=t.forwardRef((function(e,n){var a=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),m=c(a),d=r,g=m["".concat(s,".").concat(d)]||m[d]||u[d]||o;return a?t.createElement(g,i(i({ref:n},p),{},{components:a})):t.createElement(g,i({ref:n},p))}));function d(e,n){var a=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=m;var l={};for(var s in n)hasOwnProperty.call(n,s)&&(l[s]=n[s]);l.originalType=e,l.mdxType="string"==typeof e?e:r,i[1]=l;for(var c=2;c<o;c++)i[c]=a[c];return t.createElement.apply(null,i)}return t.createElement.apply(null,a)}m.displayName="MDXCreateElement"},65764:(e,n,a)=>{a.r(n),a.d(n,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var t=a(87462),r=(a(67294),a(3905));const o={id:"EventSourceMapping",title:"Event Source Mapping"},i=void 0,l={unversionedId:"aws/resources/Lambda/EventSourceMapping",id:"aws/resources/Lambda/EventSourceMapping",title:"Event Source Mapping",description:"Provides an Event Source Mapping",source:"@site/docs/aws/resources/Lambda/EventSourceMapping.md",sourceDirName:"aws/resources/Lambda",slug:"/aws/resources/Lambda/EventSourceMapping",permalink:"/docs/aws/resources/Lambda/EventSourceMapping",draft:!1,tags:[],version:"current",frontMatter:{id:"EventSourceMapping",title:"Event Source Mapping"},sidebar:"docs",previous:{title:"Stream",permalink:"/docs/aws/resources/Kinesis/Stream"},next:{title:"Function",permalink:"/docs/aws/resources/Lambda/Function"}},s={},c=[{value:"Examples",id:"examples",level:2},{value:"SQS Queue Source Mapping",id:"sqs-queue-source-mapping",level:3},{value:"Source Code Examples",id:"source-code-examples",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"List",id:"list",level:2}],p={toc:c};function u(e){let{components:n,...a}=e;return(0,r.kt)("wrapper",(0,t.Z)({},p,a,{components:n,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Provides an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/lambda/home"},"Event Source Mapping")),(0,r.kt)("h2",{id:"examples"},"Examples"),(0,r.kt)("h3",{id:"sqs-queue-source-mapping"},"SQS Queue Source Mapping"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Role",\n    group: "IAM",\n    name: "lambda-role",\n    properties: ({}) => ({\n      Path: "/",\n      AssumeRolePolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Sid: "",\n            Effect: "Allow",\n            Principal: {\n              Service: "lambda.amazonaws.com",\n            },\n            Action: "sts:AssumeRole",\n          },\n        ],\n      },\n    }),\n    dependencies: () => ({\n      policies: ["lambda-policy"],\n    }),\n  },\n  {\n    type: "Policy",\n    group: "IAM",\n    name: "lambda-policy",\n    properties: ({}) => ({\n      PolicyDocument: {\n        Version: "2012-10-17",\n        Statement: [\n          {\n            Action: ["logs:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n          {\n            Action: ["sqs:*"],\n            Effect: "Allow",\n            Resource: "*",\n          },\n        ],\n      },\n      Path: "/",\n      Description: "Allow logs",\n    }),\n  },\n  {\n    type: "Function",\n    group: "Lambda",\n    name: "lambda-hello-world",\n    properties: ({}) => ({\n      Handler: "helloworld.handler",\n      PackageType: "Zip",\n      Runtime: "nodejs14.x",\n      Description: "",\n      Timeout: 3,\n      MemorySize: 128,\n    }),\n    dependencies: () => ({\n      role: "lambda-role",\n    }),\n  },\n  {\n    type: "EventSourceMapping",\n    group: "Lambda",\n    name: "mapping-lambda-hello-world-my-queue-lambda",\n    properties: ({}) => ({\n      BatchSize: 10,\n      MaximumBatchingWindowInSeconds: 0,\n    }),\n    dependencies: () => ({\n      lambdaFunction: "lambda-hello-world",\n      sqsQueue: "my-queue-lambda",\n    }),\n  },\n  {\n    type: "Queue",\n    group: "SQS",\n    name: "my-queue-lambda",\n    properties: ({}) => ({\n      tags: {\n        "my-tag": "my-value",\n      },\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"source-code-examples"},"Source Code Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/example/aws/Lambda/nodejs/sqs-lambda/resources.js"},"sqs feeding lambda")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/blob/main/example/aws/Kinesis/kinesis-stream"},"kinesis stream feeding lambda"))),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-lambda/interfaces/createeventsourcemappingcommandinput.html"},"CreateEventSourceMappingCommandInput"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Lambda/Function"},"Lambda Function")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/SQS/Queue"},"SQS Queue")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Kinesis/Stream"},"Kinesis Stream"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"The list of event source mappings can be displayed and filtered with the type ",(0,r.kt)("strong",{parentName:"p"},"EventSourceMapping"),":"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc list -t EventSourceMapping\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws\n  \u2713 Initialising\n  \u2713 Listing 6/6\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 Lambda::EventSourceMapping from aws                                        \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: mapping-lambda-hello-world-my-queue                                    \u2502\n\u2502 managedByUs: Yes                                                             \u2502\n\u2502 live:                                                                        \u2502\n\u2502   UUID: 369cfa51-9364-4cba-88d4-7311317adc37                                 \u2502\n\u2502   StartingPosition: null                                                     \u2502\n\u2502   StartingPositionTimestamp: null                                            \u2502\n\u2502   BatchSize: 10                                                              \u2502\n\u2502   MaximumBatchingWindowInSeconds: 0                                          \u2502\n\u2502   ParallelizationFactor: null                                                \u2502\n\u2502   EventSourceArn: arn:aws:sqs:eu-west-2:840541460064:my-queue                \u2502\n\u2502   FunctionArn: arn:aws:lambda:eu-west-2:840541460064:function:lambda-hello-\u2026 \u2502\n\u2502   LastModified: 2021-09-23T13:46:06.664Z                                     \u2502\n\u2502   LastProcessingResult: null                                                 \u2502\n\u2502   State: Enabled                                                             \u2502\n\u2502   StateTransitionReason: USER_INITIATED                                      \u2502\n\u2502   MaximumRecordAgeInSeconds: null                                            \u2502\n\u2502   BisectBatchOnFunctionError: null                                           \u2502\n\u2502   MaximumRetryAttempts: null                                                 \u2502\n\u2502   TumblingWindowInSeconds: null                                              \u2502\n\u2502   Tags:                                                                      \u2502\n\u2502     gc-project-name: lambda-sqs-nodejs                                       \u2502\n\u2502     gc-managed-by: grucloud                                                  \u2502\n\u2502     gc-stage: dev                                                            \u2502\n\u2502     gc-created-by-provider: aws                                              \u2502\n\u2502     Name: lambda-hello-world                                                 \u2502\n\u2502                                                                              \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Lambda::EventSourceMapping \u2502 mapping-lambda-hello-world-my-queue            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t EventSourceMapping" executed in 13s\n')))}u.isMDXComponent=!0}}]);