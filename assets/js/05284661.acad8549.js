"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[331],{3905:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var r=n(67294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function u(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},s=Object.keys(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(r=0;r<s.length;r++)n=s[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var o=r.createContext({}),i=function(e){var t=r.useContext(o),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=i(e.components);return r.createElement(o.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,s=e.originalType,o=e.parentName,c=u(e,["components","mdxType","originalType","parentName"]),p=i(n),m=a,f=p["".concat(o,".").concat(m)]||p[m]||d[m]||s;return n?r.createElement(f,l(l({ref:t},c),{},{components:n})):r.createElement(f,l({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var s=n.length,l=new Array(s);l[0]=m;var u={};for(var o in t)hasOwnProperty.call(t,o)&&(u[o]=t[o]);u.originalType=e,u[p]="string"==typeof e?e:a,l[1]=u;for(var i=2;i<s;i++)l[i]=n[i];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},89518:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>o,contentTitle:()=>l,default:()=>d,frontMatter:()=>s,metadata:()=>u,toc:()=>i});var r=n(87462),a=(n(67294),n(3905));const s={id:"ClusterV2",title:"ClusterV2"},l=void 0,u={unversionedId:"aws/resources/MSK/ClusterV2",id:"aws/resources/MSK/ClusterV2",title:"ClusterV2",description:"Manages a MSK Cluster V2.",source:"@site/docs/aws/resources/MSK/ClusterV2.md",sourceDirName:"aws/resources/MSK",slug:"/aws/resources/MSK/ClusterV2",permalink:"/docs/aws/resources/MSK/ClusterV2",draft:!1,tags:[],version:"current",frontMatter:{id:"ClusterV2",title:"ClusterV2"},sidebar:"docs",previous:{title:"Configuration",permalink:"/docs/aws/resources/MQ/Configuration"},next:{title:"Configuration",permalink:"/docs/aws/resources/MSK/Configuration"}},o={},i=[{value:"Sample code",id:"sample-code",level:2},{value:"Properties",id:"properties",level:2},{value:"Dependencies",id:"dependencies",level:2},{value:"Used By",id:"used-by",level:2},{value:"Full Examples",id:"full-examples",level:2},{value:"List",id:"list",level:2}],c={toc:i},p="wrapper";function d(e){let{components:t,...n}=e;return(0,a.kt)(p,(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Manages a ",(0,a.kt)("a",{parentName:"p",href:"https://console.aws.amazon.com/msk/home#/home"},"MSK Cluster V2"),"."),(0,a.kt)("h2",{id:"sample-code"},"Sample code"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'exports.createResources = () => [\n  {\n    type: "ClusterV2",\n    group: "MSK",\n    properties: ({ getId }) => ({\n      ClusterName: "demo-cluster-1",\n      ClusterType: "SERVERLESS",\n      Serverless: {\n        ClientAuthentication: {\n          Sasl: {\n            Iam: {\n              Enabled: true,\n            },\n          },\n        },\n        VpcConfigs: [\n          {\n            SecurityGroupIds: [\n              `${getId({\n                type: "SecurityGroup",\n                group: "EC2",\n                name: "sg::vpc-default::default",\n              })}`,\n            ],\n            SubnetIds: [\n              `${getId({\n                type: "Subnet",\n                group: "EC2",\n                name: "vpc-default::subnet-default-a",\n              })}`,\n              `${getId({\n                type: "Subnet",\n                group: "EC2",\n                name: "vpc-default::subnet-default-d",\n              })}`,\n              `${getId({\n                type: "Subnet",\n                group: "EC2",\n                name: "vpc-default::subnet-default-f",\n              })}`,\n            ],\n          },\n        ],\n      },\n    }),\n    dependencies: ({}) => ({\n      subnets: [\n        "vpc-default::subnet-default-a",\n        "vpc-default::subnet-default-d",\n        "vpc-default::subnet-default-f",\n      ],\n      securityGroups: ["sg::vpc-default::default"],\n    }),\n  },\n];\n')),(0,a.kt)("h2",{id:"properties"},"Properties"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kafka/interfaces/createclusterv2commandinput.html"},"CreateClusterV2CommandInput"))),(0,a.kt)("h2",{id:"dependencies"},"Dependencies"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/SecurityGroup"},"EC2 Security Group")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/EC2/Subnet"},"EC2 Subnet")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/Firehose/DeliveryStream"},"Firehose Delivery Stream")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/KMS/Key"},"KMS Key")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/MSK/Configuration"},"MSK Configuration")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"/docs/aws/resources/S3/Bucket"},"S3 Bucket"))),(0,a.kt)("h2",{id:"used-by"},"Used By"),(0,a.kt)("h2",{id:"full-examples"},"Full Examples"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"https://github.com/grucloud/grucloud/tree/main/examples/aws/MSK/msk-serverless-simple"},"msk v2 simple"))),(0,a.kt)("h2",{id:"list"},"List"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sh"},"gc l -t MSK::ClusterV2\n")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-txt"},'Listing resources on 1 provider: aws\n\u2713 aws us-east-1\n  \u2713 Initialising\n  \u2713 Listing 1/1\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 1 MSK::ClusterV2 from aws                                                 \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 name: demo-cluster-1                                                      \u2502\n\u2502 managedByUs: Yes                                                          \u2502\n\u2502 live:                                                                     \u2502\n\u2502   ClusterArn: arn:aws:kafka:us-east-1:840541460064:cluster/demo-cluster-\u2026 \u2502\n\u2502   ClusterName: demo-cluster-1                                             \u2502\n\u2502   ClusterType: SERVERLESS                                                 \u2502\n\u2502   CreationTime: 2022-10-16T16:50:48.007Z                                  \u2502\n\u2502   CurrentVersion: K2EUQ1WTGCTBG2                                          \u2502\n\u2502   Serverless:                                                             \u2502\n\u2502     ClientAuthentication:                                                 \u2502\n\u2502       Sasl:                                                               \u2502\n\u2502         Iam:                                                              \u2502\n\u2502           Enabled: true                                                   \u2502\n\u2502     VpcConfigs:                                                           \u2502\n\u2502       - SecurityGroupIds:                                                 \u2502\n\u2502           - "sg-4e82a670"                                                 \u2502\n\u2502         SubnetIds:                                                        \u2502\n\u2502           - "subnet-b80a4ff5"                                             \u2502\n\u2502           - "subnet-41e85860"                                             \u2502\n\u2502           - "subnet-50cca05e"                                             \u2502\n\u2502   State: ACTIVE                                                           \u2502\n\u2502   Tags:                                                                   \u2502\n\u2502     gc-managed-by: grucloud                                               \u2502\n\u2502     gc-project-name: msk-serverless                                       \u2502\n\u2502     gc-stage: dev                                                         \u2502\n\u2502     gc-created-by-provider: aws                                           \u2502\n\u2502     Name: demo-cluster-1                                                  \u2502\n\u2502                                                                           \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n\n\nList Summary:\nProvider: aws\n\u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510\n\u2502 aws                                                                      \u2502\n\u251c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u252c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2524\n\u2502 MSK::ClusterV2 \u2502 demo-cluster-1                                          \u2502\n\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2534\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518\n1 resource, 1 type, 1 provider\nCommand "gc l -t MSK::ClusterV2" executed in 4s, 100 MB\n')))}d.isMDXComponent=!0}}]);