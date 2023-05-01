"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[21685],{3905:(e,r,t)=>{t.d(r,{Zo:()=>u,kt:()=>y});var n=t(67294);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function i(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function s(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?i(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function o(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)t=i[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=n.createContext({}),c=function(e){var r=n.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):s(s({},r),e)),t},u=function(e){var r=c(e.components);return n.createElement(l.Provider,{value:r},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},d=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),p=c(t),d=a,y=p["".concat(l,".").concat(d)]||p[d]||m[d]||i;return t?n.createElement(y,s(s({ref:r},u),{},{components:t})):n.createElement(y,s({ref:r},u))}));function y(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var i=t.length,s=new Array(i);s[0]=d;var o={};for(var l in r)hasOwnProperty.call(r,l)&&(o[l]=r[l]);o.originalType=e,o[p]="string"==typeof e?e:a,s[1]=o;for(var c=2;c<i;c++)s[c]=t[c];return n.createElement.apply(null,s)}return n.createElement.apply(null,t)}d.displayName="MDXCreateElement"},51201:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>i,metadata:()=>o,toc:()=>c});var n=t(87462),a=(t(67294),t(3905));const i={id:"DeliveryStream",title:"DeliveryStream"},s=void 0,o={unversionedId:"aws/resources/Firehose/DeliveryStream",id:"aws/resources/Firehose/DeliveryStream",title:"DeliveryStream",description:"Manages an Firehose Delivery Stream.",source:"@site/docs/aws/resources/Firehose/DeliveryStream.md",sourceDirName:"aws/resources/Firehose",slug:"/aws/resources/Firehose/DeliveryStream",permalink:"/docs/aws/resources/Firehose/DeliveryStream",draft:!1,tags:[],version:"current",frontMatter:{id:"DeliveryStream",title:"DeliveryStream"},sidebar:"docs",previous:{title:"Target Group",permalink:"/docs/aws/resources/ElasticLoadBalancingV2/TargetGroup"},next:{title:"Accelerator",permalink:"/docs/aws/resources/GlobalAccelerator/Accelerator"}},l={},c=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],u={toc:c},p="wrapper";function m(e){let{components:r,...t}=e;return(0,a.kt)(p,(0,n.Z)({},u,t,{components:r,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages an ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/firehose/home?#/streams"},"Firehose Delivery Stream"),"."),(0,a.kt)("h2",{id:"sample-code"},"Sample code"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},"exports.createResources = () => [];\n")),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-firehose/interfaces/createdeliverystreamcommandinput.html"},"CreateDeliveryStreamCommandInput"))),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/IAM/Role"},"IAM Role"))),(0,a.kt)("h2",{id:"used-by"},"Used By"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/CloudWatchLogs/SubscriptionFilter"},"CloudWatchLogs Subscription Filter")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/FlowLogs"},"EC2 FlowLogs")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/ElastiCache/CacheCluster"},"ElastiCache Cluster")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/MQ/Broker"},"MQ Broker")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/MSK/ClusterV2"},"MSK ClusterV2"))),(0,a.kt)("h2",{id:"full-examples"},"Full Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/Firehose/firehose-delivery-stream"},"Step function invoking a Glue job"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("p",null,"The delivery stream can be filtered with the ",(0,a.kt)("em",{parentName:"p"},"Firehose::DeliveryStream")," type:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t Firehose::DeliveryStream\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 Firehose::DeliveryStream from aws                                       \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: delivery-stream-s3                                                  \u2502\n\u2502 managedByUs: Yes                                                          \u2502\n\u2502 live:                                                                     \u2502\n\u2502   CreateTimestamp: 2022-11-03T17:45:31.505Z                               \u2502\n\u2502   DeliveryStreamARN: arn:aws:firehose:us-east-1:840541460064:deliverystr\u2026 \u2502\n\u2502   DeliveryStreamEncryptionConfiguration:                                  \u2502\n\u2502     Status: DISABLED                                                      \u2502\n\u2502   DeliveryStreamName: delivery-stream-s3                                  \u2502\n\u2502   DeliveryStreamStatus: ACTIVE                                            \u2502\n\u2502   DeliveryStreamType: DirectPut                                           \u2502\n\u2502   HasMoreDestinations: false                                              \u2502\n\u2502   VersionId: 1                                                            \u2502\n\u2502   S3DestinationDescription:                                               \u2502\n\u2502     BucketARN: arn:aws:s3:::gc-firehose-destination                       \u2502\n\u2502     BufferingHints:                                                       \u2502\n\u2502       IntervalInSeconds: 300                                              \u2502\n\u2502       SizeInMBs: 5                                                        \u2502\n\u2502     CloudWatchLoggingOptions:                                             \u2502\n\u2502       Enabled: true                                                       \u2502\n\u2502       LogGroupName: /aws/kinesisfirehose/delivery-stream-s3               \u2502\n\u2502       LogStreamName: DestinationDelivery                                  \u2502\n\u2502     CompressionFormat: UNCOMPRESSED                                       \u2502\n\u2502     EncryptionConfiguration:                                              \u2502\n\u2502       NoEncryptionConfig: NoEncryption                                    \u2502\n\u2502     ErrorOutputPrefix:                                                    \u2502\n\u2502     Prefix:                                                               \u2502\n\u2502     RoleARN: arn:aws:iam::840541460064:role/service-role/KinesisFirehose\u2026 \u2502\n\u2502   ExtendedS3DestinationConfiguration:                                     \u2502\n\u2502     BucketARN: arn:aws:s3:::gc-firehose-destination                       \u2502\n\u2502     BufferingHints:                                                       \u2502\n\u2502       IntervalInSeconds: 300                                              \u2502\n\u2502       SizeInMBs: 5                                                        \u2502\n\u2502     CloudWatchLoggingOptions:                                             \u2502\n\u2502       Enabled: true                                                       \u2502\n\u2502       LogGroupName: /aws/kinesisfirehose/delivery-stream-s3               \u2502\n\u2502       LogStreamName: DestinationDelivery                                  \u2502\n\u2502     CompressionFormat: UNCOMPRESSED                                       \u2502\n\u2502     DataFormatConversionConfiguration:                                    \u2502\n\u2502       Enabled: false                                                      \u2502\n\u2502     EncryptionConfiguration:                                              \u2502\n\u2502       NoEncryptionConfig: NoEncryption                                    \u2502\n\u2502     ErrorOutputPrefix:                                                    \u2502\n\u2502     Prefix:                                                               \u2502\n\u2502     ProcessingConfiguration:                                              \u2502\n\u2502       Enabled: false                                                      \u2502\n\u2502       Processors: []                                                      \u2502\n\u2502     RoleARN: arn:aws:iam::840541460064:role/service-role/KinesisFirehose\u2026 \u2502\n\u2502     S3BackupMode: Disabled                                                \u2502\n\u2502   Tags:                                                                   \u2502\n\u2502     - Key: gc-created-by-provider                                         \u2502\n\u2502       Value: aws                                                          \u2502\n\u2502     - Key: gc-managed-by                                                  \u2502\n\u2502       Value: grucloud                                                     \u2502\n\u2502     - Key: gc-project-name                                                \u2502\n\u2502       Value: flow-logs-firehose                                           \u2502\n\u2502     - Key: gc-stage                                                       \u2502\n\u2502       Value: dev                                                          \u2502\n\u2502     - Key: LogDeliveryEnabled                                             \u2502\n\u2502       Value: true                                                         \u2502\n\u2502     - Key: Name                                                           \u2502\n\u2502       Value: delivery-stream-s3                                           \u2502\n\u2502                                                                           \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 Firehose::DeliveryStream \u2502 delivery-stream-s3                            \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t Firehose::DeliveryStream" executed in 4s, 114 MB\n')))}m.isMDXComponent=!0}}]);