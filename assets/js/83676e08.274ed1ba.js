"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[80748],{3905:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>d});var r=a(67294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=r.createContext({}),c=function(e){var t=r.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},u=function(e){var t=c(e.components);return r.createElement(i.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,i=e.parentName,u=o(e,["components","mdxType","originalType","parentName"]),m=c(a),d=n,h=m["".concat(i,".").concat(d)]||m[d]||p[d]||l;return a?r.createElement(h,s(s({ref:t},u),{},{components:a})):r.createElement(h,s({ref:t},u))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,s=new Array(l);s[0]=m;var o={};for(var i in t)hasOwnProperty.call(t,i)&&(o[i]=t[i]);o.originalType=e,o.mdxType="string"==typeof e?e:n,s[1]=o;for(var c=2;c<l;c++)s[c]=a[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},91439:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>i,contentTitle:()=>s,default:()=>p,frontMatter:()=>l,metadata:()=>o,toc:()=>c});var r=a(87462),n=(a(67294),a(3905));const l={id:"MetricAlarm",title:"Metric Alarm"},s=void 0,o={unversionedId:"aws/resources/CloudWatch/MetricAlarm",id:"aws/resources/CloudWatch/MetricAlarm",title:"Metric Alarm",description:"Manages an Cloud Watch Metric Alarm.",source:"@site/docs/aws/resources/CloudWatch/MetricAlarm.md",sourceDirName:"aws/resources/CloudWatch",slug:"/aws/resources/CloudWatch/MetricAlarm",permalink:"/docs/aws/resources/CloudWatch/MetricAlarm",draft:!1,tags:[],version:"current",frontMatter:{id:"MetricAlarm",title:"Metric Alarm"},sidebar:"docs",previous:{title:"CloudTrail",permalink:"/docs/aws/resources/CloudTrail/CloudTrail"},next:{title:"Api Destination",permalink:"/docs/aws/resources/CloudWatchEvents/ApiDestination"}},i={},c=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"Used By",id:"used-by",level:2},{value:"List",id:"list",level:2}],u={toc:c};function p(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("p",null,"Manages an ",(0,n.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/cloudwatch/home?#alarmsV2:alarm"},"Cloud Watch Metric Alarm"),"."),(0,n.kt)("h2",{id:"sample-code"},"Sample code"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "MetricAlarm",\n    group: "CloudWatch",\n    properties: ({ config, getId }) => ({\n      AlarmName: "alarm-stop-ec2",\n      AlarmActions: [\n        `arn:aws:swf:${\n          config.region\n        }:${config.accountId()}:action/actions/AWS_EC2.InstanceId.Reboot/1.0`,\n        `arn:aws:sns:${\n          config.region\n        }:${config.accountId()}:Default_CloudWatch_Alarms_Topic`,\n      ],\n      MetricName: "CPUUtilization",\n      Namespace: "AWS/EC2",\n      Statistic: "Average",\n      Dimensions: [\n        {\n          Name: "InstanceId",\n          Value: `${getId({\n            type: "Instance",\n            group: "EC2",\n            name: "ec2-for-alarm",\n          })}`,\n        },\n      ],\n      Period: 300,\n      EvaluationPeriods: 1,\n      DatapointsToAlarm: 1,\n      Threshold: 5,\n      ComparisonOperator: "LessThanOrEqualToThreshold",\n      TreatMissingData: "missing",\n    }),\n    dependencies: ({}) => ({\n      snsTopic: "Default_CloudWatch_Alarms_Topic",\n      ec2Instance: "ec2-for-alarm",\n    }),\n  },\n];\n')),(0,n.kt)("h2",{id:"properties"},"Properties"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudwatch/interfaces/putmetricalarmcommandinput.html"},"PutMetricMetricAlarmCommandInput"))),(0,n.kt)("h2",{id:"full-examples"},"Full Examples"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/CloudWatch/alarm-stop-ec2"},"alarm-stop-ec2")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/AppSync/graphql-alarm"},"graphql-alarm"))),(0,n.kt)("p",null,"##\xa0Dependencies"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/SNS/SNSTopic"},"SNS Topic")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/AppSync/GraphqlApi"},"AppSync Graphql")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/ACM/Certificate"},"Certificate")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/EC2"},"EC2 Instance")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/HealthCheck"},"Route53 Health Check"))),(0,n.kt)("h2",{id:"used-by"},"Used By"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("a",{parentName:"li",href:"/docs/aws/resources/Route53/HealthCheck"},"Route53 Health Check"))),(0,n.kt)("h2",{id:"list"},"List"),(0,n.kt)("p",null,"The alarms can be filtered with the ",(0,n.kt)("em",{parentName:"p"},"CloudWatch::MetricAlarm")," type:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t CloudWatch::MetricAlarm\n")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 CloudWatch::MetricAlarm from aws                                    \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: alarm-stop-ec2                                                  \u2502\n\u2502 managedByUs: Yes                                                      \u2502\n\u2502 live:                                                                 \u2502\n\u2502   AlarmName: alarm-stop-ec2                                           \u2502\n\u2502   AlarmArn: arn:aws:cloudwatch:us-east-1:840541460064:alarm:alarm-st\u2026 \u2502\n\u2502   AlarmConfigurationUpdatedTimestamp: 2022-07-05T08:44:04.405Z        \u2502\n\u2502   ActionsEnabled: true                                                \u2502\n\u2502   OKActions: []                                                       \u2502\n\u2502   AlarmActions:                                                       \u2502\n\u2502     - "arn:aws:swf:us-east-1:840541460064:action/actions/AWS_EC2.Ins\u2026 \u2502\n\u2502     - "arn:aws:sns:us-east-1:840541460064:Default_CloudWatch_Alarms_\u2026 \u2502\n\u2502   InsufficientDataActions: []                                         \u2502\n\u2502   StateValue: INSUFFICIENT_DATA                                       \u2502\n\u2502   StateReason: Unchecked: Initial alarm creation                      \u2502\n\u2502   StateUpdatedTimestamp: 2022-07-05T08:43:25.699Z                     \u2502\n\u2502   MetricName: CPUUtilization                                          \u2502\n\u2502   Namespace: AWS/EC2                                                  \u2502\n\u2502   Statistic: Average                                                  \u2502\n\u2502   Dimensions:                                                         \u2502\n\u2502     - Name: InstanceId                                                \u2502\n\u2502       Value: i-0888ad1949ef52e16                                      \u2502\n\u2502   Period: 300                                                         \u2502\n\u2502   EvaluationPeriods: 1                                                \u2502\n\u2502   DatapointsToAlarm: 1                                                \u2502\n\u2502   Threshold: 5                                                        \u2502\n\u2502   ComparisonOperator: LessThanOrEqualToThreshold                      \u2502\n\u2502   TreatMissingData: missing                                           \u2502\n\u2502                                                                       \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                  \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 CloudWatch::MetricAlarm \u2502 alarm-stop-ec2                             \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t CloudWatch::MetricAlarm" executed in 11s, 112 MB\n')))}p.isMDXComponent=!0}}]);