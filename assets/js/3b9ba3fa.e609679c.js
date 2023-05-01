"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[19666],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>S});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var o=a.createContext({}),c=function(e){var t=a.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(o.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,o=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(n),d=r,S=p["".concat(o,".").concat(d)]||p[d]||m[d]||s;return n?a.createElement(S,i(i({ref:t},u),{},{components:n})):a.createElement(S,i({ref:t},u))}));function S(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,i=new Array(s);i[0]=d;var l={};for(var o in t)hasOwnProperty.call(t,o)&&(l[o]=t[o]);l.originalType=e,l[p]="string"==typeof e?e:r,i[1]=l;for(var c=2;c<s;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8496:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>m,frontMatter:()=>s,metadata:()=>l,toc:()=>c});var a=n(87462),r=(n(67294),n(3905));const s={id:"SNSTopic",title:"Topic"},i=void 0,l={unversionedId:"aws/resources/SNS/SNSTopic",id:"aws/resources/SNS/SNSTopic",title:"Topic",description:"Manages an SNS Topic.",source:"@site/docs/aws/resources/SNS/Topic.md",sourceDirName:"aws/resources/SNS",slug:"/aws/resources/SNS/SNSTopic",permalink:"/docs/aws/resources/SNS/SNSTopic",draft:!1,tags:[],version:"current",frontMatter:{id:"SNSTopic",title:"Topic"},sidebar:"docs",previous:{title:"Subscription",permalink:"/docs/aws/resources/SNS/SNSSubscription"},next:{title:"Queue",permalink:"/docs/aws/resources/SQS/Queue"}},o={},c=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],u={toc:c},p="wrapper";function m(e){let{components:t,...n}=e;return(0,r.kt)(p,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Manages an ",(0,r.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/sns/v3/home?#/"},"SNS Topic"),"."),(0,r.kt)("h2",{id:"sample-code"},"Sample code"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "Topic",\n    group: "SNS",\n    name: "MySnsTopic",\n    properties: ({ config }) => ({\n      Attributes: {\n        Policy: {\n          Version: "2008-10-17",\n          Id: "__default_policy_ID",\n          Statement: [\n            {\n              Sid: "__default_statement_ID",\n              Effect: "Allow",\n              Principal: {\n                AWS: "*",\n              },\n              Action: [\n                "SNS:GetTopicAttributes",\n                "SNS:SetTopicAttributes",\n                "SNS:AddPermission",\n                "SNS:RemovePermission",\n                "SNS:DeleteTopic",\n                "SNS:Subscribe",\n                "SNS:ListSubscriptionsByTopic",\n                "SNS:Publish",\n              ],\n              Resource: `arn:aws:sns:${\n                config.region\n              }:${config.accountId()}:MySnsTopic`,\n              Condition: {\n                StringEquals: {\n                  "AWS:SourceOwner": `${config.accountId()}`,\n                },\n              },\n            },\n          ],\n        },\n        DisplayName: "",\n        DeliveryPolicy: {\n          http: {\n            defaultHealthyRetryPolicy: {\n              minDelayTarget: 20,\n              maxDelayTarget: 20,\n              numRetries: 3,\n              numMaxDelayRetries: 0,\n              numNoDelayRetries: 0,\n              numMinDelayRetries: 0,\n              backoffFunction: "linear",\n            },\n            disableSubscriptionOverrides: false,\n          },\n        },\n      },\n    }),\n  },\n];\n')),(0,r.kt)("h2",{id:"properties"},"Properties"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-sns/interfaces/createtopiccommandinput.html"},"CreateTopicCommandInput"))),(0,r.kt)("h2",{id:"dependencies"},"Dependencies"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/KMS/Key"},"KMS Key"))),(0,r.kt)("h2",{id:"used-by"},"Used By"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"../Backup/VaultNotification.md"},"Backup Vault Notification")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/Budgets/Budget"},"Budgets Budget")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudTrail/CloudTrail"},"CloudTrail Trail")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatch/MetricAlarm"},"CloudWatch MetricAlarm")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchEvents/Target"},"CloudWatchEvent Target")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"../ElastiCache/Cluster.md"},"ElastiCache Cluster")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/SNS/SNSSubscription"},"SNS Subscription")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/SQS/Queue"},"SQS Queue")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/StepFunctions/StateMachine"},"StepFunctions StateMachine")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Bucket"},"S3 Bucket"))),(0,r.kt)("h2",{id:"full-examples"},"Full Examples"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/SNS/sns-simple"},"Simple example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/AppSync/graphql-alarm"},"graphql-alarm")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/Budgets/budget-simple"},"budgets")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatch/alarm-stop-ec2"},"alarm-stop-ec2")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/Route53/health-check"},"Route53 health check")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/S3/s3-sns"},"s3 sns")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sfn-sns"},"serverless-patterns sfn-sns")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sns-lambda"},"serverless-patterns sns-lambda")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/sns-sqs"},"serverless-patterns sns-sqs")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/ta-eventbridge-lambda-s3"},"serverless-patterns ta-eventbridge-lambda-s3"))),(0,r.kt)("h2",{id:"list"},"List"),(0,r.kt)("p",null,"The topics can be filtered with the ",(0,r.kt)("em",{parentName:"p"},"Topic")," type:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Topic\n")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 SNS::Topic from aws                                                                         \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: my-topic                                                                                \u2502\n\u2502 managedByUs: Yes                                                                              \u2502\n\u2502 live:                                                                                         \u2502\n\u2502   Attributes:                                                                                 \u2502\n\u2502     Policy:                                                                                   \u2502\n\u2502       Version: 2008-10-17                                                                     \u2502\n\u2502       Id: __default_policy_ID                                                                 \u2502\n\u2502       Statement:                                                                              \u2502\n\u2502         - Sid: __default_statement_ID                                                         \u2502\n\u2502           Effect: Allow                                                                       \u2502\n\u2502           Principal:                                                                          \u2502\n\u2502             AWS: *                                                                            \u2502\n\u2502           Action:                                                                             \u2502\n\u2502             - "SNS:GetTopicAttributes"                                                        \u2502\n\u2502             - "SNS:SetTopicAttributes"                                                        \u2502\n\u2502             - "SNS:AddPermission"                                                             \u2502\n\u2502             - "SNS:RemovePermission"                                                          \u2502\n\u2502             - "SNS:DeleteTopic"                                                               \u2502\n\u2502             - "SNS:Subscribe"                                                                 \u2502\n\u2502             - "SNS:ListSubscriptionsByTopic"                                                  \u2502\n\u2502             - "SNS:Publish"                                                                   \u2502\n\u2502           Resource: arn:aws:sns:us-east-1:840541460064:my-topic                               \u2502\n\u2502           Condition:                                                                          \u2502\n\u2502             StringEquals:                                                                     \u2502\n\u2502               AWS:SourceOwner: 840541460064                                                   \u2502\n\u2502     Owner: 840541460064                                                                       \u2502\n\u2502     SubscriptionsPending: 0                                                                   \u2502\n\u2502     TopicArn: arn:aws:sns:us-east-1:840541460064:my-topic                                     \u2502\n\u2502     SubscriptionsConfirmed: 0                                                                 \u2502\n\u2502     DisplayName: My Topic                                                                     \u2502\n\u2502     DeliveryPolicy:                                                                           \u2502\n\u2502       http:                                                                                   \u2502\n\u2502         defaultHealthyRetryPolicy:                                                            \u2502\n\u2502           minDelayTarget: 20                                                                  \u2502\n\u2502           maxDelayTarget: 20                                                                  \u2502\n\u2502           numRetries: 3                                                                       \u2502\n\u2502           numMaxDelayRetries: 0                                                               \u2502\n\u2502           numNoDelayRetries: 0                                                                \u2502\n\u2502           numMinDelayRetries: 0                                                               \u2502\n\u2502           backoffFunction: linear                                                             \u2502\n\u2502         disableSubscriptionOverrides: false                                                   \u2502\n\u2502     SubscriptionsDeleted: 0                                                                   \u2502\n\u2502   Tags:                                                                                       \u2502\n\u2502     - Key: gc-created-by-provider                                                             \u2502\n\u2502       Value: aws                                                                              \u2502\n\u2502     - Key: gc-managed-by                                                                      \u2502\n\u2502       Value: grucloud                                                                         \u2502\n\u2502     - Key: gc-project-name                                                                    \u2502\n\u2502       Value: sns-simple                                                                       \u2502\n\u2502     - Key: gc-stage                                                                           \u2502\n\u2502       Value: dev                                                                              \u2502\n\u2502     - Key: mykey                                                                              \u2502\n\u2502       Value: myvalue                                                                          \u2502\n\u2502     - Key: Name                                                                               \u2502\n\u2502       Value: my-topic                                                                         \u2502\n\u2502                                                                                               \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                                          \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 SNS::Topic \u2502 my-topic                                                                        \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Topic" executed in 6s, 116 MB\n')))}m.isMDXComponent=!0}}]);